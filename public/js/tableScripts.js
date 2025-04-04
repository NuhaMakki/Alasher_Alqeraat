
// Increment function with configurable range
function increment(input, min, max, index) {
    let value = parseInt(input.getAttribute("data-value"));
    if (value < max) {
        input.value = value + 1;
        validateNumberInput(input, min, max, index);
    } else {
        showError(input);  
    }
}

// Decrement function with configurable range
function decrement(input, min, max, index) {
    let value = parseInt(input.getAttribute("data-value"));
    if (value > min) {
        input.value = value - 1;
        validateNumberInput(input, min, max, index);
    } else {
        showError(input);  
    }
}

// Validate the input value with the given min and max range
function validateNumberInput(input, min, max, index) {
    let value = parseInt(convertArabicToEnglish(input.value));
    if (value < min) {
        input.setAttribute("data-value", min); // Store the English value
        input.value = convertEnglishToArabic(min);
        showError(input);  
    } else if (value > max) {
        input.setAttribute("data-value", max); // Store the English value
        input.value = convertEnglishToArabic(max);
        showError(input); 
    } else {
        input.classList.remove("error-border");
        input.value = convertEnglishToArabic(input.value) // Convert English digits to Arabic
        input.setAttribute("data-value", convertArabicToEnglish(input.value)); // Store the English value
    }
     //console.log(value);
     //console.log(input.getAttribute("data-value"));
     //console.log(input.value);

    incrdecrKhelafatArray(input.getAttribute("data-value"), index);

}

// Ensure only numeric characters (Arabic and English) are allowed
function handleKeydown(event, min, max) {
    const input = event.target;
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];

    if (event.key === "ArrowUp") {
        increment(input, min, max);
        event.preventDefault();
    } else if (event.key === "ArrowDown") {
        decrement(input, min, max);
        event.preventDefault();
    } else if (!/[0-9٠-٩]/.test(event.key) && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
}



// Function to set default value if input is empty
async function setDefaultValueIfEmpty(input, min) {
    if (input.value === "") {
        input.setAttribute("data-value", min); // Store the English value
        input.value = convertEnglishToArabic(min); // Display Arabic
        await incrdecrKhelafatArray(input.getAttribute("data-value"));
        resetElementAttribute(0);
        handleTableData();
    } 

}


// // Function to set default value if input is empty
// async function clearValueInput1(input, min) {
//     // while(khelafatArray.length > min){
//     //     decrement(input, 1, 50);
//     // }
//     // increment(input, 1, 50);
//     // decrement(input, 1, 50);
    
//     resetBabContainer(khelafatArray[0].khelafCounter);
    
//     await resetSorahContainer();
    
//     await clearKhelafatArray(input, min);

//     await handleTableData();

// }

async function clearValueInput1(input, min) {

    while (sorahCount > 1){
        const container = document.getElementById(`inner-container-${sorahCount}`);
        if (container) {
            container.remove();
        }
        sorahCount --;
    }


    let dropdownMenu = document.getElementById('surahDropdown-1');
    dropdownMenu.value = '';
    dropdownMenu.setAttribute('selected-sorah-ID', null);
    document.querySelector(`#ayahInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-sorah', '');

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




    input.setAttribute("data-value", min); // Store the English value
    input.value = convertEnglishToArabic(min); // Display Arabic

    while (khelafatArray.length>1){

        let container = document.getElementById(`bab-container-${khelafatArray[khelafatArray.length-1].khelafCounter}`);
        if (container) { container.remove();  }
        khelafatArray.pop();

    }


    khelafatArray[0]['khelafID'] = null;
    khelafatArray[0]['word'] = null;
    khelafatArray[0]['KhelafAName'] = null;
    khelafatArray[0]['KhelafEName'] = null;
    khelafatArray[0]['BabID'] = null;
    khelafatArray[0]['BabName'] = null;

    let container = document.getElementById(`bab-container-${khelafatArray[khelafatArray.length-1].khelafCounter}`);
    if (container) { container.remove();  }


    khelafCounterVar ++;
    khelafatArray[0]['khelafCounter'] = khelafCounterVar;


    addBabContainer(khelafatArray[0].khelafCounter);

    updateAyahText();
    await handleTableData();
}

async function clearKhelafatArray(input, min) {
    input.setAttribute("data-value", min); // Store the English value
    input.value = convertEnglishToArabic(min); // Display Arabic
    await incrdecrKhelafatArray(input.getAttribute("data-value"));
    resetElementAttribute(0);
}

// -----------------------------------------------------------------------------------------


let khelafCounterVar = 1;

// Initialize the khelafatArray with one element, all attributes set to null
let khelafatArray = [
    {   
        khelafID: null,
        word: null,
        KhelafAName: null,
        KhelafEName: null,
        BabID: null,
        BabName: null,
        khelafCounter: khelafCounterVar,
    },
];




// Function to add a new element at the end
function resetElementAttribute(index) {
    if (khelafatArray[index]) {
        khelafatArray[index]['khelafID'] = null;
        khelafatArray[index]['word'] = null;
        khelafatArray[index]['KhelafAName'] = null;
        khelafatArray[index]['KhelafEName'] = null;
        khelafatArray[index]['BabID'] = null;
        khelafatArray[index]['BabName'] = null;
    } else {
        console.error(`Element at index ${index} does not exist.`);
    }
}




// Function to add a new element after a given index
function addElementAfterIndex(index, element) {
    if (index === undefined){
        khelafatArray.push(element);
    } else {
        if (index >= -1 && index < khelafatArray.length) {
            khelafatArray.splice(index + 1, 0, element);
        } else {
            console.error(`Invalid index ${index}.`);
        }
    }
}

// Function to delete an element from the end
function deleteElementFromEnd() {
    if (khelafatArray.length > 0) {
        deleteBabContainer(khelafatArray[khelafatArray.length-1]['khelafCounter']);
        khelafatArray.pop();
        deleteColumn(document.getElementById('table-header').children.length - 2);

    } else {
        console.error("Array is already empty.");
    }
}

// Function to delete an element at a given index
function deleteElementAtIndex(index) {
    if (index === undefined){
        deleteBabContainer(khelafatArray[khelafatArray.length-1]['khelafCounter']);
        khelafatArray.pop();
        deleteColumn(document.getElementById('table-header').children.length - 2);
    } else {
        if (index >= 0 && index < khelafatArray.length) {
            deleteBabContainer(khelafatArray[index]['khelafCounter']);
            khelafatArray.splice(index, 1);
            deleteColumn(document.getElementById('table-header').children.length - (index + 1));

        } else {
            console.error(`Invalid index ${index}.`);
        }
    }
}


// -----------------------------------------------------------------------------------------




async function incrdecrKhelafatArray (khelafNo, index) {
    if (khelafNo > khelafatArray.length){
        while (khelafNo > khelafatArray.length){
            khelafCounterVar++;
            
            addElementAfterIndex (  index,  {
                khelafID: null,
                word: null,
                KhelafAName: null,
                KhelafEName: null,
                BabID: null,
                BabName: null,
                khelafCounter: khelafCounterVar,
            });
            addEmptyColumn(index);
            addBabContainer(khelafCounterVar);
        }


    } else if (khelafNo < khelafatArray.length){
        while (khelafNo < khelafatArray.length){
            
            deleteElementAtIndex(index);
            handleTableData();
            
        }
    }

     //console.log('khelafatArray-length', khelafatArray.length);
     //console.log('Updated khelafatArray:', khelafatArray);

}


async function updateKhelafatArray(){
    // Loop through the maqta inputs depending on the direction
    let khelafCount = 0;

    
    document.getElementById('numberInput1').setAttribute("data-value", 1); // Store the English value
    document.getElementById('numberInput1').value = convertEnglishToArabic(1); // Display Arabic

    while (khelafatArray.length>1){

        let container = document.getElementById(`bab-container-${khelafatArray[khelafatArray.length-1].khelafCounter}`);
        if (container) { container.remove();  }
        khelafatArray.pop();

    }


    khelafatArray[0]['khelafID'] = null;
    khelafatArray[0]['word'] = null;
    khelafatArray[0]['KhelafAName'] = null;
    khelafatArray[0]['KhelafEName'] = null;
    khelafatArray[0]['BabID'] = null;
    khelafatArray[0]['BabName'] = null;
    khelafCounterVar ++;
    khelafatArray[0]['khelafCounter'] = khelafCounterVar;

    let container = document.getElementById(`bab-container-${khelafatArray[khelafatArray.length-1].khelafCounter}`);
     //console.log('container === true', container === true);
    if (container) { container.remove();  }

    addBabContainer(khelafatArray[0]['khelafCounter'])


    let input = document.getElementById("numberInput1");
    input.setAttribute("data-value", 1); // Store the English value
    input.value = convertEnglishToArabic(1); // Display Arabic
    
    for (let index = minSorahCount; index <= (sorahCount); index ++) {
        let maqtaInput = document.querySelector(`#maqtaInput-${index}`);

        // Check if data-value is not empty or null
        if (maqtaInput && maqtaInput.getAttribute('data-value') !== null && maqtaInput.getAttribute('data-value') !== "") {


            let khelafatData = maqtaInput.getAttribute('khelafatData');
            if (khelafatData) {

                // Parse the string into a JavaScript array
                khelafatData = JSON.parse(khelafatData);
                if (Array.isArray(khelafatData) && khelafatData.length > 0) {

                    for (let i = 0; i < (khelafatData.length); i++){
                        if (khelafCount>0){
                            increment(input, 1, 50);
                        }
                        khelafatArray[khelafCount].khelafID = khelafatData[i].khelafID;
                        khelafatArray[khelafCount].word = khelafatData[i].word;
                        khelafatArray[khelafCount].KhelafAName = khelafatData[i].KhelafAName;
                        khelafatArray[khelafCount].KhelafEName = khelafatData[i].KhelafEName;
                        khelafatArray[khelafCount].BabID = khelafatData[i].BabID;
                        khelafatArray[khelafCount].BabName = khelafatData[i].BabName;                        
                        await updateBabKhelaf(khelafCount);
                        
                        
                        khelafCount++;
                    }
                }
            }

        } 
    }
     //console.log('khelafatArray\n\n', khelafatArray);

    await handleTableData();

}



