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

export function createAndDownloadBlobFile(body, filename, extension = 'pdf') {
  const blob = new Blob([body]);
  const fileName = `${filename}.${extension}`;
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}