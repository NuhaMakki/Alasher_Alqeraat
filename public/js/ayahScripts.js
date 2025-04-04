

// function to add and remove the error-border class after a delay
function showError(input, delay = 800) {
    input.classList.add("error-border");
    setTimeout(() => {
        input.classList.remove("error-border");
    }, delay);
}

// Convert Arabic numerals (٠-٩) to English numerals (0-9)
function convertArabicToEnglish(value) {
    return value.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

// Convert English numerals (0-9) to Arabic numerals (٠-٩)
function convertEnglishToArabic(value) {
    return (value.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]).replace(/^٠+/, ''));
}





// -----------------------------------------------------------------------


// Show/hide dropdown menu on arrow click
function toggleDropdown(dropdownMenu, dropdownOptions) {
    const options = Array.from(dropdownMenu.querySelectorAll('li'));

    // Reset filter: make all options visible
    options.forEach(option => {
        option.style.display = ''; // Show all options
    });

    // Toggle the dropdown display
    if (dropdownOptions.style.display === 'block') {
        filterSurahOptions(dropdownMenu, dropdownOptions);
        dropdownOptions.style.display = 'none';
        handleInputSelection(dropdownMenu, dropdownOptions); // Reuse shared logic
    } else {
        const options = Array.from(dropdownOptions.querySelectorAll('li'));
        options.forEach(option => (option.style.display = '')); // Reset all options to visible
        dropdownOptions.style.display = 'block';
    }
}

// Filter options based on user input
function filterSurahOptions(dropdownMenu, dropdownOptions) {
    const filter = dropdownMenu.value.toLowerCase();
    const options = dropdownOptions.querySelectorAll('li');
    let hasVisibleOptions = false; // Track if there are any visible options
    dropdownOptions.setAttribute('currentActiveIndex', -1)

    options.forEach(option => {
        const text = option.getAttribute('sorah-name') || option.innerText;
        if (text.toLowerCase().includes(filter)) {
            option.style.display = ''; // Show matching options
            hasVisibleOptions = true; // At least one option is visible
        } else {
            option.style.display = 'none'; // Hide non-matching options
        }
    });

    if (!hasVisibleOptions) {
        dropdownMenu.classList.add('error-border'); // Add error class if no options
    } else {
        dropdownMenu.classList.remove('error-border'); // Remove error class if matches found
    }

    dropdownOptions.style.display = 'block'; // Show dropdown
}


// Select a dropdown option
async function selectSurah(dropdownMenu, dropdownOptions) {

    const activeOption = dropdownOptions.querySelector('li.active');
    
    if (activeOption) {
        dropdownMenu.value = activeOption.getAttribute('sorah-name');
        dropdownMenu.setAttribute('selected-sorah-ID', activeOption.getAttribute('data-value'));
        document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', activeOption.getAttribute('data-value'));
        // ---------------- populateAyahDropdown(activeOption.getAttribute('data-value')); // Populate Ayah dropdown
    }
    dropdownOptions.style.display = 'none'; // Hide dropdown

    
    await activeAyahSelection(dropdownMenu.getAttribute('index'), dropdownMenu.getAttribute('selected-sorah-ID'));
     //console.log(dropdownMenu.getAttribute('index'), " --------: Selected ID dropdown:", dropdownMenu.getAttribute('selected-sorah-ID'));
     //console.log(dropdownMenu.getAttribute('index'), " --------: sorah name dropdown:", dropdownMenu.value);

}



/*
function selectSurah(dropdownMenu, dropdownOptions) {
    return new Promise((resolve, reject) => {
        try {
            const activeOption = dropdownOptions.querySelector('li.active');
            if (activeOption) {
                dropdownMenu.value = activeOption.getAttribute('sorah-name');
                dropdownMenu.setAttribute('selected-sorah-ID', activeOption.getAttribute('data-value'));
                document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', activeOption.getAttribute('data-value'));
            }
            dropdownOptions.style.display = 'none';
            activeAyahSelection(dropdownMenu.getAttribute('index'), dropdownMenu.getAttribute('selected-sorah-ID'));
            console.log("Surah selection complete.");
            resolve(); // Resolve the Promise when complete
        } catch (error) {
            console.error("Error in selectSurah:", error);
            reject(error); // Reject the Promise if there's an error
        }
    });
}

*/

