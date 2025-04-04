

let rwahList;
let rwahNastedList;
async function fetchRwah() {
    try {
        const response = await fetch('/getRwah/');
        if (!response.ok) {
            throw new Error('Failed to fetch Rwah');
        }
        rwahList = await response.json(); // Cache the data
        return;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function organizeData() {
    await fetchRwah();

    if (rwahList === undefined){
        console.error('Error:', error);
        return;
    }


    rwahNastedList = {};

    rwahList.forEach(row => {
        const { QarieID, QarieName, RawyID, RawyName, Tareeq1ID, Tareeq1Name, Tareeq2ID, Tareeq2Name, BookID, BookName } = row;

        // Add Qarie
        if (!rwahNastedList[QarieID]) {
            rwahNastedList[QarieID] = {
                QarieID,
                QarieName,
                Rawies: {}
            };
        }

        // Add Rawy
        if (RawyID && !rwahNastedList[QarieID].Rawies[RawyID]) {
            rwahNastedList[QarieID].Rawies[RawyID] = {
                RawyID,
                RawyName,
                Tareeq1s: {}
            };
        }

        // Add Tareeq1
        if (Tareeq1ID && !rwahNastedList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID]) {
            rwahNastedList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID] = {
                Tareeq1ID,
                Tareeq1Name,
                Tareeq2s: {}
            };
        }

        // Add Tareeq2
        if (Tareeq2ID && !rwahNastedList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID]) {
            rwahNastedList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID] = {
                Tareeq2ID,
                Tareeq2Name,
                Books: []
            };
        }

        // Add Book
        if (BookID) {
            rwahNastedList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID].Books.push({
                BookID,
                BookName
            });
        }
    });

    processRwahNastedList();
    //console.log(rwahList);
    createNestedChecklist(rwahNastedList);
    addSelectButtons();

    return;
}


function processRwahNastedList() {

    //console.log(rwahNastedList);
    // Check if rwahNastedList is defined and contains at least one QarieID
    if (!rwahNastedList || Object.keys(rwahNastedList).length === 0) {
        console.error('rwahNastedList is empty or undefined');
        return;
    }

    // Assuming rwahNastedList is already populated
    const qarieID = Object.keys(rwahNastedList)[0]; // Get the first QarieID
    const qarieData = rwahNastedList[qarieID];

    // Check if qarieData exists and has Rawies property
    if (!qarieData || !qarieData.Rawies) {
        console.error('Qarie data or Rawies is missing');
        return;
    }

    // Create a new object to group Rawies with the same RawyName
    const newRawyGroup = {};

    // Iterate over all Rawies
    Object.values(qarieData.Rawies).forEach(rawy => {
        // If RawyID is 13 or 14, group them under the same "ورش" RawyName
        if (rawy.RawyID === 13 || rawy.RawyID === 14) {
            // Check if "ورش" is already added in the newRawyGroup
            if (!newRawyGroup["ورش"]) {
                newRawyGroup["ورش"] = {
                    RawyID: [13, 14],  // Collect the RawyIDs for 13 and 14
                    RawyName: "ورش",
                    Tareeq1s: {}
                };
            }

            // Now add their Tareeq1 to the same group
            Object.values(rawy.Tareeq1s).forEach(tareeq1 => {
                const existingTareeq1 = newRawyGroup["ورش"].Tareeq1s[tareeq1.Tareeq1Name];
                if (!existingTareeq1) {
                    newRawyGroup["ورش"].Tareeq1s[tareeq1.Tareeq1Name] = {
                        Tareeq1ID: tareeq1.Tareeq1ID,
                        Tareeq1Name: tareeq1.Tareeq1Name,
                        Tareeq2s: tareeq1.Tareeq2s
                    };
                } else {
                    // Merge Tareeq2s if the Tareeq1Name already exists
                    Object.assign(existingTareeq1.Tareeq2s, tareeq1.Tareeq2s);
                }
            });
        } else {
            // If RawyID is not 13 or 14, retain it as is
            newRawyGroup[rawy.RawyName] = {
                RawyID: rawy.RawyID,
                RawyName: rawy.RawyName,
                Tareeq1s: rawy.Tareeq1s
            };
        }
    });

    // Replace the original Rawies with the grouped Rawies
    qarieData.Rawies = {};

    // Assign the grouped Rawies back to the QarieData
    Object.keys(newRawyGroup).forEach(groupName => {
        qarieData.Rawies[groupName] = newRawyGroup[groupName];
    });

     //console.log(rwahNastedList); // For debugging
    return rwahNastedList;
}