async function updateBabKhelaf(index){
    let khelafCounter = khelafatArray[index].khelafCounter;
    const babDropdown = document.getElementById(`babDropdown-${khelafCounter}`);
    const babOptions = document.getElementById(`babOptions-${khelafCounter}`);
    babDropdown.value = khelafatArray[index].BabName;
    await handleBabInputSelection(babDropdown, babOptions);



    const khelafDropdown = document.getElementById(`khelafDropdown-${khelafCounter}`);
    const khelafOptions = document.getElementById(`khelafOptions-${khelafCounter}`);
    khelafDropdown.value = khelafatArray[index].KhelafAName;
    await handleKhelafInputSelection(khelafDropdown, khelafOptions);

    const wordInput = document.getElementById(`wordInput-${khelafCounter}`);
    wordInput.value = khelafatArray[index].word;
}

// -----------------------------------------------------------------------------------------






// Function to handle table Name & Query
async function handleTableNameQuery() {
    let khelafIDs = []; // Initialize as an empty array

    if (khelafatArray && khelafatArray.length > 0) {
        for (let i = 0; i < khelafatArray.length; i++) {
            if (khelafatArray[i]['khelafID'] !== null) {
                khelafIDs.push(khelafatArray[i]['khelafID']);
            }
        }
    }

    if (khelafIDs.length > 0) {
        // Proceed only if khelafIDs contains at least one valid ID
        const TableNameQuery = await fetchTableNameQuery(khelafIDs);

        if (TableNameQuery && TableNameQuery.length > 0) {
             //console.log("done TableNameQuery!", TableNameQuery);
            return TableNameQuery;
        } else {
            console.error("empty TableNameQuery");
        }
    } else {
        console.error("empty khelafIDs");
    }
}





async function fetchTableNameQuery(khelafIDs) {
    try {
         //console.log("Sending khelafIDs to server:", khelafIDs);

        const response = await fetch('/getTableNameQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ khelafIDs }), // Pass IDs in the body
        });

        if (!response.ok) throw new Error("Failed to fetch table data");
        const TableNameQuery = await response.json();
         //console.log("Fetched Table Name Query:", TableNameQuery);
        return TableNameQuery;
    } catch (error) {
        console.error("Error fetching Table Name Query:", error);
        return null;
    }
}








// -----------------------------------------------------------------------------------------



const specialColumn = {
    'التكبير': true, // Define any special cells here
};

const specialCells = {
    'صِرَ ٰ⁠طَ': true, // Define any special cells here
};


const emptyColumn = {
    'انقر هنا': true, // Define any special cells here
};

let colIDs = [];



async function resetTable() {
    // Clear table content
    const tableBody = document.getElementById('tableBody'); // Adjust ID to match your table
    tableBody.innerHTML = '';

    // Optionally reset column names or headers
    const columnHeaders = document.getElementById('tableHeaders');
    columnHeaders.innerHTML = '';
    
     //console.log("Table has been reset to empty state.");


}

// Function to handle the previous Ayaat button click
async function handleTableData() {
    if (!khelafatArray || khelafatArray.length === 0) {
        console.warn("No Khelafat data found. Resetting table.");
        await resetTable(); // Reset the table when no data is found
        resetBabContainer(khelafatArray[0].khelafCounter);
        displayShwahed();
        return;
    }


    colIDs = [];
    let emptyColumnIndex = [];
    let tableData = null;
    let KhelafENames = [];
    let KhelafANames = [];
    let TableNames = [];
    let TableQueries = [];
    let RawyID = [11,13,14,21,22,31,32,41,42,51,52,61,62,71,72,81,82,91,92,101,102];


     //console.log("After Reset:");
     //console.log("khelafatArray:", khelafatArray);
     //console.log("KhelafANames:", KhelafANames);


     //console.log(khelafatArray && khelafatArray.length > 0);
    if (khelafatArray && khelafatArray.length > 0) {
        for (let i = 0; i < khelafatArray.length; i++) {
            if (khelafatArray[i]['KhelafEName'] !== null && (khelafatArray[i]['KhelafEName'] !== '')) {
                KhelafENames.push(khelafatArray[i]['KhelafEName']);

                if (khelafatArray[i]['word'] !== null && (khelafatArray[i]['word'] !== '')){
                    KhelafANames.push(khelafatArray[i]['word'] );
                } else if (khelafatArray[i]['KhelafANames'] !== null){
                    KhelafANames.push(khelafatArray[i]['KhelafANames'] );
                } else {
                    KhelafANames.push('');
                }

            } else {
                emptyColumnIndex.push(i);
            }
        }
    }

     //console.log(KhelafENames.length > 0);

    if (KhelafENames.length > 0){

        let tableNameQuery = await handleTableNameQuery();
        if (tableNameQuery){
            tableNameQuery.forEach(function(row){
                TableNames.push(row.TableName);
                TableQueries.push(row.TableQuery);
            }); 
        }

        if (TableNames.length <= 0 || TableQueries.length <= 0 ){
            console.log('no TableNames or TableQueries found');
            return;
        } 


         //console.log('KhelafENames', KhelafENames.toString());
         //console.log('TableNames', TableNames.toString());
         //console.log('TableQueries', TableQueries.join(" AND "));


        let SELECT = "SELECT ";
        for (var i in KhelafENames){
             SELECT += KhelafENames[i] + " AS ' K"+ i +"' ,";
        }
        SELECT += " GROUP_CONCAT(DISTINCT (`0-3rwaah`.`RawyName`) ORDER BY `0-3rwaah`.`RawyID` ASC SEPARATOR ' ، ' ) as 'Rwah' , GROUP_CONCAT( DISTINCT CAST(`0-1treeq`.`ColID` AS UNSIGNED) ORDER BY CAST(`0-1treeq`.`ColID` AS UNSIGNED) ASC SEPARATOR ' ، ') AS 'ColID' ";
        let FROM = " FROM  `0-1treeq`, `0-3rwaah` ," + TableNames.toString();
        
        const sqlWhereClause = selectedRwahBookSQL();
        //console.log(sqlWhereClause);
        
        let WHERE = " WHERE `0-1treeq`.`RawyID`= `0-3rwaah`.`RawyID` "+ sqlWhereClause +" AND " + TableQueries.join(" AND ");
        let GroupOrder = " GROUP BY " + KhelafENames.toString() + " ORDER BY CAST(SUBSTRING_INDEX(GROUP_CONCAT(CAST(`0-1treeq`.`RawyID` AS UNSIGNED) ORDER BY CAST(`0-1treeq`.`RawyID` AS UNSIGNED) ASC SEPARATOR ','), ',', 1) AS UNSIGNED); " ;
        //let GroupOrder = " GROUP BY " + KhelafENames.toString() + " ORDER BY " + KhelafENames.toString() + " ASC; " ;
        //let GroupOrder = " GROUP BY " + KhelafENames.toString() + " ORDER BY CAST(SUBSTRING_INDEX(GROUP_CONCAT(CAST(`0-1treeq`.`ColID` AS UNSIGNED) ORDER BY CAST(`0-1treeq`.`ColID` AS UNSIGNED) ASC SEPARATOR ','), ',', 1) AS UNSIGNED); " ;
        //let GroupOrder = " GROUP BY " + KhelafENames.toString() + " ORDER BY `0-1treeq`.`ColID`, " + KhelafENames.toString() + " ASC; " ;
        
        var sql = SELECT + FROM + WHERE + GroupOrder;
         //console.log(sql);


        // Fetch the previous Ayah data
        tableData = await fetchTableData(sql);


        if (tableData && tableData.length > 0) {

            // Example usage
            rearrangeData(tableData);
             //console.log('sortedData', tableData);
            
            colIDs = [];
            // moveColIds
            tableData.forEach(row => {
                if (row.hasOwnProperty("ColID")) {
                    // Store the ColID value in the colIDs array
                    colIDs.push(row["ColID"]);

                    // Delete the ColID column from the row
                    delete row["ColID"];
                }
            });


            // changeRwahToQoraa(tableData);
            tableData.forEach(row => {
                if (row.hasOwnProperty("Rwah")) { 
                         row["Rwah"] = changeRwahToQoraa(row["Rwah"])

                }
            });

            tableData = replaceDigitsInData(tableData);

        }

    }


     //console.log(tableData);
     //console.log(KhelafANames);
     //console.log(khelafatArray);

    if (tableData === null) {
        let resetIndex = khelafatArray[0].khelafCounter;
        // Reset Bab Dropdown
        const babDropdown = document.getElementById(`babDropdown-${resetIndex}`);
        babDropdown.value = ''; // Clear input value
        babDropdown.setAttribute('selected-bab-ID', ''); // Reset custom attribute

        // Reset Khelaf Dropdown
        const khelafDropdown = document.getElementById(`khelafDropdown-${resetIndex}`);
        khelafDropdown.value = ''; // Clear input value
        khelafDropdown.setAttribute('selected-khelaf-ID', ''); // Reset custom attribute
        khelafDropdown.setAttribute('selected-khelaf-Ename', ''); // Reset custom attribute

        // Reset Word Input
        const wordInput = document.getElementById(`wordInput-${resetIndex}`);
        wordInput.value = ''; // Clear input value
    }


        fillTable(tableData, KhelafANames);
        emptyColumnIndex.forEach(row => {
            addEmptyColumn(row-1);
        });
        setupBabContainerToggle();

        addSpecialClassToMatchingCells();
        addSpecialClassToColumns();
        displayShwahed();

}