// Function to handle input selection and validation
function handleInputSelection(dropdownMenu, dropdownOptions) {
    const visibleOptions = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );

    if (dropdownMenu.classList.contains('error-border')) {

        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-sorah-ID', null);
        document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', '');


        dropdownMenu.classList.remove('error-border');
        inactiveAyahSelection(dropdownMenu.getAttribute('index'))
    } else if (visibleOptions.length > 0 && dropdownMenu.value.trim() !== '') {

        // Check if the current value matches a visible option
        const matchingOption = visibleOptions.find(
            option => option.getAttribute('sorah-name') === dropdownMenu.value.trim()
        );

        // If no match, auto-select the first visible option
        if (!matchingOption) {
            visibleOptions[0].classList.add('active');
            selectSurah(dropdownMenu, dropdownOptions);
        }
    } else {
        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-sorah-ID', null);
        document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', '');

        // Reset filter (make all options visible if input is cleared)
        const allOptions = Array.from(dropdownOptions.querySelectorAll('li'));
        allOptions.forEach(option => (option.style.display = ''));
        inactiveAyahSelection(dropdownMenu.getAttribute('index'));
    }
     //console.log(dropdownMenu.getAttribute('index'), " *********: Selected ID dropdown:", dropdownMenu.getAttribute('selected-sorah-ID'));
     //console.log(dropdownMenu.getAttribute('index'), " *********: sorah name dropdown:", dropdownMenu.value);

}



// Handle mouse hover to update active state
function updateActiveIndex(option, dropdownOptions) {
    const options = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );
    options.forEach(opt => opt.classList.remove('active')); // Clear existing active state
    option.classList.add('active');
    dropdownOptions.setAttribute('currentActiveIndex', options.indexOf(option)); // Update active index
}

// Reset the active index when the mouse leaves
function resetActiveIndex(dropdownOptions) {
    const options = Array.from(dropdownOptions.querySelectorAll('li'));
    options.forEach(opt => opt.classList.remove('active')); // Clear existing active state
    dropdownOptions.setAttribute('currentActiveIndex', -1); // Reset active index
}



// Attach event listeners dynamically after rendering
document.querySelectorAll('.dropdown-menu').forEach(dropdownOptions => {
    dropdownOptions.querySelectorAll('li').forEach(option => {
        option.addEventListener('mouseenter', () => updateActiveIndex(option, dropdownOptions)); // Mouse enters
    });
    dropdownOptions.addEventListener('mouseleave', () => resetActiveIndex(dropdownOptions)); // Mouse leaves
});


// Handle keyboard navigation
function handleDropdownKeyboard(event, dropdownMenu, dropdownOptions) {
    const options = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );
    const visibleOptions = options.filter(option => option.style.display !== 'none');

    // Get and initialize currentActiveIndex
    let currentActiveIndex = parseInt(dropdownOptions.getAttribute('currentActiveIndex'), 10);
    if (isNaN(currentActiveIndex)) {
        currentActiveIndex = -1; // No active option initially
    }
    
    if (event.key === 'ArrowDown') {
        // Navigate down
        event.preventDefault();
        if (currentActiveIndex < visibleOptions.length - 1) {
            currentActiveIndex++;
            dropdownOptions.setAttribute('currentActiveIndex', currentActiveIndex);
        }
    } else if (event.key === 'ArrowUp') {
        // Navigate up
        event.preventDefault();
        if (currentActiveIndex > 0) {
            currentActiveIndex--;
            dropdownOptions.setAttribute('currentActiveIndex', currentActiveIndex);
        }
    } else if (event.key === 'Enter') {
        // Select active option
        event.preventDefault();
        if (currentActiveIndex >= 0) {
            selectSurah(dropdownMenu, dropdownOptions);
        }
    }

    // Update active state
    // visibleOptions.forEach((option, index) => {
    //     option.classList.toggle('active', index === currentActiveIndex);
    // });

    options.forEach((option, index) => {
        const isActive = index === currentActiveIndex;
        option.classList.toggle('active',  index === currentActiveIndex);
        if (isActive) {
            // Scroll the active option into view
            option.scrollIntoView({
                block: 'nearest', // Ensures minimal scrolling
                inline: 'nearest',
            });
        }
    });

    
}

// Hide dropdown when clicking outside
document.addEventListener('click', function (event) {
    // Get all dropdown wrappers
    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
        const dropdownMenu = wrapper.querySelector('.dropdown-input'); // The input field
        const dropdownOptions = wrapper.querySelector('.dropdown-menu'); // The dropdown menu



        
        // Check if the clicked element is outside the current wrapper
        if (!wrapper.contains(event.target) && getComputedStyle(dropdownOptions).display !== 'none') {

            // Reuse shared logic for handling input selection
            handleInputSelection(dropdownMenu, dropdownOptions); 
            
            // Reset all options to visible
            const options = Array.from(dropdownOptions.querySelectorAll('li'));
            options.forEach(option => (option.style.display = ''));

            // Hide the dropdown menu
            if (dropdownOptions) {
                dropdownOptions.style.display = 'none';
            }
        }
    });
});