function createNestedChecklist(data) {
    const container = document.getElementById('nestedChecklist');
    container.innerHTML = ''; // Clear previous content

    Object.values(data).forEach(qarie => {
        const qarieElement = createExpandableCheckbox(qarie.QarieName, `qarie-${qarie.QarieID}`);
        const rawyContainer = createContainer();

        Object.values(qarie.Rawies).forEach(rawy => {
            const rawyElement = createExpandableCheckbox(rawy.RawyName, `rawy-${rawy.RawyID}`);
            const tareeq1Container = createContainer();

            Object.values(rawy.Tareeq1s).forEach(tareeq1 => {
                const tareeq1Element = createExpandableCheckbox(tareeq1.Tareeq1Name, `tareeq1-${tareeq1.Tareeq1ID}`);
                const tareeq2Container = createContainer();

                const tareeq2s = Object.values(tareeq1.Tareeq2s);

                if (tareeq2s.length === 1 && tareeq2s[0].Tareeq2Name === tareeq1.Tareeq1Name) {
                    // If Tareeq2Name is the same as Tareeq1Name and there's only one Tareeq2, no 4th level nesting
                        tareeq1Container.appendChild(createCheckbox(tareeq1.Tareeq1Name, `tareeq1-${tareeq1.Tareeq1ID}`));
                } else {
                    // Normal nesting for Tareeq2
                    tareeq2s.forEach(tareeq2 => {
                        const tareeq2Element = createCheckbox(tareeq2.Tareeq2Name, `tareeq2-${tareeq2.Tareeq2ID}`);
                        tareeq2Container.appendChild(tareeq2Element);
                    });

                    tareeq1Element.appendChild(tareeq2Container);
                    tareeq1Container.appendChild(tareeq1Element);
                }
            });

            rawyElement.appendChild(tareeq1Container);
            rawyContainer.appendChild(rawyElement);
        });

        qarieElement.appendChild(rawyContainer);
        container.appendChild(qarieElement);
    });
}


function createExpandableCheckbox(label, id) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('expandable-item');
    wrapper.id = id;
    const checkbox = createCheckboxElement(id);
    const labelElement = createLabelElement(label, id);
    const toggleButton = createToggleButton();

    // Set the initial state of the icon
    updateToggleIcon(toggleButton, false);

    toggleButton.addEventListener('click', () => toggleVisibility(wrapper, toggleButton));
    checkbox.addEventListener('change', () => {
        toggleChildCheckboxes(wrapper, checkbox.checked); // Sync children
        toggleParentCheckbox(checkbox); // Sync parents
    });
    wrapper.append( toggleButton, checkbox, labelElement);
    return wrapper;
}

function createCheckbox(label, id) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('checkbox-item');
    wrapper.id = id;

    const checkbox = createCheckboxElement(id);
    const labelElement = createLabelElement(label, id);

    // Check if the label contains parentheses
    const regex = /\(([^)]+)\)/; // Regular expression to find text inside parentheses
    const match = label.match(regex);

    if (match) {
        // Add the class to the parentheses part directly
        const mainText = label.split('(')[0].trim();
        const parenthesisText = match[1].trim();

        // Set the label text as the main part
        labelElement.textContent = mainText;

        // Create a new span for the parentheses content and apply split-text class
        const splitTextElement = document.createElement('span');
        splitTextElement.classList.add('split-text');
        splitTextElement.textContent = `(${parenthesisText})`;

        // Append the main text and the parentheses part
        labelElement.appendChild(splitTextElement);


        checkbox.classList.add('split-checkbox');

    }

    // Event listener for synchronization
    checkbox.addEventListener('change', () => {
        toggleParentCheckbox(checkbox); // Sync parent on change
    });

    wrapper.append(checkbox, labelElement);
    return wrapper;
}


