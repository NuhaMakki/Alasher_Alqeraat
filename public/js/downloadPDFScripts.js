
async function downloadTableAsPDF() {
    const { jsPDF } = window.jspdf;

    // Select elements
    const tableElement = document.querySelector('.custom-table');
    const ayahContainer = document.querySelector('#ayahContainer');
    const shwahedElement = document.getElementById('shwahed');
    const shwahedContainer = document.querySelector('.shwahed-text-container');

    if (!tableElement) {
        console.error('Table not found');
        return;
    }

    if (!ayahContainer) {
        console.error('Ayah container not found');
        return;
    }

    try {
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const availableHeight = pageHeight - 2 * margin;

        // Render Ayah container into PDF
        const ayahCanvas = await html2canvas(ayahContainer, { scale: 2 });
        const ayahImgWidth = pageWidth - 2 * margin;
        const ayahImgHeight = (ayahCanvas.height * ayahImgWidth) / ayahCanvas.width;
        const ayahImgData = ayahCanvas.toDataURL('image/png');
        pdf.addImage(ayahImgData, 'PNG', margin, margin, ayahImgWidth, ayahImgHeight);

        let currentY = margin + ayahImgHeight + 10;

        // Render the table into the PDF
        const tableCanvas = await html2canvas(tableElement, { scale: 2 });
        const tableImgWidth = pageWidth - 2 * margin;

        let currentRow = 0;
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = tableCanvas.width;

        while (currentRow < tableCanvas.height) {
            const remainingHeight = tableCanvas.height - currentRow;
            const cropHeight = Math.min(remainingHeight, Math.floor((availableHeight * tableCanvas.width) / tableImgWidth));
            tempCanvas.height = cropHeight;

            tempContext.clearRect(0, 0, tempCanvas.width, cropHeight);
            tempContext.drawImage(
                tableCanvas,
                0,
                currentRow,
                tableCanvas.width,
                cropHeight,
                0,
                0,
                tempCanvas.width,
                cropHeight
            );

            const imgData = tempCanvas.toDataURL('image/png');
            if (currentRow === 0) {
                pdf.addImage(imgData, 'PNG', margin, currentY, tableImgWidth, (cropHeight * tableImgWidth) / tempCanvas.width);
            } else {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, margin, tableImgWidth, (cropHeight * tableImgWidth) / tempCanvas.width);
            }

            currentRow += cropHeight;
        }

        // Render shwahed-text-container in a new page if conditions are met
        if (shwahedElement && shwahedElement.classList.contains('shwahed-clicked') && getContainShwahed() === true) {
            if (shwahedContainer) {
                const shwahedCanvas = await html2canvas(shwahedContainer, { scale: 2 });
                const shwahedImgWidth = pageWidth - 2 * margin;
                const shwahedImgHeight = (shwahedCanvas.height * shwahedImgWidth) / shwahedCanvas.width;

                pdf.addPage();
                pdf.addImage(shwahedCanvas.toDataURL('image/png'), 'PNG', margin, margin, shwahedImgWidth, shwahedImgHeight);
            }
        }

        // Save the PDF
        pdf.save('Alqeraat_Alasher.pdf');
    } catch (error) {
        console.error('Failed to generate PDF', error);
    }
}






//----------------------------------------------

// async function downloadTableAsPDF() {

//     const { jsPDF } = window.jspdf;

//     const tableElement = document.querySelector('.custom-table'); // Rename this variable to avoid conflict
//     if (!tableElement) {
//         console.error('Table not found');
//         return;
//     }

//     // Initialize jsPDF with right-to-left text direction
//     const pdf = new jsPDF({
//         orientation: 'landscape',
//         unit: 'pt',
//         format: 'a4'
//     });

//     // // Function to fetch and add fonts dynamically
//     // async function loadFont(fontName, fileName) {
//     //     const fontUrl = `/fonts/${fileName}`;
//     //     const base64FontData = await fetch(fontUrl).then(res => res.text());
//     //     pdf.addFileToVFS(fontName, base64FontData);
//     //     return fontName;
//     // }

//     // // Load fonts
//     // await loadFont('Amiri-Regular.ttf', 'amiri_base64.txt');
//     // await loadFont('Amiri-Quran.ttf', 'amiri_quran_base64.txt');
//     // await loadFont('Noto-Sans-Arabic.ttf', 'noto_sans_arabic_base64.txt');