function resetInnerWrapper(dropdownMenu, dropdownOptions) {

    // Clear dropdown input
    dropdownMenu.value = '';
    dropdownMenu.setAttribute('selected-sorah-ID', null);
    document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', '');

    // Clear and disable number inputs
    //inactiveAyahSelection(dropdownMenu.getAttribute('index')) ;


    ayahInput = document.getElementById(`ayahInput-${dropdownMenu.getAttribute('index')}`);
    ayahInput.setAttribute('ayah-list', "" );
    ayahInput.setAttribute('data-value', "" );
    ayahInput.setAttribute('list-index', "" );
    ayahInput.value = ''
    ayahInput.disabled = true;
    ayahInput.classList.add('inactive');

    MaqtaInput = document.getElementById(`maqtaInput-${dropdownMenu.getAttribute('index')}`);
    MaqtaInput.setAttribute('Maqta-list', "" );
    MaqtaInput.setAttribute('data-value', "" );
    MaqtaInput.setAttribute('list-index', "" );
    MaqtaInput.setAttribute('ayaatData', "" );
    MaqtaInput.setAttribute('khelafatData', "" );
    MaqtaInput.value = ''
    MaqtaInput.disabled = true;
    MaqtaInput.classList.add('inactive');



    if (getCurrentAyaatID(-1) === null) {
        let currentSorahCount = sorahCount;
        clearValueInput1(document.getElementById('numberInput1'),1);
        while (sorahCount < currentSorahCount){
            changeSorahCount(1, (document.getElementById('increaseSorahCount')));
        }
    } else {
        // Close dropdown
        //toggleDropdown(dropdownMenu, dropdownOptions); 
        updateAyahText();
        //updateAyahVisibility();
        updateKhelafatArray();
    }


}

// -----------------------------------------------------------------------


// Disable number inputs if no Surah is selected
function inactiveAyahSelection(index) {
        ayahInput = document.getElementById(`ayahInput-${index}`);
        ayahInput.setAttribute('ayah-list', "" );
        ayahInput.setAttribute('data-value', "" );
        ayahInput.setAttribute('list-index', "" );
        ayahInput.value = ''
        ayahInput.disabled = true;
        ayahInput.classList.add('inactive');
        inactiveMaqtaSelection(index);

}

// Active number inputs if Surah is selected
async function activeAyahSelection(index, sorahID) {

    // Fetch Ayah list from server
    const ayahList = await fetchAyahList(sorahID);
    if (ayahList){
        ayahInput = document.getElementById(`ayahInput-${index}`);
        ayahInput.setAttribute('ayah-list', ayahList );
    }   

    await setInitValue(ayahInput, ayahInput.getAttribute('ayah-list').split(','))
    
    await activeMaqtaSelection(index, sorahID, ayahInput.getAttribute('data-value'));

}


// Function to fetch Ayah data
async function fetchAyahList(sorahID) {
    try {
        const response = await fetch(`/getAyahs/${sorahID}`); // Correct endpoint
        if (!response.ok) throw new Error("Network response was not ok");
        const ayahList = await response.json();
        return ayahList.map(item => item.AyahID); // This is the list of AyahIDs
    } catch (error) {
        console.error("Error fetching Ayah list:", error);
        return []; // Return an empty list on error
    }
}



// Disable number inputs if no Ayah is selected
function inactiveMaqtaSelection(index) {
        MaqtaInput = document.getElementById(`maqtaInput-${index}`);
        MaqtaInput.setAttribute('Maqta-list', "" );
        MaqtaInput.setAttribute('data-value', "" );
        MaqtaInput.setAttribute('list-index', "" );
        MaqtaInput.setAttribute('ayaatData', "" );
        MaqtaInput.setAttribute('khelafatData', "" );
        MaqtaInput.value = ''
        MaqtaInput.disabled = true;
        MaqtaInput.classList.add('inactive');
        updateAyahText();

}

// Active number inputs if Maqta is selected
async function activeMaqtaSelection(index, sorahID, ayahID) {

    // Fetch Maqta list from server
    const maqtaList = await fetchMaqtaList(sorahID, ayahID);
    if (maqtaList) {
        maqtaInput = document.getElementById(`maqtaInput-${index}`);
        maqtaInput.setAttribute('maqta-list', maqtaList);
    }
     //console.log('maqtaList:', maqtaList); // Logs the fetched maqta list
     //console.log('maqtaInput attribute:', maqtaInput.getAttribute('maqta-list')); // Logs the updated attribute
    
    await setInitValue(maqtaInput, maqtaInput.getAttribute('maqta-list').split(','));

    await getMaqtaData(maqtaInput);
}

// Function to fetch Maqta data
async function fetchMaqtaList(sorahID, ayahID) {
    try {
        const response = await fetch(`/getMaqta/${sorahID}/${ayahID}`); // Correct endpoint
        if (!response.ok) throw new Error("Network response was not ok");
        const maqtaList = await response.json();
        return maqtaList.map(item => item.Maqta3ID); // This is the list of Maqta3IDs
    } catch (error) {
        console.error("Error fetching Maqta list:", error);
        return []; // Return an empty list on error
    }
}