function createContainer() {
    const container = document.createElement('div');
    container.style.display = 'none'; // Initially hidden
    container.classList.add('nested-container');
    return container;
}

function createCheckboxElement(id) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.classList.add('nested-checkbox');
    checkbox.checked = true; // Set the checkbox as checked by default


    // Add event listener if id does not start with "book-"
    if (!id.startsWith('book-')) {
        checkbox.addEventListener('change', () => {
            setTimeout(() => {
                updateBookCheckboxStates();
            }, 0);
        });
        
    }

    checkbox.addEventListener('change', () => {
        handleTableData();
    });

    return checkbox;
}

function createLabelElement(label, id) {
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    return labelElement;
}



function createToggleButton() {
    const button = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'expand-icon'); 
    button.appendChild(icon);
    button.classList.add('toggle-button');
    return button;
}


function updateToggleIcon(toggleButton, isExpanded) {
    const icon = toggleButton.querySelector('i');
    icon.classList.remove('fa-angle-double-down', 'fa-angle-double-up');
    icon.classList.add(isExpanded ? 'fa-angle-double-up' : 'fa-angle-double-down');
}

function toggleVisibility(wrapper, toggleButton) {
    const nestedDiv = wrapper.querySelector('.nested-container');
    const isVisible = nestedDiv.style.display === 'block';
    nestedDiv.style.display = isVisible ? 'none' : 'block';
    updateToggleIcon(toggleButton, !isVisible);
}

function toggleChildCheckboxes(wrapper, isChecked) {
    const childCheckboxes = wrapper.querySelectorAll('.nested-checkbox');
    childCheckboxes.forEach(childCheckbox => (childCheckbox.checked = isChecked));
}


function toggleParentCheckbox(childCheckbox) {
    // Log the ID of the child checkbox being updated
     //console.log(`Updating parent checkbox for: ${childCheckbox.id}`);

    let currentCheckbox = childCheckbox;

    while (currentCheckbox) {
        const currentId = currentCheckbox.id;

        // Check for Tareeq2 parent (Tareeq1)
        if (currentId.startsWith('tareeq2-')) {
            const tareeq1Checkbox = findParentCheckbox(currentCheckbox, 'tareeq1-');
            if (tareeq1Checkbox) {
                updateParentCheckboxState(tareeq1Checkbox);
                 //console.log(`Updated Tareeq1 for Tareeq2: ${tareeq1Checkbox.id}`);
            }
        }

        // Check for Tareeq1 parent (Rawy)
        if (currentId.startsWith('tareeq1-') || currentId.startsWith('tareeq2-')) {
            const rawyCheckbox = findParentCheckbox(currentCheckbox, 'rawy-');
            if (rawyCheckbox) {
                updateParentCheckboxState(rawyCheckbox);
                 //console.log(`Updated Rawy for Tareeq1 or Tareeq2: ${rawyCheckbox.id}`);
            }
        }

        // Check for Rawy parent (Qarie)
        if (currentId.startsWith('rawy-') || currentId.startsWith('tareeq1-') || currentId.startsWith('tareeq2-')) {
            const qarieCheckbox = findParentCheckbox(currentCheckbox, 'qarie-');
            if (qarieCheckbox) {
                updateParentCheckboxState(qarieCheckbox);
                 //console.log(`Updated Qarie for Rawy, Tareeq1, or Tareeq2: ${qarieCheckbox.id}`);
            }
        }

        // Stop traversal after the highest level (Qarie) is reached
        currentCheckbox = null;
    }
}

// Helper function to locate a parent checkbox by prefix
function findParentCheckbox(element, prefix) {
    const parentWrapper = element.closest(`[id^="${prefix}"]`);
    if (parentWrapper) {
        const parentCheckbox = parentWrapper.querySelector('input[type="checkbox"]');
        if (parentCheckbox) return parentCheckbox;
    }
    return null;
}

