let shwahedDataList = [];

async function toggleShwahed() {
    let shwahedButton = document.getElementById('shwahed');
    let shwahedContainer = document.querySelector('.shwahed-container');

    if (shwahedButton.classList.contains('shwahed-clicked')){
        shwahedButton.classList.remove('shwahed-clicked');
        shwahedContainer.style.display = 'none'; // Hide the container
        if (shwahedButton) {
            const rect = shwahedButton.getBoundingClientRect();
            const isVisible =
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth);
        
            if (!isVisible) {
                shwahedButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    } else {
        shwahedButton.classList.add('shwahed-clicked');
        await displayShwahed();
        shwahedContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }
}



async function displayShwahed() {
    let shwahedButton = document.getElementById('shwahed');
    if (!shwahedButton.classList.contains('shwahed-clicked')){ // call from function after changing khelaf array
        return;
    } else {
        let shwahedContainer = document.querySelector('.shwahed-container');
        shwahedContainer.style.display = 'block'; // Show the container

        shwahedDataList = [];
        shwahedDataList = await updateShwahed(); // Fetch the shwahed data

        await updateShwahedHTML();

    }
}


let containShwahed = false;

function getContainShwahed() {
    return containShwahed;
}

async function updateShwahedHTML() { // call from button
    let shwahedTextContainer = document.querySelector('.shwahed-text-container');

    let activeNathmIDs = getActiveNathmIDs();
    let activeKhelafFilters = getActiveKhelafFilters();

    // Clear previous content
    shwahedTextContainer.innerHTML = '';
    containShwahed = false;

    if (!shwahedDataList || shwahedDataList.length === 0) {
        shwahedTextContainer.textContent = 'لم يتم إضافة أي خلاف'; // Display a message if no data
        shwahedTextContainer.style.marginTop = '20px'; // Add space above
        return;
    }
    
    if ( activeNathmIDs.length === 0) {
        shwahedTextContainer.textContent = 'لم يتم تحديد النظم'; // Display a message if no data
        shwahedTextContainer.style.marginTop = '20px'; // Add space above

        const nathmButtons = document.querySelector('.nathm-buttons').querySelectorAll('.nathm-button');
        nathmButtons.forEach(button => {
            showError(button);
        });
        return;
    }

    if (activeKhelafFilters.length === 0) {
        shwahedTextContainer.textContent = 'لم يتم تحديد نوع الشواهد'; // Display a message if no Khelaf filters selected
        shwahedTextContainer.style.marginTop = '20px'; // Add space above

        const nathmButtons = document.querySelector('.khelaf-buttons').querySelectorAll('.khelaf-button');
        nathmButtons.forEach(button => {
            showError(button);
        });
        
        return;
    }

    let hasShwahed = false;

    // Populate the container with shwahed data
    shwahedDataList.forEach(entry => {
        if (entry.shwahed && entry.shwahed.length > 0 && activeKhelafFilters.some(filter => filter(entry.KhelafID))) {
            let filteredShwahed = entry.shwahed.filter(shwahed => activeNathmIDs.includes(shwahed.NathmID));
            if (filteredShwahed.length > 0) {
                hasShwahed = true;
                let khelafContainer = document.createElement('div');
                khelafContainer.classList.add('khelaf-entry');

                let nameWordContainer = document.createElement('div');
                nameWordContainer.classList.add('nameWordContainer');

                // Display Khelaf details
                let khelafNameSh = document.createElement('p');
                khelafNameSh.classList.add('khelafNameSh');
                khelafNameSh.textContent = `${entry.KhelafName}`;
                nameWordContainer.appendChild(khelafNameSh);

                if (! (entry.KhelafWords.length === 1 && entry.KhelafWords[0] === entry.KhelafName) ){
                    let KhelafWordsSh = document.createElement('p');
                    KhelafWordsSh.classList.add('KhelafWordsSh');
                    KhelafWordsSh.textContent = `[ ${entry.KhelafWords.join('، ')} ]`;
                    nameWordContainer.appendChild(KhelafWordsSh);
                }

                khelafContainer.appendChild(nameWordContainer);

                // Display filtered Shwahed
                let list = document.createElement('ul');
                filteredShwahed.forEach(shwahed => {
                    let listItem = document.createElement('li');
                    listItem.textContent = `${shwahed.ShahedText}`;
                    listItem.innerHTML = formatShahedText(shwahed.ShahedText);
                    listItem.classList.add('shahed')

                    if (shwahed.NathmID === "1") {
                        listItem.classList.add('taybah');
                    } else if (shwahed.NathmID === "2") {
                        listItem.classList.add('shatbyah');
                    } else if (shwahed.NathmID === "3") {
                        listItem.classList.add('dorrah');
                    } 
                    list.appendChild(listItem);
                });
                khelafContainer.appendChild(list);

                shwahedTextContainer.appendChild(khelafContainer);
            }
        }
    });

    if (!hasShwahed) {
        shwahedTextContainer.textContent = 'لا توجد شواهد متاحة'; // Display a message if no data
    } else {
        containShwahed = true;
    }
}


// Function to format ShahedText
function formatShahedText(text) {
    let formattedText = text.split('//').map((part, index) => {
        let subParts = part.split('>>');
        
        if (subParts.length === 2) {
            return `
                <div class="shahed-line">
                    ${formatShahedPart(subParts[0].trim(), "right")}
                    ${formatShahedPart(subParts[1].trim(), "left")}
                </div>`;
        } else if (index === 0 || text.includes('//')){
            return `
                <div class="shahed-line">
                    ${formatShahedPart(part.trim(), "right")}
                    ${formatShahedPart('...', "left")}
                </div>`;
        } else {
            return `
                <div class="shahed-line">
                    ${formatShahedPart('...', "right")}
                    ${formatShahedPart(part.trim(), "left")}
                </div>`;            
        }
    }).join('');
    
    return formattedText
        .replace(/\((.*?)\)/g, '<span style="color: #7a9eae;">$1</span>')
        .replace(/\[(.*?)\]/g, '<span style="color: #BC403A;">$1</span>');
}

// Helper function to format each part
function formatShahedPart(part, position) {
    const isDotted = part.includes("...")|| part==="";
    let adjustedPart = part;
    const requiredWidth = 200;  // Target width for each part
    const maxIterations = 300;   // Safety limit for iterations to avoid infinite loop
    let iterations = 0;

    if (isDotted) {
        // Add Tatweel (ـ) after the last occurrence of (ـ) to stretch text
        const lastDotIndex = part.lastIndexOf("...");

        if (lastDotIndex !== -1) {
            // Split the text into two parts: before the last (ـ) and after it
            let beforeLastDot = part.substring(0, lastDotIndex + 1);  // Text up to and including the last (ـ)
            const afterLastDot = part.substring(lastDotIndex + 1);     // Text after the last (ـ)

            // Calculate the remaining space needed to reach the required width
            while (getTextWidth(adjustedPart, "16px 'Amiri'") < requiredWidth && iterations < maxIterations) {
                beforeLastDot += ".";
                adjustedPart = beforeLastDot + afterLastDot;  
                iterations++;
            }
        } else {
            // If no Tatweel (ـ), add it at the end
            while (getTextWidth(adjustedPart, "16px 'Amiri'") < requiredWidth && iterations < maxIterations) {
                adjustedPart += ".";  
                iterations++;
            }
        }
    

    } else {
        // Add Tatweel (ـ) after the last occurrence of (ـ) to stretch text
        const lastTatweelIndex = part.lastIndexOf("ـ");

        if (lastTatweelIndex !== -1) {
            // Split the text into two parts: before the last (ـ) and after it
            let beforeLastTatweel = part.substring(0, lastTatweelIndex + 1);  // Text up to and including the last (ـ)
            const afterLastTatweel = part.substring(lastTatweelIndex + 1);     // Text after the last (ـ)

            // Calculate the remaining space needed to reach the required width
            while (getTextWidth(adjustedPart, "16px 'Amiri'") < requiredWidth && iterations < maxIterations) {
                beforeLastTatweel += "ـ";
                adjustedPart = beforeLastTatweel + afterLastTatweel;  // Add 5 Tatweels at once
                iterations++;
            }
        } else {
            // If no Tatweel (ـ), add it at the end
            while (getTextWidth(adjustedPart, "16px 'Amiri'") < requiredWidth && iterations < maxIterations) {
                adjustedPart += "ـ";  // Add 5 Tatweels at once
                iterations++;
            }
        }
    }

    // In case iterations exceeded maxIterations, handle this condition
    if (iterations >= maxIterations) {
        console.warn("Maximum iterations reached. The text may not have fully stretched.");
    }

     //console.log('getTextWidth',getTextWidth(adjustedPart, "16px 'Amiri'"));
    const className = isDotted ? "shahed-part dotted" : "shahed-part";
    return `
        <span class="${className} ${position}">${adjustedPart}</span>`;
}

// Helper function to measure text width
function getTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
}