function incrementAyah(input, list) {
    // Ensure the list is valid
    if (!list || list.length === 0) {
        showError(input);
        return;
    }

    let value = parseInt(input.getAttribute("data-value"), 10);

    // Check if the list contains the value and get its index
    const currentIndex = list.indexOf(value.toString()); // Convert value to string for comparison

    if (currentIndex !== -1 && currentIndex < list.length - 1) {
        // There is a next element in the list
        const nextIndex = currentIndex + 1;
        input.setAttribute("list-index", nextIndex);
        input.value = convertEnglishToArabic(list[nextIndex]);
        input.setAttribute("data-value", convertArabicToEnglish(input.value));


        updateInput(input);

    } else {
        // Show error if the value is not found or there is no next element
        showError(input);
    }
}



// Decrement function 
function decrementAyah(input, list) {
    // Ensure the list is valid
    if (!list || list.length === 0) {
        showError(input);
        return;
    }

    let value = parseInt(input.getAttribute("data-value"), 10);

    // Check if the list contains the value and get its index
    const currentIndex = list.indexOf(value.toString()); // Convert value to string for comparison

    if (currentIndex !== -1 && currentIndex > 0) {
        // There is a previous element in the list
        const prevIndex = currentIndex - 1;
        input.setAttribute("list-index", prevIndex);
        input.value = convertEnglishToArabic(list[prevIndex]);
        input.setAttribute("data-value", convertArabicToEnglish(input.value));


        updateInput(input);


    } else {
        // Show error if the value is not found or there is no previous element
        showError(input);
    }
}





// Validate the input value 
async function validateAyahInput(input, list) {
    // Ensure the list is valid
    if (!list || list.length === 0) {
        showError(input);
        return;
    }

    let value = parseInt(convertArabicToEnglish(input.value));
    let min = parseInt(list[0]);
    let max = parseInt(list[list.length - 1]);

    if (value < min) {
        // If value is below the minimum
        input.setAttribute("data-value", min); // Store the English value
        input.value = convertEnglishToArabic(min);
        input.setAttribute("list-index", 0);
        showError(input);
    } else if (value > max) {
        // If value is above the maximum
        input.setAttribute("data-value", max); // Store the English value
        input.value = convertEnglishToArabic(max);
        input.setAttribute("list-index", list.length - 1);
        showError(input);
    } else if (list.includes(value.toString())) {
        // If the value exists in the list
        const index = list.indexOf(value.toString());
        input.classList.remove("error-border");
        input.setAttribute("data-value", value); // Store the English value
        input.value = convertEnglishToArabic(value); // Convert to Arabic
        input.setAttribute("list-index", index); // Update the index
    } else {
        // If the value does not exist in the list, find the closest larger value
        const closestLarger = list.find(item => parseInt(item) > value);
        if (closestLarger) {
            const index = list.indexOf(closestLarger);
            input.setAttribute("data-value", closestLarger); // Store the English value
            input.value = convertEnglishToArabic(closestLarger); // Convert to Arabic
            input.setAttribute("list-index", index); // Update the index
        }
        showError(input); // Still show an error since the exact value wasn't found
    }

    updateInput(input);
    // Logging for debugging
     //console.log("Value:", value);
     //console.log("Data Value:", input.getAttribute("data-value"));
     //console.log("Displayed Value:", input.value);
}


// Ensure only numeric characters (Arabic and English) are allowed
function handleAyahKeydown(event, list) {
    const input = event.target;
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];

    if (event.key === "ArrowUp") {
        incrementAyah(input, list);
        event.preventDefault();
    } else if (event.key === "ArrowDown") {
        decrementAyah(input, list);
        event.preventDefault();
    } else if (!/[0-9٠-٩]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
}



// Function to set default value if input is empty
function setDefaultValueAyah(input, list) {
        // Ensure the list is valid
        if (!list || list.length === 0) {
            input.disabled = true;
            input.classList.add('inactive');
            return;
        }

        else if (input.value === "") {
            input.setAttribute("data-value", list[0]); // Store the English value
            input.value = convertEnglishToArabic(list[0]); // Display Arabic
            input.setAttribute('list-index', 0);
            updateInput(input);
        }

}


// Function to set default value if input is empty
async function setInitValue(input, list) {
    // Ensure the list is valid
    if (!list || list.length === 0) {
        input.disabled = true;
        input.classList.add('inactive');
        return;
    }

    input.setAttribute("data-value", list[0]); // Store the English value
    input.value = convertEnglishToArabic(list[0]); // Display Arabic
    input.setAttribute('list-index', 0);
    input.disabled = false;
    input.classList.remove('inactive');

}