// Function to fetch the previous Ayat
async function fetchTableData(sql) {
    try {
        const response = await fetch(`/getTableData/${sql}`);
        if (!response.ok) throw new Error("Failed to fetch table data");
        const tableData = await response.json();
         //console.log("Fetched Table Data:", tableData);
        return tableData; // Return the fetched data
    } catch (error) {
        console.error("Error fetching Table data:", error);
        return null; // Return null on error
    }
}




async function fillTable(data, KhelafANames) {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');
    const table = document.querySelector('.custom-table');

    try {
 
        // Clear previous data from table header and body
        tableHeader.innerHTML = ''; 
        tableBody.innerHTML = '';
        
        if (!data || data.length === 0 ) {
            //console.error("No data available to populate the table.");
            // Add an additional empty column with 'last-column' class
            const lastTh = document.createElement('th');
            lastTh.textContent = ""; // Empty text for the last column
            lastTh.className = 'last-column';
            tableHeader.appendChild(lastTh);

            // Add rows with empty columns to the body
            const emptyRow = document.createElement('tr');
            const emptyTd2 = document.createElement('td');

            emptyTd2.className = 'last-column';
            emptyTd2.innerHTML = "&nbsp;"; // Adds a visual empty space

            emptyRow.appendChild(emptyTd2);
            tableBody.appendChild(emptyRow);

        } else {
        
            // Populate table header
            // const headers = Object.keys(data[0]);
            KhelafANames.push('');
            KhelafANames.forEach((header, index) => {
                const th = document.createElement('th');
                th.textContent = header;
                th.className = index === KhelafANames.length - 1 ? 'last-column' : '';
                tableHeader.appendChild(th);
            });
            const th = document.createElement('th');
            th.className =  'last-column tareeq-column';
            tableHeader.appendChild(th);

            // Populate table body
            data.forEach((row, rowIndex) => {
                const tr = document.createElement('tr');
                tr.setAttribute('draggable', 'true'); 
                Object.entries(row).forEach(([key, value], colIndex) => {
                const td = document.createElement('td');
                td.textContent = value;
        
                if (colIndex === KhelafANames.length - 1) {
                    td.className = 'last-column';
                }
        
                if (specialCells[key]) {
                    td.className = 'special-cell';
                }

                if (specialColumn[key]) {
                    td.className = 'special-column';
                }
        
                tr.appendChild(td);
                });
        


                // Add the last column with the clickable icon
                const lastTd = document.createElement('td');
                lastTd.className = 'last-column tareeq-column';

                const icon = document.createElement('i');
                icon.className = 'fa fa-exclamation-circle tareeq-icon'; // Font Awesome icon class
                icon.style.cursor = 'pointer';


                // Parse colIDs[rowIndex] into an array of integers
                const parsedIDs = colIDs[rowIndex]
                    .split('،') // Split by Arabic comma
                    .map(id => parseInt(id.trim(), 10)) // Trim and convert to integer
                    .filter(Number.isFinite); // Ensure valid numbers only

                icon.onclick = () => showTareeqDet(parsedIDs);

                lastTd.appendChild(icon);
                tr.appendChild(lastTd);
                



                // Alternate row background color
                tableBody.appendChild(tr);
            });

        }
    
        } catch (error) {
        console.error("Error loading table data:", error);
        }
        makeTableRowsMovable();
   
}



function makeTableRowsMovable() {
    const tableBody = document.getElementById('table-body');
    
    // Store the dragged element
    let draggedRow = null;

    tableBody.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'TR') {
            draggedRow = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    tableBody.addEventListener('dragend', (e) => {
        if (e.target.tagName === 'TR') {
            e.target.style.opacity = '';
            // Call the function after the row order has changed
            addSpecialClassToMatchingCells();
            addSpecialClassToColumns();
        }
    });

    tableBody.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
        const draggingOverRow = e.target.closest('tr');
        if (draggingOverRow && draggingOverRow !== draggedRow) {
            const bounding = draggingOverRow.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            const middle = bounding.height / 2;
            if (offset > middle) {
                draggingOverRow.parentNode.insertBefore(draggedRow, draggingOverRow.nextSibling);
            } else {
                draggingOverRow.parentNode.insertBefore(draggedRow, draggingOverRow);
            }
        }
    });
}


//<i class="fa fa-exclamation-circle"></i>
// <i class="fa fa-trash-alt"></i>

// -----------------------------------------------------------------------------------------
// Helper function to recursively process all object fields
function replaceDigitsInData(data) {
    if (Array.isArray(data)) {
        return data.map(replaceDigitsInData);
    } else if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, replaceDigitsInData(value)])
        );
    } else if (typeof data === 'string' || typeof data === 'number') {
        return convertEnglishToArabic(data);
    }
    return data; // Return as-is for other types (e.g., boolean, null)
}


// Helper function to sort rows based on the first appearance of K values
function rearrangeData(data) {

    return data
    
    // Extract column names dynamically (K0 to Kx-2)
    const kColumns = Object.keys(data[0])
        .filter(key => key.startsWith('K'))
        .sort(); // Ensure order (K0, K1, K2...)

    // Build a mapping of unique values for each K column based on their first appearance
    const valueOrder = {};
    kColumns.forEach(col => {
        valueOrder[col] = [];
        data.forEach(row => {
            if (!valueOrder[col].includes(row[col])) {
                valueOrder[col].push(row[col]);
            }
        });
    });

    // Comparator function to sort rows by K columns in order of appearance
    function compareRows(rowA, rowB) {
        for (const col of kColumns) {
            const indexA = valueOrder[col].indexOf(rowA[col]);
            const indexB = valueOrder[col].indexOf(rowB[col]);

            if (indexA !== indexB) {
                return indexA - indexB;
            }
        }
        return 0; // If all columns are equal
    }


    // Sort the data using the comparator
    return data.sort(compareRows);
}



function changeRwahToQoraa(text) {
    const mappings = {
        'الأزرق ، الأصبهاني': 'ورش',
        'قالون ، ورش': 'نافع',
        'البزي ، قنبل': 'ابن كثير',
        'دوري \\(ع\\) ، السوسي': 'أبو عمرو', // Escaped parentheses
        'هشام ، ابن ذكوان': 'ابن عامر',
        'شعبة ، حفص': 'عاصم',
        'خلف ، خلاد': 'حمزة',
        'أبو الحارث ، دوري \\(ك\\)': 'الكسائي', // Escaped parentheses
        'ابن وردان ، ابن جماز': 'أبو جعفر',
        'رويس ، روح': 'يعقوب',
        'إسحاق ، إدريس': 'العاشر'
    };

    for (const [pattern, replacement] of Object.entries(mappings)) {
        const regex = new RegExp(pattern, 'g');
        text = text.replace(regex, replacement);
    }

    return text; // Return original text if no patterns match
}