//     // // Set a default font
//     // pdf.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
//     // pdf.setFont('Amiri', 'normal');


//     // Extract table header and body
//     const tableHeader = Array.from(tableElement.querySelectorAll('thead th')).map(th => th.innerText);
//     const tableBody = Array.from(tableElement.querySelectorAll('tbody tr')).map(row =>
//         Array.from(row.querySelectorAll('td')).map(td => td.innerText)
//     );

//     // Set the autoTable options
//     const pageWidth = pdf.internal.pageSize.width;
//     const tableOptions = {
//         head: [tableHeader],
//         body: tableBody,
//         styles: {
//             font: 'Amiri',
//             fontStyle: 'normal',
//             textColor: 20,
//             lineColor: [200, 200, 200],
//             halign: 'right' // Align text to the right
//         },
//         theme: 'grid',
//         headStyles: {
//             fillColor: [242, 242, 242],
//             textColor: 20,
//             halign: 'right'
//         },
//         bodyStyles: {
//             textColor: 50,
//             halign: 'right'
//         },
//         margin: { top: 20, bottom: 20, right: 10, left: 10 },
//         startY: 50,
//         tableWidth: 'auto', // Automatically adjust the width of the table
//     };

//     // Add the table to the PDF
//     const tableInfo = pdf.autoTable(tableOptions); // Renamed to avoid conflict

//     // Adjust page width if the table exceeds the default A4 width
//     if (tableInfo.table.finalWidth > pageWidth) {
//         pdf.internal.pageSize.width = tableInfo.table.finalWidth + 20; // Add margin
//     }

//     // Save the PDF
//     pdf.save('table.pdf');
// }











/*
//<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
//<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>




window.jspdf = window.jspdf || {};
window.jspdf.jsPDF.API.events.push(['addFonts', function () {
    // Add Amiri Regular
    this.addFileToVFS('Amiri-Regular.ttf', 'BASE64_ENCODED_FONT_DATA_FOR_AMIRI');
    this.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

    // Add Amiri Bold (optional, if needed)
    this.addFileToVFS('Amiri-Bold.ttf', 'BASE64_ENCODED_FONT_DATA_FOR_AMIRI_BOLD');
    this.addFont('Amiri-Bold.ttf', 'Amiri', 'bold');
}]);



function downloadAsPDF() {
    
    const { jsPDF } = window.jspdf;

    // Initialize jsPDF with RTL and custom font
    const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        lang: "ar",
    });

    try {
        pdf.setFont('Amiri', 'normal');
    } catch (e) {
        console.warn("Amiri font not found. Falling back to default font.");
        pdf.setFont('Courier', 'normal'); // Replace with a built-in font
    }
    
    pdf.setFontSize(12);
    pdf.setLanguage("ar");
    pdf.textDirection = "rtl";


    console.log(pdf.getFontList());

    let currentY = 10;

    // Add Ayah Text
    const ayahTextElement = document.querySelector('.ayah-text');
    if (ayahTextElement && !ayahTextElement.classList.contains('hidden')) {
        const ayahText = ayahTextElement.textContent.trim();
        if (ayahText) {
            pdf.text("نص الآية:", 200, currentY, { align: "right" });
            currentY += 10;
            pdf.text(ayahText, 200, currentY, { align: "right" });
            currentY += 20; // Space for the table
        }
    }

    // Add Table
    const tableElement = document.querySelector('.custom-table');
    if (tableElement) {
        const headers = Array.from(
            tableElement.querySelectorAll('thead tr th')
        ).map(th => th.textContent.trim());
        const rows = Array.from(
            tableElement.querySelectorAll('tbody tr')
        ).map(row =>
            Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim())
        );

        if (headers.length > 0 || rows.length > 0) {
            pdf.text("الجدول:", 200, currentY, { align: "right" });
            currentY += 10;

            pdf.autoTable({
                startY: currentY,
                head: [headers],
                body: rows,
                styles: {
                    font: "Amiri",
                    textDirection: "rtl",
                    fontSize: 10,
                },
                margin: { left: 10, right: 10 },
                headStyles: { fillColor: [240, 240, 240], textColor: 0 },
                bodyStyles: { textColor: 50 },
            });
        }
    }

    // Save the PDF
    pdf.save("output.pdf");
}
*/