async function updateInput(input){
    // Determine action based on input type
    if (input.id.startsWith("ayahInput")) {
        // For Ayah Input
        const ayahID = input.getAttribute('data-value');
        const sorahID = input.getAttribute('selected-sorah');
        const index = input.getAttribute('index');
        await activeMaqtaSelection(index, sorahID, ayahID);
    } else if (input.id.startsWith("maqtaInput")) {

        await getMaqtaData(input);

         //console.log(input.getAttribute('ayaatData'));
         //console.log(input.getAttribute('khelafatData'));
    }
}


async function getMaqtaData(input) {
    const index = input.getAttribute('index');
    const sorahID = document.getElementById(`ayahInput-${index}`).getAttribute('selected-sorah');
    const ayahID = document.getElementById(`ayahInput-${index}`).getAttribute('data-value');
    const maqta3ID = input.getAttribute('data-value');

     //console.log(index, sorahID, ayahID, maqta3ID);

    try {
        const ayaatData = await fetchAyatData(sorahID, ayahID, maqta3ID);
        if (ayaatData.length > 0) {
            const ayaatID = ayaatData[0].AyaatID; // Use the first Ayat ID
            input.setAttribute('ayaatData', JSON.stringify(ayaatData)); // Save data as JSON string
            const khelafatData = await fetchKhelafatData(ayaatID);
            updateAyahText();
            if (khelafatData) {
                input.setAttribute('khelafatData', JSON.stringify(khelafatData)); // Save data as JSON string
                 //console.log("Processed Khelafat Data:", khelafatData);
                await updateKhelafatArray();
            }  else {
                input.removeAttribute('khelafatData'); // Clear old data
                await resetTable();
            }
        } else {
            console.warn("No Ayat data found");
            input.removeAttribute('ayaatData'); // Clear old data
            input.removeAttribute('khelafatData'); // Clear old data
            await resetTable(); // Reset the table
        }
    } catch (error) {
        console.error("Error processing input:", error);
        await resetTable(); // Handle errors by resetting the table

    }
}

// Function to fetch Ayat data
async function fetchAyatData(sorahID, ayahID, maqta3ID) {
    try {
        const response = await fetch(`/getAyaat/${sorahID}/${ayahID}/${maqta3ID}`);
        if (!response.ok) throw new Error("Failed to fetch Ayat data");
        const ayatData = await response.json();
         //console.log("Fetched Ayat Data:", ayatData);
        return ayatData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching Ayat data:", error);
        return []; // Return an empty array on error
    }
}

// Function to fetch Khelafat data
async function fetchKhelafatData(ayaatID) {
    try {
        const response = await fetch(`/getKhelafat/${ayaatID}`);
        if (!response.ok) throw new Error("Failed to fetch Khelafat data");
        const khelafatData = await response.json();
         //console.log("Fetched Khelafat Data:", khelafatData);
        return khelafatData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching Khelafat data:", error);
        return []; // Return an empty array on error
    }
}




// -----------------------------------------------------------------------


let cachedSorahs = null;