function addSpecialClassToMatchingCells() {
    const tableBody = document.getElementById('table-body');
    

    // First, remove the 'special-cell' class from all cells
    const allCells = tableBody.getElementsByTagName('td');
    for (let cell of allCells) {
        cell.classList.remove('special-cell');
    }
    
    // Loop through all rows starting from the second row (index 1)
    for (let i = 1; i < tableBody.rows.length; i++) {
        const currentRow = tableBody.rows[i];
        const previousRow = tableBody.rows[i - 1]; // Get the previous row
        
        // Loop through each cell in the current row and compare it to the corresponding cell in the previous row
        for (let j = 0; j < currentRow.cells.length; j++) {
            if (currentRow.cells[j].textContent === previousRow.cells[j].textContent) {
                currentRow.cells[j].classList.add('special-cell');
                
            } else {
                break; // Stop at the first mismatch
            }
        }
    }
}

function addSpecialClassToColumns() {
    const tableBody = document.getElementById('table-body');
    const columnUniqueValues = {}; // Separate unique values for each column
    const columnUniqueValuesOpacity = {}; // Separate unique values for each column
    const colors = [
        '#000000', '#15989B', '#7030A0', '#0070C0', '#5EBC00', '#CF9C35', '#CC6688', '#537888',
    ];
    const colorsWithOpacity = [
        'rgba(0, 0, 0, 0.2)',      // #000000 with 0.2 opacity
        'rgba(21, 152, 155, 0.2)', // #15989B with 0.2 opacity
        'rgba(112, 48, 160, 0.2)', // #7030A0 with 0.2 opacity
        'rgba(0, 112, 192, 0.2)',  // #0070C0 with 0.2 opacity
        'rgba(94, 188, 0, 0.2)',    // #5EBC00 with 0.2 opacity
        'rgba(207, 156, 53, 0.2)',  // #CF9C35 with 0.2 opacity
        'rgba(204, 102, 136, 0.2)', // #CC6688 with 0.2 opacity
        'rgba(83, 120, 136, 0.2)',  // #537888 with 0.2 opacity

        
    ];

    function cleanString(str) {
        return str.replace(/\(.*$/, '').trim();
    }

    // Loop through all rows
    for (let i = 0; i < tableBody.rows.length; i++) {
        const currentRow = tableBody.rows[i];

        // Loop through each cell in the row
        for (let j = 0; j < currentRow.cells.length; j++) {
            // Ensure a uniqueValues object exists for the column
            if (!columnUniqueValues[j]) {
                columnUniqueValues[j] = {};
                columnUniqueValuesOpacity[j] = {};
            }

            // Check if khelafID is greater than 4000 for the current column index
            if (khelafatArray[j] && (parseInt(khelafatArray[j].khelafID) > 4000 || parseInt(khelafatArray[j].khelafID) === 201 ) ) {
                currentRow.cells[j].classList.add('special-column');

                // Get and clean the cell text
                const cellText = cleanString(currentRow.cells[j].textContent);

                // Assign a color to unique values within this column
                if (!columnUniqueValues[j][cellText]) {
                    columnUniqueValues[j][cellText] = colors[Object.keys(columnUniqueValues[j]).length % colors.length];
                    columnUniqueValuesOpacity[j][cellText] = colorsWithOpacity[Object.keys(columnUniqueValuesOpacity[j]).length % colorsWithOpacity.length];
                }

                // Apply the appropriate color based on the cell class
                if (currentRow.cells[j].classList.contains('special-cell')) {
                    currentRow.cells[j].style.color = columnUniqueValuesOpacity[j][cellText];
                } else {
                    currentRow.cells[j].style.color = columnUniqueValues[j][cellText];
                }
            }
        }
    }
}




// -----------------------------------------------------------------------------------------

function addEmptyColumn(index) {
    if (index === undefined){
        index = document.getElementById('table-header').children.length - 3;
    }
    const table = document.querySelector('.custom-table');
    if (!table) {
        console.error("Table not found.");
        return;
    }

    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    // Add new column to the header
    const ths = Array.from(tableHeader.children);
    const newTh = document.createElement('th');
    newTh.textContent = "انقر هنا"; // Placeholder text for the header
    newTh.className = 'empty-column';
    if (index < ths.length - 1) {
        tableHeader.insertBefore(newTh, ths[index + 1]);
    } else {
        tableHeader.appendChild(newTh);
    }

    // Add new column to each row in the table body
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const tds = Array.from(row.children);
        const newTd = document.createElement('td');
        newTd.textContent = ""; // Empty content
        newTd.className = 'empty-column';
        if (index < tds.length - 1) {
            row.insertBefore(newTd, tds[index + 1]);
        } else {
            row.appendChild(newTd);
        }
    });
}



function deleteColumn(index) {
    const table = document.querySelector('.custom-table');
    if (!table) {
        console.error("Table not found.");
        return;
    }

    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    // Remove the header column at the specified index
    const ths = Array.from(tableHeader.children);
    if (index >= 0 && index < ths.length) {
        tableHeader.removeChild(ths[index]);
    }

    // Remove the corresponding column in each row of the table body
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const tds = Array.from(row.children);
        if (index >= 0 && index < tds.length) {
            row.removeChild(tds[index]);
        }
    });
}










// -----------------------------------------------------------------------------------------






// Function to add a new Bab container
function addBabContainer(index) {
    const container = document.getElementById("babContainer");

    // Create a new container dynamically
    const newContainer = document.createElement("div");
    newContainer.classList.add("bab-container");
    newContainer.id = `bab-container-${index}`;
    newContainer.innerHTML = `
        <div class="dropdown-container">
            <!-- Bab Dropdown -->


            <div class="bab-dropdown-wrapper" tabindex="0" 
                onkeydown="handleBabDropdownKeyboard(event, document.getElementById('babDropdown-${index}'), document.getElementById('babOptions-${index}'))">
                <div class="dropdown-wrapper-a">
                    <input 
                        type="text" 
                        id="babDropdown-${index}" 
                        class="dropdown-input" 
                        placeholder="الباب" 
                        oninput="filterBabOptions(document.getElementById('babDropdown-${index}'), document.getElementById('babOptions-${index}'))" 
                        autocomplete="off"
                        selected-bab-ID=""
                        index="${index}">
                    <i class="fas fa-chevron-down dropdown-arrow-icon" 
                        onclick="toggleBabKhelafDropdown(document.getElementById('babDropdown-${index}'), document.getElementById('babOptions-${index}'))"></i>
                    <ul class="dropdown-menu" id="babOptions-${index}" currentActiveIndex="-1">
                        <!-- Options will be dynamically populated -->
                    </ul>
                </div>
            </div>



            <!-- Khelaf Dropdown -->
            <div class="khelaf-dropdown-wrapper" tabindex="0" 
                onkeydown="handleKhelafDropdownKeyboard(event, document.getElementById('khelafDropdown-${index}'), document.getElementById('khelafOptions-${index}'))">
                <div class="dropdown-wrapper-a">
                    <input 
                        type="text" 
                        id="khelafDropdown-${index}" 
                        class="dropdown-input" 
                        placeholder="الخلاف" 
                        oninput="filterKhelafOptions(document.getElementById('khelafDropdown-${index}'), document.getElementById('khelafOptions-${index}'))" 
                        autocomplete="off"
                        selected-khelaf-ID=""
                        selected-khelaf-Ename=""
                        index="${index}">
                    <i class="fas fa-chevron-down dropdown-arrow-icon" 
                        onclick="toggleBabKhelafDropdown(document.getElementById('khelafDropdown-${index}'), document.getElementById('khelafOptions-${index}'))"></i>
                    <ul class="dropdown-menu" id="khelafOptions-${index}" currentActiveIndex="-1">
                        <!-- Options will be dynamically populated -->
                    </ul>
                </div>
            </div>

            <!-- Text Input -->
            <div class="text-input-wrapper">
                <input type="text" id="wordInput-${index}" class="text-input" placeholder="الكلمة (اختياري)" maxlength="100" autocomplete="off" onkeydown="handleInput(this, event)">
            </div>


        <!-- khelaf control Button -->
        <div class="khelaf-controls-wrapper">

            <button class="khelaf-control" id="delete-khelaf-button" title="حذف الخلاف" onclick="deleteElementContainer(${index})">
                <i class="fa fa-trash-alt"></i>
            </button>
            
            <button class="khelaf-control" id="add-before-button" title="إضافة خلاف قبله" onclick="addBabBeforeAfter(${index}, -1)">
                  <i class="fa fa-angle-right small-arrow"></i>  <i class="fa fa-plus-circle"></i> 
            </button>
            <button class="khelaf-control" id="add-after-button" title="إضافة خلاف بعده" onclick="addBabBeforeAfter(${index}, 1)">
                 <i class="fa fa-plus-circle"></i> <i class="fa fa-angle-left small-arrow"></i>
            </button>

            <button class="khelaf-control" id="move-right-button-${index}" title="تحريك لليمين" onclick="swapColumn(${index}, -1)">
                <i class="fa fa-arrow-right"></i>
            </button>

            <button class="khelaf-control" id="move-left-button-${index}" title="تحريك لليسار" onclick="swapColumn(${index}, 1)">
                <i class="fa fa-arrow-left"></i>
            </button>

             <button class="khelaf-control" id="reset-khelaf-button" title="إعادة الضبط" onclick="resetBabContainer(${index})">
                <i class="fa fa-undo"></i>
            </button>

            <button class="khelaf-control" id="delete-khelaf-button" title="إلغاء التعديلات" onclick="keepOldBabContainer(${index})">
                <i class="fa fa-times"></i>
            </button>

            <button class="khelaf-control" id="check-khelaf-button-${index}" title="حفظ التعديلات" onclick="saveBabContainer(${index})">
                <i class="fa fa-check"></i>
            </button>

        </div>

    </div>




    `;
    container.appendChild(newContainer);
    inactivateKhelafDropdown(index);
    fetchBabs(index);


        // Wait for the container to render, then update its position
    requestAnimationFrame(() => {
        const tableIndex = khelafatArray.findIndex(item => item.khelafCounter === index);
        const tableHeader = document.getElementById('table-header');
        if (tableHeader && tableHeader.children[tableIndex]) {
            const headerRect = tableHeader.getBoundingClientRect();
            const scrollOffsetY = window.scrollY;

            // Position the container relative to the header
            newContainer.style.position = 'absolute';
            newContainer.style.top = `${headerRect.top + scrollOffsetY - newContainer.offsetHeight - 10}px`; // Adjust top as needed
            newContainer.style.right = `${window.innerWidth - headerRect.right}px`;
            newContainer.style.opacity = "0"; // Make visible
        }
    });
}

