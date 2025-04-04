
let bookList;



async function fetchBook() {
    try {
        const response = await fetch('/getBook/');
        if (!response.ok) {
            throw new Error('Failed to fetch Book');
        }
        bookList = await response.json(); // Cache the data
        return;
    } catch (error) {
        console.error('Error:', error);
    }
}


async function addBookList () {
    await fetchBook();
    if (bookList === undefined){
        console.error('Error:', error);
        return;
    }

    createBookChecklist(bookList);
    addBookSelectButtons();
    return;
}


function createBookChecklist(data) {
    const container = document.getElementById('bookChecklist');
    container.innerHTML = ''; // Clear previous content

    data.forEach(book => {
        const bookElement = createCheckbox(book.BookName, `book-${book.BookID}`);
        container.appendChild(bookElement);
    });
}



// Add new selectAllButton and clearSelectionButton buttons for bookChecklist
function addBookSelectButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container-new'); // New class for the book buttons container

    // selectAllButton
    const selectAllButton = document.createElement('button');
    selectAllButton.innerHTML = '<i class="fa fa-check-square"></i>'; // Replace with an appropriate icon
    selectAllButton.classList.add('select-all-new'); // New class for the "select all" button
    selectAllButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#bookChecklist input[type="checkbox"]');
        checkboxes.forEach(checkbox => (checkbox.checked = true));
        handleTableData();
    });

    // clearSelectionButton
    const clearSelectionButton = document.createElement('button');
    clearSelectionButton.innerHTML = '<i class="fa fa-times-square"></i>'; // Replace with an appropriate icon
    clearSelectionButton.classList.add('clear-selection-new'); // New class for the "clear selection" button
    clearSelectionButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('#bookChecklist input[type="checkbox"]');
        checkboxes.forEach(checkbox => (checkbox.checked = false));
        handleTableData();
    });

    // Add buttons to the container
    buttonContainer.append(selectAllButton, clearSelectionButton);

    // Append the button container inside the bookChecklist
    const bookChecklist = document.getElementById('bookChecklist');
    bookChecklist.insertBefore(buttonContainer, bookChecklist.firstChild);
}





function getSelectedRawyBookIDs(qarieIDCheckedList, rawyCheckedList, tareeq1CheckedList, tareeq2CheckedList) {
    const bookIDs = new Set();

    // Helper function to compare RawyID values (handles numbers and arrays)
    function areRawyIDsEqual(id1, id2) {
        if (Array.isArray(id1) && Array.isArray(id2)) {
            return id1.length === id2.length && id1.every((val, index) => val === id2[index]);
        }
        return id1 === id2;
    }

    // Iterate through QarieIDs
    Object.values(rwahNastedList).forEach(qarie => {
        if (qarieIDCheckedList.some(item => item.qarieID === qarie.QarieID)) {
            // Add all books under this Qarie
            Object.values(qarie.Rawies).forEach(rawy => {
                Object.values(rawy.Tareeq1s).forEach(tareeq1 => {
                    Object.values(tareeq1.Tareeq2s).forEach(tareeq2 => {
                        tareeq2.Books.forEach(book => bookIDs.add(book.BookID));
                    });
                });
            });
            return;
        }

        // Iterate through RawyIDs
        Object.values(qarie.Rawies).forEach(rawy => {
            if (rawyCheckedList.some(item => item.qarieID === qarie.QarieID && areRawyIDsEqual(item.rawyID, rawy.RawyID))) {
                // Add all books under this Rawy
                Object.values(rawy.Tareeq1s).forEach(tareeq1 => {
                    Object.values(tareeq1.Tareeq2s).forEach(tareeq2 => {
                        tareeq2.Books.forEach(book => bookIDs.add(book.BookID));
                    });
                });
                return;
            }

            // Iterate through Tareeq1IDs
            Object.values(rawy.Tareeq1s).forEach(tareeq1 => {
                if (tareeq1CheckedList.some(item => 
                    item.qarieID === qarie.QarieID &&
                    areRawyIDsEqual(item.rawyID, rawy.RawyID) &&
                    item.tareeq1ID === tareeq1.Tareeq1ID)) {
                    // Add all books under this Tareeq1
                    Object.values(tareeq1.Tareeq2s).forEach(tareeq2 => {
                        tareeq2.Books.forEach(book => bookIDs.add(book.BookID));
                    });
                    return;
                }

                // Iterate through Tareeq2IDs
                Object.values(tareeq1.Tareeq2s).forEach(tareeq2 => {
                    if (tareeq2CheckedList.some(item => 
                        item.qarieID === qarie.QarieID &&
                        areRawyIDsEqual(item.rawyID, rawy.RawyID) &&
                        item.tareeq1ID === tareeq1.Tareeq1ID &&
                        item.tareeq2IDs.includes(tareeq2.Tareeq2ID))) {
                        // Add all books under this Tareeq2
                        tareeq2.Books.forEach(book => bookIDs.add(book.BookID));
                    }
                });
            });
        });
    });

    let bookIDsArr = Array.from(bookIDs);
     //console.log(bookIDsArr);
    return bookIDsArr; // Convert Set to Array
}