async function fetchSorahs(index) {
    if (cachedSorahs) {
        populateDropdown(cachedSorahs, index);
        return;
    }

    try {
        const response = await fetch('/getSorahs/');
        if (!response.ok) {
            throw new Error('Failed to fetch Sorahs');
        }
        cachedSorahs = await response.json(); // Cache the data
        populateDropdown(cachedSorahs, index);
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateDropdown(sorahs, index) {
    const dropdownMenu = document.getElementById(`surahOptions-${index}`);
    dropdownMenu.innerHTML = ''; // Clear existing options

    if (sorahs.length > 0) {
        sorahs.forEach(sorah => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-value', sorah.SorahID);
            listItem.setAttribute('sorah-name', sorah.SorahName);
            listItem.textContent = sorah.SorahName;

            // Add event handlers
            listItem.onclick = () => selectSurah(
                document.getElementById(`surahDropdown-${index}`),
                dropdownMenu
            );
            listItem.onmouseover = () => updateActiveIndex(
                listItem,
                dropdownMenu
            );

            dropdownMenu.appendChild(listItem);
        });
    } else {
        dropdownMenu.innerHTML = '<li>No sorahs available</li>';
    }
}





let sorahCount = 1; // Initial count
const minSorahCount = 1;
const maxSorahCount = 5;

// Function to change sorah count
function changeSorahCount(delta, button) {
    const newCount = sorahCount + delta;

    // Ensure count is within the allowed range
    if (newCount >= minSorahCount && newCount <= maxSorahCount) {
        if (delta > 0) {
            // Add a new container
            addSorahContainer(newCount);
        } else {
            // Remove the last container
            removeSorahContainer(sorahCount);
        }
        sorahCount = newCount;
    } else {
        // Show error note below the controls
        const controlsElement = document.querySelector(".sorah-controls");
        if (newCount > maxSorahCount) {
            showNote("الحد الأقصى خمسة مقاطع", controlsElement);
        } else if (newCount < minSorahCount) {
            showNote("الحد الأدنى مقطع واحد", controlsElement);
        }

        // Highlight only the clicked button
        showError(button);
    }
}

// Function to add a new sorah container
function addSorahContainer(index) {
    const container = document.getElementById("sorahContainer");

    // Create a new container dynamically
    const newContainer = document.createElement("div");
    newContainer.classList.add("inner-container");
    newContainer.id = `inner-container-${index}`;
    newContainer.innerHTML = `
        <div class="empty-wrapper"></div>
        <div class="inner-wrapper">                        
            <div class="dropdown-wrapper" tabindex="0" 
                onkeydown="handleDropdownKeyboard(event, document.getElementById('surahDropdown-${index}'), document.getElementById('surahOptions-${index}'))">
                <div class="dropdown-wrapper-a">
                    <input 
                        type="text" 
                        id="surahDropdown-${index}" 
                        class="dropdown-input" 
                        placeholder="السورة" 
                        oninput="filterSurahOptions(document.getElementById('surahDropdown-${index}'), document.getElementById('surahOptions-${index}'))" 
                        autocomplete="off"
                        selected-sorah-ID=""
                        index="${index}">
                    <i class="fas fa-chevron-down dropdown-arrow-icon" 
                        onclick="toggleDropdown(document.getElementById('surahDropdown-${index}'), document.getElementById('surahOptions-${index}'))"></i>
                    <ul class="dropdown-menu" id="surahOptions-${index}" currentActiveIndex="-1">
                        <!-- Options will be dynamically populated -->
                    </ul>
                </div>
            </div>
            <!-- Second number input -->
            <div class="number-wrapper number-wrapper-b">
                <input type="text" id="ayahInput-${index}" class="number-input inactive" index="${index}" placeholder="الآية" disabled
                    ayah-list="" data-value = "" list-index = "" selected-sorah = ""
                    oninput="validateAyahInput(this, this.getAttribute('ayah-list').split(','))"
                    onkeydown="handleAyahKeydown(event, this.getAttribute('ayah-list').split(','))"
                    onblur="setDefaultValueAyah(this, this.getAttribute('ayah-list').split(','))">
                <div class="arrow-container">
                    <i class="fas fa-chevron-up arrow-icon" onclick="incrementAyah(document.getElementById('ayahInput-${index}'), document.getElementById('ayahInput-${index}').getAttribute('ayah-list').split(','))"></i>
                    <i class="fas fa-chevron-down arrow-icon" onclick="decrementAyah(document.getElementById('ayahInput-${index}'), document.getElementById('ayahInput-${index}').getAttribute('ayah-list').split(','))"></i>
                </div>
            </div>

            <!-- Third number input -->
            <div class="number-wrapper number-wrapper-b">
                <input type="text" id="maqtaInput-${index}" class="number-input inactive" index="${index}" placeholder="المقطع" disabled
                    maqta-list="" data-value = "" list-index = "" ayaatData = "" khelafatData = ""
                    oninput="validateAyahInput(this, this.getAttribute('maqta-list').split(','))"
                    onkeydown="handleAyahKeydown(event, this.getAttribute('maqta-list').split(','))"
                    onblur="setDefaultValueAyah(this, this.getAttribute('maqta-list').split(','))">
                <div class="arrow-container">
                    <i class="fas fa-chevron-up arrow-icon" onclick="incrementAyah(document.getElementById('maqtaInput-${index}'), document.getElementById('maqtaInput-${index}').getAttribute('maqta-list').split(','))"></i>
                    <i class="fas fa-chevron-down arrow-icon" onclick="decrementAyah(document.getElementById('maqtaInput-${index}'), document.getElementById('maqtaInput-${index}').getAttribute('maqta-list').split(','))"></i>
                </div>
            </div>
        </div>
        
        <div class="empty-wrapper"> 
            <div class="reset-button" title="إعادة الضبط" onclick="resetInnerWrapper(document.getElementById('surahDropdown-${index}'), document.getElementById('surahOptions-${index}'))">
                <i class="fas fa-undo"></i>
            </div>
        </div>
    `;
    container.appendChild(newContainer);
    fetchSorahs(index);

}

function removeSorahContainer(index) {
    const container = document.getElementById(`inner-container-${index}`);
    if (container) {
        container.remove();
        updateAyahText();
    }
}

function resetSorahContainer(){
    for (let i = sorahCount; i > 1; i--) {
        changeSorahCount(-1);
    }
    resetInnerWrapper(document.getElementById('surahDropdown-1'), document.getElementById('surahOptions-1'));
    
}

// Initialize the first container on page load
window.onload = async function () {
    initializeShwahed(); 
    addSorahContainer(1);
    fetchSorahs(1);
    await fillTable(null);
    addEmptyColumn(-1);
    addBabContainer(1);
    setupBabContainerToggle();
    await organizeData();
    await addBookList();

    //await showTareeqDet();
};

// -----------------------------------------------------------------------




function updateAyahText() {
    const ayahTextElement = document.querySelector('.ayah-text');
    const maqtaInputs = document.querySelectorAll('[id^="maqtaInput-"]');

    // Initialize the ayah text
    let ayahText = "﴿";

    let hasContent = false; // Flag to check if any maqtaInput has data

    maqtaInputs.forEach((input, index) => {
        const ayaatDataRaw = input.getAttribute('ayaatData'); // Get the `ayaatData` attribute (stringified JSON)
        const ayaatData = ayaatDataRaw ? JSON.parse(ayaatDataRaw) : []; // Parse it into an object
        const ayah = ayaatData.length > 0 && ayaatData[0].Ayah ? ayaatData[0].Ayah.trim() : ''; // Extract `Ayah`
        const value = input.value.trim(); // Get the value of the input
    
        if (value && ayah) {
            if (hasContent) {
                ayahText += "\n"; // Add a newline between entries
            }
            ayahText += ayah; // Append the `Ayah` text
            hasContent = true; // Mark that we have content
        }
    });
    

    // If no maqtaInput has data, clear the text
    if (!hasContent) {
        ayahText = "";
    } else {
        ayahText += "﴾"; // Close the ayah if we have content
    }


    ayahTextElement.innerText = ayahText;

}





// -----------------------------------------------------------------------






/*

function showHideSorah() {
    const ayahText = document.querySelector('.ayah-text');
    const ayahContainer = document.querySelector('#ayahContainer'); // Ensure you are targeting the correct container
    const showHideButton = document.getElementById('showHideSorah');

    // Toggle visibility of Ayah text
    if (ayahText.innerText.trim() !== "") {
        ayahText.classList.toggle('hidden');
        
        // Toggle the icon (change between eye and eye-slash)
        if (ayahText.classList.contains('hidden')) {
            showHideButton.querySelector('i').classList.remove('fa-eye');
            showHideButton.querySelector('i').classList.add('fa-eye-slash');
        } else {
            showHideButton.querySelector('i').classList.remove('fa-eye-slash');
            showHideButton.querySelector('i').classList.add('fa-eye');
        }

        // Toggle the entire ayahContainer visibility to remove the space when hidden
        ayahContainer.classList.toggle('container-hidden');
    }
}


*/



function showHideSorah() {
    const ayahText = document.querySelector('.ayah-text');
    if (ayahText.innerText.trim() !== "") {
        updateAyahVisibility(); // Toggle visibility
    }
}


function updateAyahVisibility(shouldShow = null) {
    const ayahText = document.querySelector('.ayah-text');
    const ayahContainer = document.querySelector('#ayahContainer');
    const showHideButton = document.getElementById('showHideSorah');
    const icon = showHideButton.querySelector('i');

    // Determine the current visibility state
    const isHidden = ayahText.classList.contains('hidden');

    // Decide visibility based on the parameter or current state
    const show = shouldShow !== null ? shouldShow : isHidden;

    if (show) {
        ayahText.classList.remove('hidden');
        ayahContainer.classList.remove('container-hidden');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        ayahText.classList.add('hidden');
        ayahContainer.classList.add('container-hidden');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}




// -----------------------------------------------------------------------




// Function to handle the previous Ayaat button click
async function handlePreviousAyaat(button) {
    const currentAyaatID = getCurrentAyaatID(-1); // Function to get the current AyaatID (implement this based on your app's state)
    const controlsElement = document.querySelector(".sorah-controls");
    if (currentAyaatID === null) {
        showNote("لا يوجد مقطع تم تحديده", controlsElement);
        showError(button);
        return;
    }


    // Fetch the previous Ayah data
    const previousAyatData = await fetchPreviousAyatData(currentAyaatID);

    if (previousAyatData && previousAyatData.length > 0) {
        resetSorahContainer();
        selectPrevNext(previousAyatData);

    } else {
        showNote("لا يوجد مقطع سابق", controlsElement);
        showError(button);
    }
}




async function handleNextAyaat(button) {
    const currentAyaatID = getCurrentAyaatID(1); // Function to get the current AyaatID (implement this based on your app's state)
    const controlsElement = document.querySelector(".sorah-controls");
    if (currentAyaatID === null) {
        showNote("لا يوجد مقطع تم تحديده", controlsElement);
        showError(button);
        return;
    }
    // Fetch the next Ayah data
    const nextAyatData = await fetchNextAyatData(currentAyaatID);

    if (nextAyatData && nextAyatData.length > 0) {
        resetSorahContainer();
        selectPrevNext(nextAyatData);

    } else {
        showNote("لا يوجد مقطع تالي", controlsElement);
        showError(button);
    }
}



// Function to fetch the previous Ayat
async function fetchPreviousAyatData(AyaatID) {
    try {
        const response = await fetch(`/getPreviousAyaat/${AyaatID}`);
        if (!response.ok) throw new Error("Failed to fetch previous Ayat data");
        const previousAyatData = await response.json();
         //console.log("Fetched Previous Ayat Data:", previousAyatData);
        return previousAyatData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching previous Ayat data:", error);
        return null; // Return null on error
    }
}



// Function to fetch the next Ayat
async function fetchNextAyatData(AyaatID) {
    try {
        const response = await fetch(`/getNextAyaat/${AyaatID}`);
        if (!response.ok) throw new Error("Failed to fetch next Ayat data");
        const nextAyatData = await response.json();
        console.log("Fetched Next Ayat Data:", nextAyatData);
        return nextAyatData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching next Ayat data:", error);
        return null; // Return null on error
    }
}







// Dummy function to represent the current AyaatID, you should replace this with the actual method of tracking the current AyaatID
function getCurrentAyaatID(prevNext) {
    let start, end, step;

    // Determine the loop direction and range
    if (prevNext < 0) {
        start = minSorahCount;
        end = sorahCount + 1;
        step = 1;  // Loop forwards (min to sorahCount)
    } else {
        start = sorahCount;
        end = minSorahCount - 1;
        step = -1; // Loop backwards (sorahCount to min)
    }


    // Loop through the maqta inputs depending on the direction
    for (let index = start; index !== end; index += step) {
        let maqtaInput = document.querySelector(`#maqtaInput-${index}`);

        // Check if data-value is not empty or null
        if (maqtaInput && maqtaInput.getAttribute('data-value') !== null && maqtaInput.getAttribute('data-value') !== "") {
            let ayaatData = maqtaInput.getAttribute('ayaatData');


            // Check if ayaatData is not null or empty
            if (ayaatData) {
                try {
                    let parsedAyaatData = JSON.parse(ayaatData); // Parse the JSON string
                    if (parsedAyaatData && parsedAyaatData.length > 0) {
                        return parsedAyaatData[0].AyaatID; // Return the AyaatID from the first item in the array
                    }
                } catch (error) {
                    console.error("Error parsing ayaatData:", error);
                }
            }

        }
    }
    // If all `maqtaInput-${index}` elements have an empty `data-value`, return null
    return null;
}





async function selectPrevNext(AyatData) {

    let SorahID, SorahName, AyahID, MaqtaID;
    // Store the values from the first row in individual variables
    SorahID = AyatData[0].SorahID;
    SorahName = AyatData[0].SorahName;
    AyahID = AyatData[0].AyahID;
    MaqtaID = AyatData[0].Maqta3ID;

    // ----------------------------------------------------------------------------
    const dropdownMenu = document.getElementById('surahDropdown-1');
    const dropdownOptions = document.getElementById('surahOptions-1');
    const Options = Array.from(dropdownOptions.querySelectorAll('li'));

    // Check if the current value matches a visible option
    const matchingOption = Options.find(
        option => option.getAttribute('sorah-name') === SorahName
    );

    // If match, select option
    if (matchingOption) {
        Options.forEach(option => option.classList.remove('active'));
        matchingOption.classList.add('active');
        await selectSurah(dropdownMenu, dropdownOptions);
    } else {
        showNote("حدث خطأ في اختيار السورة", controlsElement);
        showError(button);
        return;
    }
    // ----------------------------------------------------------------------------

     const ayahInput = document.getElementById('ayahInput-1');

     const maqtaInput = document.getElementById('maqtaInput-1');


    // If the value exists in the list
    const ayahIndex = ayahInput.getAttribute('ayah-list').split(',').indexOf(AyahID.toString());
    ayahInput.classList.remove("error-border");
    ayahInput.setAttribute("data-value", AyahID); // Store the English value
    ayahInput.value = convertEnglishToArabic(AyahID); // Convert to Arabic
    ayahInput.setAttribute("list-index", ayahIndex); // Update the index


    // If the value exists in the list
    const maqtaIndex = maqtaInput.getAttribute('maqta-list').split(',').indexOf(MaqtaID.toString());
    maqtaInput.classList.remove("error-border");
    maqtaInput.setAttribute("data-value", MaqtaID); // Store the English value
    maqtaInput.value = convertEnglishToArabic(MaqtaID); // Convert to Arabic
    maqtaInput.setAttribute("list-index", maqtaIndex); // Update the index
    await updateInput(maqtaInput);
    
}



// -----------------------------------------------------------------------

// Function to display error notes below the controls
function showNote(message, controlsElement) {
    // Remove any existing notes
    const existingNote = controlsElement.querySelector(".note");
    if (existingNote) existingNote.remove();

    // Create a new note element
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = message;
    controlsElement.appendChild(note);

    // Remove the note after 2 seconds
    setTimeout(() => {
        note.remove();
    }, 1500);
}