// Function to handle input event and show error if length exceeds 100
function handleInput(input, event) {
    if (input.value.length >= 100 && event.key !== "Backspace" && event.key !== "Delete") {
        showError(input);
    }
}

// function updateContainerPosition() {
//     if (visibleContainer && currentHeaderIndex !== -1) {
//         const clickedHeader = tableHeader.children[currentHeaderIndex];
//         const headerRect = clickedHeader.getBoundingClientRect();
//         const scrollOffsetY = window.scrollY;

//         // Position the container above the clicked table column, considering the scroll offset
//         visibleContainer.style.position = 'absolute';
//         visibleContainer.style.top = `${headerRect.top + scrollOffsetY - visibleContainer.offsetHeight - 10}px`; // 10px margin
//         visibleContainer.style.right = `${window.innerWidth - headerRect.right}px`; // Align to the right side of the column

//         // Check if the container is outside the viewport (on the left side)
//         const containerWidth = visibleContainer.offsetWidth;
//         if (parseFloat(visibleContainer.style.right) + containerWidth > window.innerWidth) {
//             const adjustment = (parseFloat(visibleContainer.style.right) + containerWidth) - window.innerWidth;
//             visibleContainer.style.right = `${parseFloat(visibleContainer.style.right) - adjustment - 10}px`; // Shift left if overflow
//         }
//     }
// }



// Function to delete a Bab container by index
function deleteBabContainer(index) {
    // Locate the container by its ID
    const container = document.getElementById(`bab-container-${index}`);
    
    if (container) {
        // Remove the container from its parent
        container.remove();
    } else {
        console.warn(`Container with index ${index} not found.`);
    }
}

function setupBabContainerToggle() {
    const tableHeader = document.getElementById('table-header');
    let visibleContainer = null; // Track currently visible container
    let currentHeaderIndex = -1; // Track the currently clicked header index

    // Function to update the position of the bab-container
    function updateContainerPosition() {
        if (visibleContainer && currentHeaderIndex !== -1) {
            const clickedHeader = tableHeader.children[currentHeaderIndex];
            const headerRect = clickedHeader.getBoundingClientRect();
            const scrollOffsetY = window.scrollY;
    
            // Position the container above the clicked table column, considering the scroll offset
            visibleContainer.style.position = 'absolute';
            visibleContainer.style.top = `${headerRect.top + scrollOffsetY - visibleContainer.offsetHeight - 10}px`; // 10px margin
            visibleContainer.style.right = `${window.innerWidth - headerRect.right}px`; // Align to the right side of the column
    
            // Check if the container is outside the viewport (on the left side)
            const containerWidth = visibleContainer.offsetWidth;
            if (parseFloat(visibleContainer.style.right) + containerWidth > window.innerWidth) {
                const adjustment = (parseFloat(visibleContainer.style.right) + containerWidth) - window.innerWidth;
                visibleContainer.style.right = `${parseFloat(visibleContainer.style.right) - adjustment - 10}px`; // Shift left if overflow
            }
        }
    }


    // Show bab-container on specific header click
    tableHeader.addEventListener('click', (event) => {
        const clickedIndex = Array.from(tableHeader.children).indexOf(event.target);
        const khelafCounter = khelafatArray[clickedIndex]?.khelafCounter;

        if (khelafCounter !== undefined) {
            const targetContainer = document.getElementById(`bab-container-${khelafCounter}`);
            if (targetContainer) {
                // Hide previously visible container
                visibleContainer = Array.from(document.querySelectorAll('[id^="bab-container-"]'))
                .find(container => container.style.opacity === '1');

                if (visibleContainer && visibleContainer !== targetContainer) {
                    visibleContainer.style.opacity = 0;
                    visibleContainer.style.pointerEvents = 'none';


                        // const wordInput = document.getElementById(`wordInput-${khelafCounter}`);
                        // const babDropdown = document.getElementById(`babDropdown-${khelafCounter}`);
                        // const khelafDropdown = document.getElementById(`khelafDropdown-${khelafCounter}`);
                    
                        // if ((babDropdown?.value !== '' && babDropdown?.value !== null) &&
                        //     (khelafDropdown?.value !== '' && khelafDropdown?.value !== null)) {
        
                        //     console.log('Dropdown values:', {
                        //         babValue: babDropdown.value,
                        //         khelafValue: khelafDropdown.value,
                        //     });
        
                        //     let OldkhelafID = khelafatArray[clickedIndex].khelafID;
        
                        //     khelafatArray[clickedIndex].BabName = babDropdown.value;
                        //     khelafatArray[clickedIndex].BabID = babDropdown.getAttribute('selected-bab-ID');
                        //     khelafatArray[clickedIndex].khelafID = khelafDropdown.getAttribute('selected-khelaf-ID');
                        //     khelafatArray[clickedIndex].KhelafAName = khelafDropdown.value;
                        //     khelafatArray[clickedIndex].KhelafEName = khelafDropdown.getAttribute('selected-khelaf-Ename');
        
                        //     if (wordInput?.value !== null && wordInput?.value !== '') {
                        //         khelafatArray[clickedIndex].word = wordInput.value;
                        //     } else {
                        //         khelafatArray[clickedIndex].word = khelafDropdown.value;
                        //     }
        
                        //     console.log(`Updated khelafatArray at index ${clickedIndex}:`, khelafatArray[clickedIndex]);
        
                        //     if (OldkhelafID !== khelafatArray[clickedIndex].khelafID) {
                        //         handleTableData();
                        //     } else {
                        //         const tableHeader = document.getElementById('table-header');
                        //         if (tableHeader && tableHeader.children[clickedIndex]) {
                        //             tableHeader.children[clickedIndex].textContent = khelafatArray[clickedIndex].word;
                        //             displayShwahed();

                        //         }
                                
                        //     }
                        // }
                    

                    
                }

                // Show the clicked container
                targetContainer.style.opacity = 1;
                targetContainer.style.pointerEvents = 'auto';
                visibleContainer = targetContainer; // Update the currently visible container
                currentHeaderIndex = clickedIndex; // Update the current header index

                // Position the container initially
                updateContainerPosition();
            }
        }
    });

    // Hide bab-container on check button click or outside click
    document.addEventListener('click', (event) => {
        const isInsideContainer = visibleContainer?.contains(event.target);
        const isTableHeader = event.target.closest('#table-header');
    
        if (!isInsideContainer && !isTableHeader) {
            if (visibleContainer) {
                 //console.log('Visible container:', visibleContainer);
                 //console.log('Container ID:', visibleContainer.id);
    
                const idMatch = visibleContainer.id.match(/^bab-container-(\d+)$/);
                const khelafCounter = idMatch ? Number(idMatch[1]) : null;
                 //console.log('Extracted khelafCounter:', khelafCounter, typeof khelafCounter);
    
                if (khelafCounter === null) {
                    console.error('Failed to extract khelafCounter.');
                    return;
                }
    
                    
                // const isTableHeader = event.target.closest('#table-header');
                // if (isTableHeader){
                //     const clickedIndex = Array.from(isTableHeader.children).indexOf(event.target);
                //     const khelafCounterArray = khelafatArray[clickedIndex]?.khelafCounter;

                //     if (khelafCounterArray === khelafCounter) {
                //         console.error('here.');
                //         return;
                //     }
                // }

                visibleContainer.style.opacity = 0;
                visibleContainer.style.pointerEvents = 'none';
                visibleContainer = null;
                currentHeaderIndex = -1;
    
                // console.log('khelafatArray:', JSON.stringify(khelafatArray, null, 2));
                // khelafatArray.forEach((item, i) => {
                //     console.log(`Item ${i}: khelafCounter = ${item.khelafCounter}, type = ${typeof item.khelafCounter}`);
                // });
    
                const index = khelafatArray.findIndex(item => {
                    //console.log(`Comparing ${item.khelafCounter} (type ${typeof item.khelafCounter}) with ${khelafCounter} (type ${typeof khelafCounter})`);
                    return item.khelafCounter === khelafCounter;
                });
    
                 //console.log('Index in khelafatArray:', index);
    
                if (index === -1) {
                    console.error(`No item found with khelafCounter = ${khelafCounter}`);
                    return;
                }
    
                 //console.log(`Item found at index ${index}:`, khelafatArray[index]);
    
                if (index !== -1) {
                    const wordInput = document.getElementById(`wordInput-${khelafCounter}`);
                    const babDropdown = document.getElementById(`babDropdown-${khelafCounter}`);
                    const khelafDropdown = document.getElementById(`khelafDropdown-${khelafCounter}`);
                
                    if ((babDropdown?.value !== '' && babDropdown?.value !== null) &&
                        (khelafDropdown?.value !== '' && khelafDropdown?.value !== null)) {
    
                        // console.log('Dropdown values:', {
                        //     babValue: babDropdown.value,
                        //     khelafValue: khelafDropdown.value,
                        // });
    
                        let OldkhelafID = khelafatArray[index].khelafID;
    
                        khelafatArray[index].BabName = babDropdown.value;
                        khelafatArray[index].BabID = babDropdown.getAttribute('selected-bab-ID');
                        khelafatArray[index].khelafID = khelafDropdown.getAttribute('selected-khelaf-ID');
                        khelafatArray[index].KhelafAName = khelafDropdown.value;
                        khelafatArray[index].KhelafEName = khelafDropdown.getAttribute('selected-khelaf-Ename');
    
                        if (wordInput?.value !== null && wordInput?.value !== '') {
                            khelafatArray[index].word = wordInput.value;
                        } else {
                            khelafatArray[index].word = khelafDropdown.value;
                        }
    
                         //console.log(`Updated khelafatArray at index ${index}:`, khelafatArray[index]);
    
                        if (OldkhelafID !== khelafatArray[index].khelafID) {
                            handleTableData();
                        } else {
                            const tableHeader = document.getElementById('table-header');
                            if (tableHeader && tableHeader.children[index]) {
                                tableHeader.children[index].textContent = khelafatArray[index].word;
                                displayShwahed();

                            }
                            
                        }
                    }
                }
            }
        }
    });
    

 


    // Update the position of the container when the window is resized
    window.addEventListener('resize', () => {
        updateContainerPosition();
    });
}


