import {PDFDocument} from 'pdf-lib';

export function getPdf(nation) {

    return fetch(`../pdf-templates/${nation}.pdf`, {mode: 'no-cors'})
    .then(res => {
        return res.arrayBuffer()
    })
    .then(
        (result) => {
            const existingPdfBytes = result
            // Load a PDFDocument from the existing PDF bytes
            return PDFDocument.load(existingPdfBytes).then(
                (pdfDoc) => {
                    return pdfDoc;
                }
            )

        }
    ).catch(error => {
        console.error(error);
        return null
    });
}