function updateParentCheckboxState(parentCheckbox) {
    const parentWrapper = parentCheckbox.closest('.expandable-item');
    if (parentWrapper) {
        // Get all nested checkboxes, excluding the parent checkbox itself
        const childCheckboxes = parentWrapper.querySelectorAll('.nested-container .nested-checkbox');
        const childCheckboxesWithoutParent = Array.from(childCheckboxes).filter(cb => cb !== parentCheckbox);

        // Determine if all child checkboxes are checked
        const allChecked = childCheckboxesWithoutParent.every(cb => cb.checked);
        parentCheckbox.checked = allChecked;

        // Log the updated state of the parent checkbox
         //console.log(`Parent checkbox (${parentCheckbox.id}) set to: ${allChecked}`);
    }
}





function updateToggleButtonPosition() {
    const isSmallScreen = window.innerWidth <= 768;

    if (!isChecklistVisible && !isBookChecklistVisible) {
        // Both lists are closed
        toggleContainer.style.left = '-30px';
        toggleBookContainer.style.left = '-30px';
    } else if (isChecklistVisible && isBookChecklistVisible) {
        if (isSmallScreen) {
            // Small screen: Close one checklist
            if (lastClicked === 'book') {
                nestedChecklist.classList.add('hidden');
                isChecklistVisible = false;
            } else {
                bookChecklist.classList.add('hidden');
                isBookChecklistVisible = false;
            }
        } else {
            // Large screen: Position both checklists side by side
            nestedChecklist.style.left = '10px';
            bookChecklist.style.left = '350px';
            toggleContainer.style.left = '310px';
            toggleBookContainer.style.left = '650px';
            nestedChecklist.style.height = '80vh';
        }
    } else {
        // Only one list is open
        const openChecklist = isChecklistVisible ? nestedChecklist : bookChecklist;
        const openButton = isChecklistVisible ? toggleContainer : toggleBookContainer;
        openChecklist.style.left = '10px';
        toggleContainer.style.left = '310px';
        toggleBookContainer.style.left = '310px';
        nestedChecklist.style.height = '';
    }

    // Set button colors
    toggleContainer.style.backgroundColor = isChecklistVisible ? '#7A9EAE' : '#A3A3A3';
    toggleBookContainer.style.backgroundColor = isBookChecklistVisible ? '#7A9EAE' : '#A3A3A3';

    // Ensure checklists have correct visibility
    nestedChecklist.classList.toggle('hidden', !isChecklistVisible);
    bookChecklist.classList.toggle('hidden', !isBookChecklistVisible);
}



// Track last clicked button
let lastClicked = null;

// Toggle logic
const toggleButton = document.getElementById('toggleButton');
const nestedChecklist = document.getElementById('nestedChecklist');
let isChecklistVisible = false;
const toggleContainer = document.getElementById('toggleContainer');


const toggleBookButton = document.getElementById('toggleBookButton');
const bookChecklist = document.getElementById('bookChecklist');
let isBookChecklistVisible = false;
const toggleBookContainer = document.getElementById('toggleBookContainer');




toggleButton.addEventListener('click', () => {
    isChecklistVisible = !isChecklistVisible;
    lastClicked = 'nested';
    updateToggleButtonPosition();
});

toggleBookButton.addEventListener('click', () => {
    isBookChecklistVisible = !isBookChecklistVisible;
    lastClicked = 'book';
    updateToggleButtonPosition();
});




// Update positions on window resize
window.addEventListener('resize', updateToggleButtonPosition);