//<i class="fa fa-exclamation-circle"></i>
// <i class="fa fa-trash-alt"></i>


// ---------------------------------------------------------------------------

let cachedBabs = null;

async function fetchBabs(index) {
    if (cachedBabs) {
        populateBabDropdown(cachedBabs, index);
        return;
    }

    try {
        const response = await fetch('/getBab/');
        if (!response.ok) {
            throw new Error('Failed to fetch Babs');
        }
        cachedBabs = await response.json(); // Cache the data
        populateBabDropdown(cachedBabs, index);
    } catch (error) {
        console.error('Error:', error);
    }
}


function populateBabDropdown(Babs, index) {
    const dropdownOptions = document.getElementById(`babOptions-${index}`);
    dropdownOptions.innerHTML = ''; // Clear existing options

    if (Babs.length > 0) {
        Babs.forEach(Bab => {
            const listItem = document.createElement('li');
            listItem.setAttribute('data-value', Bab.BabID);
            listItem.setAttribute('bab-name', Bab.BabName); // Correct attribute for Bab
            listItem.textContent = Bab.BabName;

            // Add event handlers
            listItem.onclick = () => selectBab(
                document.getElementById(`babDropdown-${index}`),
                dropdownOptions
            );
            listItem.onmouseover = () => updateActiveIndex(
                listItem,
                dropdownOptions
            );

            dropdownOptions.appendChild(listItem);
        });
    } else {
        dropdownOptions.innerHTML = '<li>لا توجد أبواب متاحة</li>';
    }
}



let cachedKhelafs = {};

async function fetchKhelafs(index) {
    const babID = document.getElementById(`babDropdown-${index}`).getAttribute('selected-bab-ID');
    if (!babID) {
        console.error("No Bab selected for Khelaf");
        return;
    }

    if (cachedKhelafs[babID]) {
        populateKhelafDropdown(cachedKhelafs[babID], index);
        return;
    }

    try {
        const response = await fetch(`/getKhelaf/${babID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Khelafs');
        }
        const khelafList = await response.json();
        cachedKhelafs[babID] = khelafList; // Cache Khelaf data by Bab ID
        populateKhelafDropdown(khelafList, index);
    } catch (error) {
        console.error('Error:', error);
    }
}


function populateKhelafDropdown(Khelafs, index) {
    const dropdownOptions = document.getElementById(`khelafOptions-${index}`);
    dropdownOptions.innerHTML = ''; // Clear existing options

    if (Khelafs.length > 0) {
        Khelafs.forEach(Khelaf => {
             //console.log(Khelaf);
            const listItem = document.createElement('li');
            listItem.setAttribute('data-value', Khelaf.KhelafID);
            listItem.setAttribute('khelaf-name', Khelaf.KhelafAName);
            listItem.setAttribute('khelaf-E-name', Khelaf.KhelafEName);

            listItem.textContent = Khelaf.KhelafAName;

            // Add event handlers
            listItem.onclick = () => selectKhelaf(
                document.getElementById(`khelafDropdown-${index}`),
                dropdownOptions
            );
            listItem.onmouseover = () => updateActiveIndex(
                listItem,
                dropdownOptions
            );

            dropdownOptions.appendChild(listItem);
        });
    } else {
        //inactivateKhelafDropdown(index);

        //dropdownOptions.innerHTML = '<li>لا توجد خلافات متاحة</li>';
    }
}

// ---------------------------------------------------------------------------





// Show/hide dropdown menu on arrow click
function toggleBabKhelafDropdown(dropdownMenu, dropdownOptions) {


    if (dropdownMenu.id.startsWith(`khelafDropdown-`)){
        if (dropdownMenu.classList.contains('inactive')){
            let babDropdownMenu = document.getElementById(`babDropdown-${dropdownMenu.getAttribute('index')}`);
            showError(babDropdownMenu);
            //showError(dropdownMenu);
            return;
        }
    }

    const options = Array.from(dropdownMenu.querySelectorAll('li'));

    // Reset filter: make all options visible
    options.forEach(option => {
        option.style.display = ''; // Show all options
    });

    // Toggle the dropdown display
    if (dropdownOptions.style.display === 'block') {

        if (dropdownMenu.id.startsWith(`khelafDropdown-`)){
            filterKhelafOptions(dropdownMenu, dropdownOptions);
            dropdownOptions.style.display = 'none';
            handleKhelafInputSelection(dropdownMenu, dropdownOptions); // Reuse shared logic
        } else {
            filterBabOptions(dropdownMenu, dropdownOptions);
            dropdownOptions.style.display = 'none';
            handleBabInputSelection(dropdownMenu, dropdownOptions); // Reuse shared logic
        }


    } else {
        const options = Array.from(dropdownOptions.querySelectorAll('li'));
        options.forEach(option => (option.style.display = '')); // Reset all options to visible
        dropdownOptions.style.display = 'block';
    }
}

// Filter options based on user input
function filterBabOptions(dropdownMenu, dropdownOptions) {
    const filter = dropdownMenu.value.toLowerCase();
    const options = dropdownOptions.querySelectorAll('li');
    let hasVisibleOptions = false; // Track if there are any visible options
    dropdownOptions.setAttribute('currentActiveIndex', -1);

    options.forEach(option => {
        const text = option.getAttribute('bab-name') || option.innerText;
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
async function selectBab(dropdownMenu, dropdownOptions) {
    const activeOption = dropdownOptions.querySelector('li.active');

    if (activeOption) {
        if (dropdownMenu.value !== activeOption.getAttribute('bab-name')){
            const khelafInput = document.getElementById(`khelafDropdown-${dropdownMenu.getAttribute('index')}`);
            khelafInput.value = ''; // Clear the input value
            khelafInput.setAttribute('selected-khelaf-ID', ''); // Reset selected ID
            khelafInput.setAttribute('selected-khelaf-Ename', '');
        }


        dropdownMenu.value = activeOption.getAttribute('bab-name');
        dropdownMenu.setAttribute('selected-bab-ID', activeOption.getAttribute('data-value'));
        //document.querySelector(`#khelafInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-bab', activeOption.getAttribute('data-value'));
    
        dropdownOptions.style.display = 'none'; // Hide dropdown

        // Update any other dependent logic for Bab
        await activateKhelafDropdown(dropdownMenu.getAttribute('index'), dropdownMenu.getAttribute('selected-bab-ID'));
         //console.log(dropdownMenu.getAttribute('index'), " --------: Selected Bab ID:", dropdownMenu.getAttribute('selected-bab-ID'));
         //console.log(dropdownMenu.getAttribute('index'), " --------: Bab name dropdown:", dropdownMenu.value);
    }
    return;
}

// Function to handle input selection and validation
async function handleBabInputSelection(dropdownMenu, dropdownOptions) {
    const visibleOptions = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );

    if (dropdownMenu.classList.contains('error-border')) {
        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-bab-ID', null);
        //document.querySelector(`#khelafInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-bab', '');

        dropdownMenu.classList.remove('error-border');
        inactivateKhelafDropdown(dropdownMenu.getAttribute('index'));
    } else if (visibleOptions.length > 0 && dropdownMenu.value.trim() !== '') {
        const matchingOption = visibleOptions.find(
            option => option.getAttribute('bab-name') === dropdownMenu.value.trim()
        );

         //console.log("heeeeeeeeeeeeeeeeeeeeeeeeereeeeeeeeeeeeeeeeeee", matchingOption);
        if (matchingOption) {
            dropdownOptions.querySelectorAll('li.active').forEach(option => option.classList.remove('active'));
            matchingOption.classList.add('active');
            await selectBab(dropdownMenu, dropdownOptions);
        } else {
            visibleOptions[0].classList.add('active');
            selectBab(dropdownMenu, dropdownOptions);
        }
    } else {
        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-bab-ID', null);
        //document.querySelector(`#khelafInput-${dropdownMenu.getAttribute('index')}`).setAttribute('selected-bab', '');

        const allOptions = Array.from(dropdownOptions.querySelectorAll('li'));
        allOptions.forEach(option => (option.style.display = ''));
        if (dropdownMenu.id.startsWith(`babDropdown-`)){
            inactivateKhelafDropdown(dropdownMenu.getAttribute('index'));
        }
    }

     //console.log(dropdownMenu.getAttribute('index'), " *********: Selected Bab ID:", dropdownMenu.getAttribute('selected-bab-ID'));
     //console.log(dropdownMenu.getAttribute('index'), " *********: Bab name dropdown:", dropdownMenu.value);
}



