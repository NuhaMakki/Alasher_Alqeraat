
function showPopup(data) {
    const popupContent = document.getElementById('popupContent');
    popupContent.innerHTML = formatDataForPopup(data);
    document.getElementById('dataPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('dataPopup').style.display = 'none';
}

function formatDataForPopup(data) {
    let html = '<ul>';
    for (const qarieID in data) {
        const qarie = data[qarieID];
        html += `<li class='qarie'>${qarie.QarieName}<ul>`;
        for (const rawyID in qarie.Rawies) {
            const rawy = qarie.Rawies[rawyID];
            html += `<li class='rawy'>${rawy.RawyName}<ul>`;
            for (const tareeq1ID in rawy.Tareeq1s) {
                const tareeq1 = rawy.Tareeq1s[tareeq1ID];
                html += `<li class='tareeq1'>${tareeq1.Tareeq1Name}<ul>`;
                for (const tareeq2ID in tareeq1.Tareeq2s) {
                    const tareeq2 = tareeq1.Tareeq2s[tareeq2ID];
                    if (tareeq2.Tareeq2Name === tareeq1.Tareeq1Name) {
                        tareeq2.Books.forEach(book => {
                            html += `<li class='book booknoTareeq2'>${book.BookName}</li>`;
                        });
                    } else {
                        html += `<li class='tareeq2'>${tareeq2.Tareeq2Name}<ul>`;
                        tareeq2.Books.forEach(book => {
                            html += `<li class='book'>${book.BookName}</li>`;
                        });
                        html += '</ul></li>';
                    }
                }
                html += '</ul></li>';
            }
            html += '</ul></li>';
        }
        html += '</ul></li>';
    }
    html += '</ul>';
    return html;
}




async function fetchRwahByColID(ColIDs) {
    try {
         //console.log("Sending ColIDs to server:", ColIDs);

        const response = await fetch('/getRwahByColID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ColIDs }), // Pass IDs in the body
        });

        if (!response.ok) throw new Error("Failed to fetch Rwah data");
        const rwahData = await response.json();
         //console.log("Fetched Rwah Data:", rwahData);
        return rwahData;
    } catch (error) {
        console.error("Error fetching Rwah Data:", error);
        return null;
    }
}


async function showTareeqDet(ColIDs) {
    let rwahColIDsList = await fetchRwahByColID(ColIDs);

    if (rwahColIDsList === undefined){
        console.error('Error:', error);
        return;
    }

     //console.log(rwahColIDsList);
    let rwahNastedColIDsList = {};

    rwahColIDsList.forEach(row => {
        let { QarieID, QarieName, RawyID, RawyName, Tareeq1ID, Tareeq1Name, Tareeq2ID, Tareeq2Name, BookID, BookName } = row;
        if (RawyID === 13 || RawyID === 14){
            RawyID = 12;
            RawyName = "ورش";
        } 

        // Add Qarie
        if (!rwahNastedColIDsList[QarieID]) {
            rwahNastedColIDsList[QarieID] = {
                QarieID,
                QarieName,
                Rawies: {}
            };
        }

        // Add Rawy
        if (RawyID && !rwahNastedColIDsList[QarieID].Rawies[RawyID]) {
            rwahNastedColIDsList[QarieID].Rawies[RawyID] = {
                RawyID,
                RawyName,
                Tareeq1s: {}
            };
        }

        // Add Tareeq1
        if (Tareeq1ID && !rwahNastedColIDsList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID]) {
            rwahNastedColIDsList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID] = {
                Tareeq1ID,
                Tareeq1Name,
                Tareeq2s: {}
            };
        }

        // Add Tareeq2
        if (Tareeq2ID && !rwahNastedColIDsList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID]) {
            rwahNastedColIDsList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID] = {
                Tareeq2ID,
                Tareeq2Name,
                Books: []
            };
        }

        // Add Book
        if (BookID) {
            rwahNastedColIDsList[QarieID].Rawies[RawyID].Tareeq1s[Tareeq1ID].Tareeq2s[Tareeq2ID].Books.push({
                BookID,
                BookName
            });
        }
    });

    //processRwahNastedList(rwahColIDsList);
     //console.log(rwahNastedColIDsList);
    showPopup(rwahNastedColIDsList);


    return;
}



