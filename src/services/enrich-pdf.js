import {enrichPdfItaly} from '../nations/italy';
import {enrichPdfFrance} from '../nations/france';

export function enrichPdf(nation, doc, data, callback) {

    // sort by nation
    if(nation === 'italy') {
        enrichPdfItaly(doc, data).then((url) =>
            callback(url)
        )
    }

    if(nation === 'france') {
        enrichPdfFrance(doc, data).then((url) =>
            callback(url)
        )
    }
}