// Function to handle input selection and validation for Khelaf
async function handleKhelafInputSelection(dropdownMenu, dropdownOptions) {
    const visibleOptions = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );

    if (dropdownMenu.classList.contains('error-border')) {
        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-khelaf-ID', null);
        dropdownMenu.setAttribute('selected-khelaf-Ename', null);
        dropdownMenu.classList.remove('error-border');
    } else if (visibleOptions.length > 0 && dropdownMenu.value.trim() !== '') {
        const matchingOption = visibleOptions.find(
            option => option.getAttribute('khelaf-name') === dropdownMenu.value.trim()
        );

        if (matchingOption) {
            dropdownOptions.querySelectorAll('li.active').forEach(option => option.classList.remove('active'));
            matchingOption.classList.add('active');
            selectKhelaf(dropdownMenu, dropdownOptions);
        } else {
            visibleOptions[0].classList.add('active');
            selectKhelaf(dropdownMenu, dropdownOptions);
        }





    } else {
        dropdownMenu.value = '';
        dropdownMenu.setAttribute('selected-khelaf-ID', null);
        dropdownMenu.setAttribute('selected-khelaf-Ename', null);
        
        const allOptions = Array.from(dropdownOptions.querySelectorAll('li'));
        allOptions.forEach(option => (option.style.display = ''));
    }

     //console.log("Selected Khelaf ID:", dropdownMenu.getAttribute('selected-khelaf-ID'));
     //console.log("Khelaf dropdown value:", dropdownMenu.value);
}




document.querySelectorAll('.bab-dropdown-menu').forEach(babDropdownOptions => {
    babDropdownOptions.querySelectorAll('li').forEach(option => {
        option.addEventListener('mouseenter', () => updateActiveIndex(option, babDropdownOptions)); // Mouse enters
    });
    babDropdownOptions.addEventListener('mouseleave', () => resetActiveIndex(babDropdownOptions)); // Mouse leaves
});





// Handle keyboard navigation for Bab dropdown
function handleBabDropdownKeyboard(event, dropdownMenu, dropdownOptions) {
    const options = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );

    // Get and initialize currentActiveIndex
    let currentActiveIndex = parseInt(dropdownOptions.getAttribute('currentActiveIndex'), 10);
    if (isNaN(currentActiveIndex)) {
        currentActiveIndex = -1; // No active option initially
    }

    if (event.key === 'ArrowDown') {
        // Navigate down
        event.preventDefault();
        if (currentActiveIndex < options.length - 1) {
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
            selectBab(dropdownMenu, dropdownOptions);
        }
    }

    // // Update active state
    // options.forEach((option, index) => {
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
    const dropdownWrappers = document.querySelectorAll('.bab-dropdown-wrapper');

    dropdownWrappers.forEach(wrapper => {
        const dropdownMenu = wrapper.querySelector('.dropdown-input'); // The input field
        const dropdownOptions = wrapper.querySelector('.dropdown-menu'); // The dropdown menu

        if (!wrapper.contains(event.target) && getComputedStyle(dropdownOptions).display !== 'none') {
            handleBabInputSelection(dropdownMenu, dropdownOptions);

            const options = Array.from(dropdownOptions.querySelectorAll('li'));
            options.forEach(option => (option.style.display = ''));

            if (dropdownOptions) {
                dropdownOptions.style.display = 'none';
            }
        }
    });


    // Handle Khelaf dropdowns
    const khelafDropdownWrappers = document.querySelectorAll('.khelaf-dropdown-wrapper');
    khelafDropdownWrappers.forEach(wrapper => {
        const dropdownMenu = wrapper.querySelector('.dropdown-input'); // The input field
        const dropdownOptions = wrapper.querySelector('.dropdown-menu'); // The dropdown menu

        if (!wrapper.contains(event.target) && getComputedStyle(dropdownOptions).display !== 'none') {
            handleKhelafInputSelection(dropdownMenu, dropdownOptions);

            const options = Array.from(dropdownOptions.querySelectorAll('li'));
            options.forEach(option => (option.style.display = ''));

            if (dropdownOptions) {
                dropdownOptions.style.display = 'none';
            }
        }
    });

});



//--------------------------------------------------------------