// Add new selectAllButton and clearSelectionButton buttons for nestedChecklist
function addSelectButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container-new'); // New class for container

    // selectAllButton
    const selectAllButton = document.createElement('button');
    selectAllButton.innerHTML = '<i class="fa fa-check-square"></i>'; // Replace with an appropriate icon
    selectAllButton.classList.add('select-all-new'); // New class for the "select all" button
    selectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#nestedChecklist .nested-checkbox');
        checkboxes.forEach(checkbox => (checkbox.checked = true));
        updateBookCheckboxStates();
        handleTableData();
    });

    // clearSelectionButton
    const clearSelectionButton = document.createElement('button');
    clearSelectionButton.innerHTML = '<i class="fa fa-times-square"></i>'; // Replace with an appropriate icon
    clearSelectionButton.classList.add('clear-selection-new'); // New class for the "clear selection" button
    clearSelectionButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#nestedChecklist .nested-checkbox');
        checkboxes.forEach(checkbox => (checkbox.checked = false));
        updateBookCheckboxStates();
        handleTableData();
    });

    // Add buttons to the container
    buttonContainer.append(selectAllButton, clearSelectionButton);

    // Append the button container inside the nestedChecklist
    const nestedChecklist = document.getElementById('nestedChecklist');
    nestedChecklist.insertBefore(buttonContainer, nestedChecklist.firstChild);
}


// Toggle all checkboxes based on the provided state (true for select all, false for deselect all)
function toggleAllCheckboxes(state) {
    const checkboxes = document.querySelectorAll('.nested-checkbox');
    checkboxes.forEach(checkbox => (checkbox.checked = state));
}



function getSelectedRwah() {
    const qarieIDCheckedList = [];
    const rawyCheckedList = [];
    const tareeq1CheckedList = [];
    const tareeq2CheckedList = [];

    // Get all Qarie elements by id starting with "qarie-"
    document.querySelectorAll('[id^="qarie-"]').forEach(qarie => {
        const qarieCheckbox = qarie.querySelector('input[type="checkbox"]');
        if (!qarieCheckbox) return; // Skip if the checkbox doesn't exist

        const qarieID = qarie.id.split('-')[1];

        if (qarieCheckbox.checked) {
            qarieIDCheckedList.push({ qarieID: Number(qarieID) });
        } else {
            // Get all Rawy elements under this Qarie by id starting with "rawy-"
            qarie.querySelectorAll('[id^="rawy-"]').forEach(rawy => {
                const rawyCheckbox = rawy.querySelector('input[type="checkbox"]');
                if (!rawyCheckbox) return; // Skip if the checkbox doesn't exist

                let rawyID = rawy.id.split('-')[1];

                // Check if rawyID is NaN, and replace it with [13, 14] if it is
                if (isNaN(rawyID)) {
                    rawyID = [13, 14];
                } else {
                    rawyID = Number(rawyID);
                }

                if (rawyCheckbox.checked) {
                    rawyCheckedList.push({ qarieID: Number(qarieID), rawyID: rawyID });
                } else {
                    // Get all Tareeq1 elements under this Rawy by id starting with "tareeq1-"
                    rawy.querySelectorAll('[id^="tareeq1-"]').forEach(tareeq1 => {
                        const tareeq1Checkbox = tareeq1.querySelector('input[type="checkbox"]');
                        if (!tareeq1Checkbox) return; // Skip if the checkbox doesn't exist

                        const tareeq1ID = tareeq1.id.split('-')[1];



                        if (tareeq1Checkbox.checked) {
                            tareeq1CheckedList.push({ qarieID: Number(qarieID), rawyID: rawyID, tareeq1ID: Number(tareeq1ID) });
                        } else {                      // Check if Tareeq1 has children (Tareeq2 elements)
                            const hasTareeq2Children = tareeq1.querySelectorAll('[id^="tareeq2-"]').length > 0;

                            if (!hasTareeq2Children) {
                                // Skip to the next tareeq1ID if no children exist
                                return;
                            } else {
                                // Get all Tareeq2 elements under this Tareeq1 by id starting with "tareeq2-"
                                const tareeq2IDs = [];
                                tareeq1.querySelectorAll('[id^="tareeq2-"] input[type="checkbox"]').forEach(tareeq2Checkbox => {
                                    if (tareeq2Checkbox && tareeq2Checkbox.checked) {
                                        tareeq2IDs.push(Number(tareeq2Checkbox.id.split('-')[1]));
                                    }
                                });
    
                                if (tareeq2IDs.length > 0) {
                                    tareeq2CheckedList.push({ qarieID: Number(qarieID), rawyID: rawyID, tareeq1ID: Number(tareeq1ID), tareeq2IDs });
                                }
                            }
                        
                        } 
                    });
                }
            });
        }
    });

    // console.log(
    //     'qarieIDCheckedList', qarieIDCheckedList,
    //     'rawyCheckedList', rawyCheckedList,
    //     'tareeq1CheckedList', tareeq1CheckedList,
    //     'tareeq2CheckedList', tareeq2CheckedList
    // );

    return {
        qarieIDCheckedList,
        rawyCheckedList,
        tareeq1CheckedList,
        tareeq2CheckedList
    };
}