// ---------------------------------------------



let allShwahedList = [];

async function fetchshwahed(khelafIDs) {
    try {
         //console.log("Sending khelafIDs to server:", khelafIDs);

        const response = await fetch('/getshwahed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ khelafIDs }), // Pass IDs in the body
        });

        if (!response.ok) throw new Error("Failed to fetch Shwahed data");
        const shwahedData = await response.json();
         //console.log("Fetched Shwahed Data:", shwahedData);
        return shwahedData;
    } catch (error) {
        console.error("Error fetching Shwahed Data:", error);
        return null;
    }
}


async function handleAllShwahedList(khelafIDsNames) {
    try {
        // Extract khelafIDs from khelafIDsNames
        const khelafIDs = khelafIDsNames.map(entry => entry.KhelafID);

        // Identify khelafIDs already in allShwahedList
        const existingKhelafIDs = allShwahedList.map(entry => entry.khelafID);
        const newKhelafIDs = khelafIDs.filter(khelafID => !existingKhelafIDs.includes(khelafID));

        // Fetch Shwahed for new KhelafIDs
        let fetchedShwahedData = [];
        if (newKhelafIDs.length > 0) {
            fetchedShwahedData = await fetchshwahed(newKhelafIDs);
        }

        // Update allShwahedList structure
        for (const khelafID of khelafIDs) {
            const shwahed = allShwahedList.find(entry => entry.khelafID === khelafID)?.shwahed || 
                            fetchedShwahedData.filter(data => data.KhelafID === khelafID) ||
                            null;

            // Add new entries to allShwahedList if not already present
            if (!allShwahedList.some(entry => entry.khelafID === khelafID)) {
                allShwahedList.push({ khelafID, shwahed });
            }
        }

        // Map Shwahed data to khelafIDsNames
        khelafIDsNames.forEach(entry => {
            const shwahed = allShwahedList.find(item => item.khelafID === entry.KhelafID)?.shwahed || null;
            entry.shwahed = shwahed;
        });

        return khelafIDsNames;
    } catch (error) {
        console.error("Error in handleAllShwahedList:", error);
        return null;
    }
}



