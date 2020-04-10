import {rgb} from 'pdf-lib';


export function enrichPdfFrance(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    // DRAW NAME
    firstPage.drawText(props.userInfo.name + ' ' + props.userInfo.surname, {
        x: 155,
        y: height - 157.5,
        size: 10,
    })

    // DRAW BOD
    firstPage.drawText(props.userInfo.dob.getUTCDate().toString() + ' / ', {
        x: 175,
        y: height - 169.5,
        size: 10,
    })
    firstPage.drawText('  ' + (props.userInfo.dob.getUTCMonth() + 1 ).toString()  + ' / ', {
        x: 185,
        y: height - 169.5,
        size: 10,
    })
    firstPage.drawText('  ' + props.userInfo.dob.getUTCFullYear().toString(), {
        x: 200,
        y: height - 169.5,
        size: 10,
    })

    // birth address
    firstPage.drawText(props.userInfo.birthLoc, {
        x: 102.5,
        y: height - 182,
        size: 10,
    })

    // DRAW DOMICILIO
    firstPage.drawText(props.userInfo.domicilio.city +' - '+ props.userInfo.domicilio.address +' - '+ props.userInfo.domicilio.p_code, {
        x: 225,
        y: height - 194,
        size: 10,
    })

    // DRAW REASON TICK
    switch(props.userInfo.reasonNum){
    case 1:
        firstPage.drawText('X', {
            x: 72,
            y: height - 280,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 2:
        firstPage.drawText('X', {
            x: 72,
            y: height - 342,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 3:
        firstPage.drawText('X', {
            x: 72,
            y: height - 403,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 4:
        firstPage.drawText('X', {
            x: 72,
            y: height - 452,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 5:
        firstPage.drawText('X', {
            x: 72,
            y: height - 488,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 6:
        firstPage.drawText('X', {
            x: 72,
            y: height - 574,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break

    case 7:
        firstPage.drawText('X', {
            x: 72,
            y: height - 599,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
        break
    }

    // DRAW LOCATION
    firstPage.drawText(props.userInfo.location, {
        x: 126,
        y: height - 645.5,
        size: 10,
    })

    // DRAW DATE
    firstPage.drawText(props.userInfo.subscriptionDate.day, {
        x: 115,
        y: height - 657.5,
        size: 10,
    })

    // DRAW TIME.HOUR
    firstPage.drawText(props.userInfo.subscriptionDate.hours, {
        x: 215,
        y: height - 657.5,
        size: 10,
    })

    // DRAW DATE.MINUTS
    firstPage.drawText(props.userInfo.subscriptionDate.minutes, {
        x: 235,
        y: height - 657.5,
        size: 10,
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