function selectedRwahBookSQL() {
    const { qarieIDCheckedList, rawyCheckedList, tareeq1CheckedList, tareeq2CheckedList } = getSelectedRwah();
    selectedBookIDs = getActiveBookIDs();
    let whereClause = "";

    // Add QarieIDCheckedList
    if (qarieIDCheckedList.length > 0) {
        const qarieIDs = qarieIDCheckedList.map(item => item.qarieID).join(", ");
        whereClause += `(\`0-1treeq\`.\`QarieID\` IN (${qarieIDs})) OR `;
    }

    // Add RawyCheckedList
    if (rawyCheckedList.length > 0) {
        const rawyIDs = rawyCheckedList
            .map(({ rawyID }) => (Array.isArray(rawyID) ? rawyID : [rawyID]))
            .flat()
            .join(", ");
        whereClause += `((\`0-1treeq\`.\`RawyID\` IN (${rawyIDs}))) OR `;
    }

    // Add Tareeq1CheckedList
    if (tareeq1CheckedList.length > 0) {
        const groupedByRawyID = {};
        tareeq1CheckedList.forEach(({ rawyID, tareeq1ID }) => {
            if (!groupedByRawyID[rawyID]) groupedByRawyID[rawyID] = [];
            groupedByRawyID[rawyID].push(tareeq1ID);
        });
        const conditions = Object.entries(groupedByRawyID)
            .map(([rawyID, tareeq1IDs]) => 
                `(\`0-1treeq\`.\`RawyID\` IN (${rawyID}) AND \`0-1treeq\`.\`Tareeq1ID\` IN (${tareeq1IDs.join(", ")}))`
            )
            .join(" OR ");
        whereClause += `(${conditions}) OR `;
    }

    // Add Tareeq2CheckedList
    if (tareeq2CheckedList.length > 0) {
        const conditions = tareeq2CheckedList.map(({ rawyID, tareeq1ID, tareeq2IDs }) => {
            const tareeq1Condition = Array.isArray(tareeq1ID)
                ? `\`0-1treeq\`.\`Tareeq1ID\` IN (${tareeq1ID.join(", ")})`
                : `\`0-1treeq\`.\`Tareeq1ID\` = ${tareeq1ID}`;
            const tareeq2Condition = `\`0-1treeq\`.\`Tareeq2ID\` IN (${tareeq2IDs.join(", ")})`;
            return `(\`0-1treeq\`.\`RawyID\` IN (${rawyID}) AND ${tareeq1Condition} AND ${tareeq2Condition})`;
        }).join(" OR ");
        whereClause += `(${conditions}) OR `;
    }

    // Remove the trailing OR and return
    whereClause = whereClause.trim().replace(/OR\s*$/, "");

    // Add BookID condition
    let bookCondition = "";
    if (selectedBookIDs.length > 0) {
        bookCondition = `\`0-1treeq\`.\`BookID\` IN (${selectedBookIDs.join(", ")})`;
        if (whereClause) {
            bookCondition = `AND ${bookCondition}`;
        }
    }

    // Construct final query
    return whereClause
        ? `AND ( ${whereClause} ) ${bookCondition}`
        : (bookCondition ? `AND ${bookCondition}` : "");
}






// ----------------------------------------------------------------------