function updateBookCheckboxStates() {
    
    // Get all selected book IDs
    const { qarieIDCheckedList, rawyCheckedList, tareeq1CheckedList, tareeq2CheckedList } = getSelectedRwah();

    const selectedBookIDs = getSelectedRawyBookIDs( qarieIDCheckedList, rawyCheckedList, tareeq1CheckedList, tareeq2CheckedList ); 

    // Get all book checkboxes in the checklist
    const bookCheckboxes = document.querySelectorAll('#bookChecklist input[type="checkbox"]');

    // Loop through each checkbox and update its class
    bookCheckboxes.forEach(checkbox => {
        const bookID = checkbox.id.replace('book-', ''); // Extract book ID from the checkbox ID

        if (selectedBookIDs.includes(Number(bookID))) {
            checkbox.classList.remove('inactive-checkbox'); // Remove inactive class if bookID is in the list
        } else {
            checkbox.classList.add('inactive-checkbox'); // Add inactive class if bookID is not in the list
        }
    });

}


function getActiveBookIDs() {
    const checkboxes = document.querySelectorAll('#bookChecklist input[type="checkbox"]:checked'); // Get checked checkboxes
    const activeBookIDs = Array.from(checkboxes)
        .filter(checkbox => !checkbox.classList.contains('inactive-checkbox')) // Exclude inactive checkboxes
        .map(checkbox => {
            return parseInt(checkbox.id.replace('book-', ''), 10); // Extract and parse the book ID
        });
     //console.log('activeBookIDs', activeBookIDs);
    // If all books are active, return an empty array
    if (activeBookIDs.length === bookList.length) {
        return [];
    }
    return activeBookIDs;
}




// async function getAllSelectedBookIDs() {
//     const { qarieIDCheckedList, rawyCheckedList, tareeq1CheckedList, tareeq2CheckedList } = getSelectedRwah();

//     // Use rwahList to filter books based on selected checkboxes
//     const selectedBookIDs = [];

//     // Filter books based on QarieID
//     qarieIDCheckedList.forEach(qarie => {
//         const filteredBooks = rwahList.filter(row => row.QarieID === qarie.qarieID);
//         filteredBooks.forEach(book => {
//             selectedBookIDs.push(book.BookID);
//         });
//     });

//     // Filter books based on QarieID and RawyID
//     rawyCheckedList.forEach(rawy => {
//         const filteredBooks = rwahList.filter(row => row.QarieID === rawy.qarieID && row.RawyID === rawy.rawyID);
//         filteredBooks.forEach(book => {
//             selectedBookIDs.push(book.BookID);
//         });
//     });

//     // Filter books based on QarieID, RawyID, and Tareeq1ID
//     tareeq1CheckedList.forEach(tareeq1 => {
//         const filteredBooks = rwahList.filter(row => 
//             row.QarieID === tareeq1.qarieID && 
//             row.RawyID === tareeq1.rawyID && 
//             row.Tareeq1ID === tareeq1.tareeq1ID
//         );
//         filteredBooks.forEach(book => {
//             selectedBookIDs.push(book.BookID);
//         });
//     });

//     // Filter books based on QarieID, RawyID, Tareeq1ID, and Tareeq2ID
//     tareeq2CheckedList.forEach(tareeq2 => {
//         const filteredBooks = rwahList.filter(row => 
//             row.QarieID === tareeq2.qarieID && 
//             row.RawyID === tareeq2.rawyID && 
//             row.Tareeq1ID === tareeq2.tareeq1ID && 
//             row.Tareeq2ID === tareeq2.tareeq2ID
//         );
//         filteredBooks.forEach(book => {
//             selectedBookIDs.push(book.BookID);
//         });
//     });

//     // Remove duplicates by converting the array to a Set and then back to an array
//     const uniqueSelectedBookIDs = [...new Set(selectedBookIDs)];

//     // Log the selected Book IDs
//     console.log('Selected Unique Book IDs:', uniqueSelectedBookIDs);

//     return uniqueSelectedBookIDs;
// }