function filterKhelafOptions(dropdownMenu, dropdownOptions) {
    const filter = dropdownMenu.value.toLowerCase();
    const options = dropdownOptions.querySelectorAll('li');
    let hasVisibleOptions = false;
    dropdownOptions.setAttribute('currentActiveIndex', -1);

    options.forEach(option => {
        const text = option.getAttribute('khelaf-name') || option.innerText;
        if (text.toLowerCase().includes(filter)) {
            option.style.display = ''; // Show matching options
            hasVisibleOptions = true;
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




function selectKhelaf(dropdownMenu, dropdownOptions) {
    const activeOption = dropdownOptions.querySelector('li.active');
    if (activeOption) {
        dropdownMenu.value = activeOption.getAttribute('khelaf-name');
        dropdownMenu.setAttribute('selected-khelaf-ID', activeOption.getAttribute('data-value'));
        dropdownMenu.setAttribute('selected-khelaf-Ename', activeOption.getAttribute('khelaf-E-name'));

        dropdownOptions.style.display = 'none'; // Hide dropdown

    }
}





function handleKhelafDropdownKeyboard(event, dropdownMenu, dropdownOptions) {
    const options = Array.from(dropdownOptions.querySelectorAll('li')).filter(
        option => option.style.display !== 'none'
    );

    let currentActiveIndex = parseInt(dropdownOptions.getAttribute('currentActiveIndex'), 10);
    if (isNaN(currentActiveIndex)) {
        currentActiveIndex = -1;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentActiveIndex < options.length - 1) {
            currentActiveIndex++;
            dropdownOptions.setAttribute('currentActiveIndex', currentActiveIndex);
        }
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentActiveIndex > 0) {
            currentActiveIndex--;
            dropdownOptions.setAttribute('currentActiveIndex', currentActiveIndex);
        }
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (currentActiveIndex >= 0) {
            selectKhelaf(dropdownMenu, dropdownOptions);
        }
    }




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



document.querySelectorAll('.khelaf-dropdown-menu').forEach(khelafDropdownOptions => {
    khelafDropdownOptions.querySelectorAll('li').forEach(option => {
        option.addEventListener('mouseenter', () => updateActiveIndex(option, khelafDropdownOptions));
    });
    khelafDropdownOptions.addEventListener('mouseleave', () => resetActiveIndex(khelafDropdownOptions));
});


async function activateKhelafDropdown(index, babID) {
    const khelafInput = document.getElementById(`khelafDropdown-${index}`);
    const khelafOptions = document.getElementById(`khelafOptions-${index}`);

    if (!babID) {
        console.error('Bab ID is required to activate the Khelaf dropdown.');
        return;
    }

    khelafInput.disabled = false; // Enable the input
    khelafInput.classList.remove('inactive'); // Remove inactive styling


    // Fetch Khelaf options for the selected Bab
    await fetchKhelafs(index);
    return;
}


async function inactivateKhelafDropdown(index) {
    const khelafInput = document.getElementById(`khelafDropdown-${index}`);
    const khelafOptions = document.getElementById(`khelafOptions-${index}`);

    // Disable the input
    khelafInput.disabled = true;
    khelafInput.value = ''; // Clear the input value
    khelafInput.setAttribute('selected-khelaf-ID', ''); // Reset selected ID
    khelafInput.setAttribute('selected-khelaf-Ename', '');
    khelafInput.classList.add('inactive'); // Add inactive styling

    // Clear the dropdown menu
    //khelafOptions.innerHTML = '<li>No Khelaf available</li>';
    khelafOptions.innerHTML = '';
}





// --------------------------------------------------------

// Function to remove Bab container
function deleteElementContainer(khelafCounter) {
    let Index = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);
    if (khelafatArray.length === 1){
        increment(document.getElementById("numberInput1"), 1, 50);
    }
    
    decrement(document.getElementById("numberInput1"), 1, 50, Index);
    // if (khelafatArray.length > 1){
    //     decrement(document.getElementById("numberInput1"), 1, 50, khelafCounter);
    // } else {
    //      let index = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);
    //      resetElementAttribute(index);
    //      resetBabContainer(khelafCounter);
    //      handleTableData();        
    // }
}


// Reset Bab container
function resetBabContainer(khelafCounter) {

    let Index = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);
    increment(document.getElementById("numberInput1"), 1, 50, Index);
    decrement(document.getElementById("numberInput1"), 1, 50, Index);


    // const babDropdown = document.getElementById(`babDropdown-${index}`);
    // const khelafDropdown = document.getElementById(`khelafDropdown-${index}`);
    // const commentInput = document.getElementById(`wordInput-${index}`);

    // babDropdown.value = "";
    // khelafDropdown.value = "";
    // khelafDropdown.classList.add("inactive");
    // khelafDropdown.disabled = true;
    // commentInput.value = "";
}




async function saveBabContainer(khelafCounter) {

    // Dynamically construct the element IDs
    const wordInput = document.getElementById(`wordInput-${khelafCounter}`);
    const babDropdown = document.getElementById(`babDropdown-${khelafCounter}`);
    const khelafDropdown = document.getElementById(`khelafDropdown-${khelafCounter}`);

    if (!wordInput || !babDropdown || !khelafDropdown) {
        console.error(`One or more elements with the required IDs not found for index ${index}`);
        return;
    }




    const index = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);

    if (index === -1) {
        console.error(`No item found with khelafCounter = ${khelafCounter}`);
        return;
    }



    // if (babDropdown.value !== '' && babDropdown.value !== null) {
    //     showError(document.getElementById(`check-khelaf-button-${khelafCounter}`));
    //     showError(babDropdown);
    //     return;
    // }
    if ((babDropdown.value !== '' && babDropdown.value !== null) && (khelafDropdown.value === '' || khelafDropdown.value === null)) {
        showError(document.getElementById(`check-khelaf-button-${khelafCounter}`));
        showError(khelafDropdown);
        return;
    }

    let OldkhelafID = khelafatArray[index].khelafID;

    khelafatArray[index].BabName = babDropdown.value;
    khelafatArray[index].BabID = babDropdown.getAttribute('selected-bab-ID');
    khelafatArray[index].khelafID = khelafDropdown.getAttribute('selected-khelaf-ID');
    khelafatArray[index].KhelafAName = khelafDropdown.value;
    khelafatArray[index].KhelafEName = khelafDropdown.getAttribute('selected-khelaf-Ename');

    if (wordInput.value !== null && wordInput.value !==''){
        khelafatArray[index].word = wordInput.value;
    } else {
        khelafatArray[index].word = khelafDropdown.value;
    }


    // Log the updated values
     //console.log(`Updated khelafatArray at index ${index}:`, khelafatArray[index]);


    if (OldkhelafID !== khelafatArray[index].khelafID){
        await handleTableData();
    } else {
        // Update the table header content
        const tableHeader = document.getElementById('table-header');
        if (tableHeader && tableHeader.children[index]) {
            tableHeader.children[index].textContent = khelafatArray[index].word;
            displayShwahed();
        }
    }
    hideContainer(khelafCounter);

}




// -----------------------------------------------------------------------------------------


// Add Before Button Functionality
function addBabBeforeAfter(khelafCounter, beforAfter) {

    let columnIndex = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);

    if (beforAfter < 0) {
        increment(document.getElementById("numberInput1"), 1, 50, columnIndex-1);
    
    } else {
        increment(document.getElementById("numberInput1"), 1, 50, columnIndex);
    }
    addSpecialClassToMatchingCells();
    hideContainer(khelafCounter);
}

// Delete Button Functionality
function deleteContainer(index) {
     //console.log("Delete Clicked for Index: " + index);
}


async function keepOldBabContainer(khelafCounter){
    let index = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);
    const babDropdown = document.getElementById(`babDropdown-${khelafCounter}`);
    const babOptions = document.getElementById(`babOptions-${khelafCounter}`);
    babDropdown.value = khelafatArray[index].BabName;
    await handleBabInputSelection(babDropdown, babOptions);



    const khelafDropdown = document.getElementById(`khelafDropdown-${khelafCounter}`);
    const khelafOptions = document.getElementById(`khelafOptions-${khelafCounter}`);
    khelafDropdown.value = khelafatArray[index].KhelafAName;
    await handleKhelafInputSelection(khelafDropdown, khelafOptions);

    const wordInput = document.getElementById(`wordInput-${khelafCounter}`);
    if(khelafatArray[index].word !== khelafatArray[index].KhelafAName){
        wordInput.value = khelafatArray[index].word;
    } else {
        wordInput.value = '';
    }
    hideContainer(khelafCounter);
}






function hideContainer(khelafCounter) {
    const targetContainer = document.getElementById(`bab-container-${khelafCounter}`);
    targetContainer.style.opacity = 0;
    targetContainer.style.pointerEvents = 'none';
}



async function swapColumn (khelafCounter, direction){
    let fromIndex = khelafatArray.findIndex(item => item.khelafCounter === khelafCounter);
    let toIndex = fromIndex + direction;
    if (
        fromIndex >= 0 &&
        fromIndex < khelafatArray.length &&
        toIndex >= 0 && // Ensure `toIndex` is within valid bounds
        toIndex < khelafatArray.length &&
        fromIndex !== toIndex
    ) {
        const element = khelafatArray.splice(fromIndex, 1)[0];
        khelafatArray.splice(toIndex, 0, element); // Fixed the insertion index
        handleTableData();

        
    } else {
        if (direction > 0) {
            showError(document.getElementById(`move-left-button-${khelafCounter}`));
        } else {
            showError(document.getElementById(`move-right-button-${khelafCounter}`));
        }

    }
}


// -----------------------------------------------------------------------------------------

document.getElementById('zoomIn').addEventListener('click', () => {
    const currentFontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size'));
    const currentFontSizeTh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size-th'));
    if (currentFontSize < 50) {
        document.documentElement.style.setProperty('--font-size', `${currentFontSize + 1}px`);
        document.documentElement.style.setProperty('--font-size-th', `${currentFontSizeTh + 1}px`);
        document.documentElement.style.setProperty('--font-size-special', `${currentFontSizeTh + 1}px`);
    }
});

document.getElementById('zoomOut').addEventListener('click', () => {
    const currentFontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size'));
    const currentFontSizeTh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size-th'));

    if (currentFontSize > 8) {
        document.documentElement.style.setProperty('--font-size', `${currentFontSize - 1}px`);
        document.documentElement.style.setProperty('--font-size-th', `${currentFontSizeTh - 1}px`);
        document.documentElement.style.setProperty('--font-size-special', `${currentFontSizeTh - 1}px`);
    }
});









// -----------------------------------------------------------------------------------------


/*

// Function to dynamically update the table based on khelafatArray
async function initTable() {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    // Clear previous table content
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    // Populate table header
    khelafatArray.forEach((item, index) => {
        const th = document.createElement('th');

        if (item.khelafID === null) {
            th.textContent = 'قم بإضافة الخلاف';
            th.classList.add('empty-column');
        } else {
            th.textContent = item.word || item.KhelafAName || 'Unnamed';
            th.classList.remove('empty-column');
        }

        tableHeader.appendChild(th);
    });

    // Populate table body (one row with placeholder cells for simplicity)
    const row = document.createElement('tr');
    khelafatArray.forEach(() => {
        const td = document.createElement('td');
        td.textContent = '-'; // Placeholder content
        row.appendChild(td);
    });
    tableBody.appendChild(row);
}



// Initialize with a default 2x2 table
document.addEventListener('DOMContentLoaded', async () => {
    await initTable();
});

*/