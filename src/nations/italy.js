import {rgb} from 'pdf-lib';

export function enrichPdfItaly(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]

    // return pdfDoc.embedFont(StandardFonts.Helvetica).then(
    //     (helveticaFont) => {
    //         // Get the first page of the document
    //         const pages = pdfDoc.getPages()
    //         return pages
    //     }
    // )

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // DRAW NAME
    firstPage.drawText(props.userInfo.name + ' ' + props.userInfo.surname, {
        x: 115,
        y: height - 72,
        size: 12,
    })

    // DRAW DOB
    firstPage.drawText(props.userInfo.dob.getUTCDate().toString(), {
        x: 470,
        y: height - 72,
        size: 12,
    })

    firstPage.drawText((props.userInfo.dob.getUTCMonth() + 1 ).toString(), {
        x: 500,
        y: height - 72,
        size: 12,
    })
    
    firstPage.drawText(props.userInfo.dob.getUTCFullYear().toString(), {
        x: 525,
        y: height - 72,
        size: 12,
    })

    // birth address
    firstPage.drawText(props.userInfo.birthLoc, {
        x: 50,
        y: height - 98,
        size: 12,
    })

    // residenza
    firstPage.drawText(props.userInfo.residence.city, {
        x: 350,
        y: height - 98,
        size: 12,
    })
    firstPage.drawText(props.userInfo.residence.address, {
        x: 98,
        y: height - 124,
        size: 8,
    })

    //domicilio
    firstPage.drawText(props.userInfo.residence.city, {
        x: 395,
        y: height - 124,
        size: 12,
    })
    firstPage.drawText(props.userInfo.residence.address, {
        x: 105,
        y: height - 150,
        size: 8,
    })

    //idDocument
    firstPage.drawText(props.userInfo.idDocument, {
        x: 450,
        y: height - 148,
        size: 12,
    })
    
    // document number
    firstPage.drawText(props.userInfo.documentNum, {
        x: 60,
        y: height - 174,
        size: 12,
    })

    // document release by
    firstPage.drawText(props.userInfo.documentReleaseBy, {
        x: 330,
        y: height - 174,
        size: 12,
    })

    // document release date
    firstPage.drawText(props.userInfo.documentReleaseDate.getUTCDate().toString(), {
        x: 67,
        y: height - 200,
        size: 12,
    })
    firstPage.drawText((props.userInfo.documentReleaseDate.getUTCMonth() + 1 ).toString(), {
        x: 100,
        y: height - 200,
        size: 12,
    })
    firstPage.drawText(props.userInfo.documentReleaseDate.getUTCFullYear().toString(), {
        x: 125,
        y: height - 200,
        size: 12,
    })

    // phone number
    firstPage.drawText(props.userInfo.telephone, {
        x: 250,
        y: height - 200,
        size: 12,
    })

    // start address
    firstPage.drawText(props.userInfo.movement.startAddress, {
        x: 200,
        y: height - 305,
        size: 8,
    })

    // destination address
    firstPage.drawText(props.userInfo.movement.destination, {
        x: 300,
        y: height - 325,
        size: 8,
    })

    // start region
    firstPage.drawText(props.userInfo.movement.startRegion, {
        x: 170,
        y: height - 407,
        size: 12,
    })

    // destination region
    firstPage.drawText(props.userInfo.movement.destinationRegion, {
        x: 170,
        y: height - 425,
        size: 12,
    })

    // provvedimenti
    // destination region
    // TODO WRAP
    firstPage.drawText(props.userInfo.provvedimenti, {
        x: 350,
        y: height - 440,
        size: 8,
    })

    // reason tick
    if(props.userInfo.reasonNum===1){
        firstPage.drawText('X', {
            x: 50,
            y: height - 505,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.userInfo.reasonNum===2){
        firstPage.drawText('X', {
            x: 50,
            y: height - 525,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.userInfo.reasonNum===3){
        firstPage.drawText('X', {
            x: 50,
            y: height - 558,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.userInfo.reasonNum===4){
        firstPage.drawText('X', {
            x: 50,
            y: height - 602,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }

    // declaration
    firstPage.drawText(props.userInfo.declaration, {
        x: 60,
        y: height - 640,
        size: 8,
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