async function updateShwahed() {
    try {

        // Handle empty khelafatArray
        if (!khelafatArray || khelafatArray.length === 0) {
            console.log("khelafatArray is empty.");
            return;
        }

        // Build khelafIDsNames from khelafatArray
        let khelafIDsNames = [];
        khelafatArray.forEach(entry => {
            if (!entry.khelafID) return; // Skip entries with null KhelafID

            let existingEntry = khelafIDsNames.find(item => item.KhelafID === parseInt(entry.khelafID));
            if (existingEntry) {
                // Push only unique words
                if (!existingEntry.KhelafWords.includes(entry.word)) {
                    existingEntry.KhelafWords.push(entry.word);
                } else {}
    
        } else {
                khelafIDsNames.push({
                    "KhelafID": parseInt(entry.khelafID),
                    "KhelafName": entry.KhelafAName,
                    "KhelafWords": [entry.word]
                });
            }
        });

        // Call handleAllShwahedList with constructed khelafIDsNames
        khelafIDsNames = await handleAllShwahedList(khelafIDsNames);

         //console.log('khelafIDsNames', khelafIDsNames);
         //console.log('allShwahedList', allShwahedList);

        return khelafIDsNames;

    } catch (error) {
        console.error("Error in updateShwahed:", error);
    }
}








// ----------------------------------------------------


// Define button IDs and their corresponding NathmIDs
const nathmButtons = [
    { id: 'button-tayyibah', name: 'الطيبة', nathmID: '1', defaultClicked: true },
    { id: 'button-shatibiyyah', name: 'الشاطبية', nathmID: '2', defaultClicked: true },
    { id: 'button-durrah', name: 'الدرة', nathmID: '3', defaultClicked: true }
];

const khelafButtons = [
    { id: 'button-osool', name: 'الأصول', filter: (id) => id < 4000, defaultClicked: true },
    { id: 'button-farsh', name: 'الفرش', filter: (id) => id >= 4000, defaultClicked: true }
];


// Initialize Shwahed
function initializeShwahed() {


    
    let shwahedContainer = document.querySelector('.shwahed-container');

    shwahedContainer.style.display = 'none'; 

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('shwahed-buttons');




    let buttonNathmContainer = document.createElement('div');
    buttonNathmContainer.classList.add('nathm-buttons');

    nathmButtons.forEach(button => {
        let btn = document.createElement('button');
        btn.id = button.id;
        btn.textContent = button.name;
        btn.classList.add('nathm-button');
        if (button.defaultClicked) btn.classList.add('clicked');

        btn.addEventListener('click', () => toggleshwahedButton(btn));
        buttonNathmContainer.appendChild(btn);
    });


    let buttonKhelafContainer = document.createElement('div');
    buttonKhelafContainer.classList.add('khelaf-buttons');
    khelafButtons.forEach(button => {
        let btn = document.createElement('button');
        btn.id = button.id;
        btn.textContent = button.name;
        btn.classList.add('khelaf-button');
        if (button.defaultClicked) btn.classList.add('clicked');

        btn.addEventListener('click', () => toggleshwahedButton(btn));
        buttonKhelafContainer.appendChild(btn);
    });





    buttonContainer.appendChild(buttonNathmContainer);
    buttonContainer.appendChild(buttonKhelafContainer);
    shwahedContainer.insertBefore(buttonContainer, shwahedContainer.firstChild);



    // Add the "X" button
    let shwahedBtn = document.createElement('i');
    shwahedBtn.id = 'shwahedBtn';
    shwahedBtn.classList.add('fa', 'fa-close');
    shwahedBtn.onclick = toggleShwahed;

    shwahedContainer.appendChild(shwahedBtn); // Add it to the container


}



// Toggle button state
function toggleshwahedButton(button) {
    button.classList.toggle('clicked');
    updateShwahedHTML();
}

// Get active NathmIDs based on clicked buttons
function getActiveNathmIDs() {
    return nathmButtons
        .filter(button => document.getElementById(button.id).classList.contains('clicked'))
        .map(button => button.nathmID);
}


// Get active Khelaf filters based on clicked buttons
function getActiveKhelafFilters() {
    return khelafButtons
        .filter(button => document.getElementById(button.id).classList.contains('clicked'))
        .map(button => button.filter);
}




