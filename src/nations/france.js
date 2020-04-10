import React from 'react';
import {rgb} from 'pdf-lib';

export function FranceForm(props) {

    return(
        <div>
            FranceForm here!
        </div>
    )
}

export function enrichPdfFrance(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]

    // Get the width and height of the first page
    // height: top left corner, subtract to go down
    const size = firstPage.getSize()
    const height = size.height

    // DRAW NAME
    firstPage.drawText(props.userInfo.name + ' ' + props.userInfo.surname, {
        x: 115,
        y: height - 72,
        size: 12,
    })

    //
    firstPage.drawText(props.userInfo.sex,{
        x: 250,
        y: height - 200,
        size: 32,
        color: rgb(0.95, 0.1, 0.1),
    })

    // Address
    firstPage.drawText(props.userInfo.address,{
        x: 130,
        y: height - 100,
        size: 12
    })

    // Serialize the PDFDocument to bytes (a Uint8Array)
    return pdfDoc.save().then(
        (pdfBytes) => {
            return window.URL.createObjectURL(new Blob([pdfBytes]));
            
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'file.pdf'); //or any other extension
            // document.body.appendChild(link);
            // link.click();
        }
    )
}