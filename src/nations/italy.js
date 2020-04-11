import React from 'react';
import './italy.css'
import {rgb} from 'pdf-lib';
import {getPdf} from '../services/pdf-utils'

import {useForm} from 'react-hook-form';

export class ItalyForm extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            formData: {}
        }

        this.generatePdf = this.generatePdf.bind(this)
        this.formSumbitted = this.formSumbitted.bind(this)
    }

    pdfReady(url){
        console.log(url)
        window.open(url);
    }

    generatePdf(formData) {
        getPdf('italy').then((doc) => {
            enrichPdfItaly(doc, formData).then((url) =>
                this.pdfReady(url)
            )
        })
    }

    formSumbitted(data) {
        console.log(data)
        this.generatePdf(data)
    }

    render() {

        return(
            <div>
                <ItalyFormHook callback={this.formSumbitted}/>
            </div>
        )
    }
}

export function ItalyFormHook(props) {
    const { register, handleSubmit, errors, watch, setValue } = useForm();
    const onSubmit = data => props.callback(data);
    //console.log(errors);

    // conditional fields
    const reauseResidenceTick = watch("reuseResidence");
    const reusableResidenceCity = watch("residence_city")
    const reusableResidenceAddress = watch("residence_address")
    const reuseRegion = watch("reuseRegion")
    const reusableMovementStartRegion = watch("movement_startRegion")

    return(
        <div className="py-5 order-md-1">
            <form className="needs-validation"  onSubmit={handleSubmit(onSubmit)}>
                <h4 className="mb-3">Dati Personali</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName">Nome</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Nome" 
                            name="name" 
                            ref={register({required: true, maxLength: 100})} 
                        />
                        {errors.name &&
                            <div className="form-field-error">
                                <i>Inserisci il tuo nome</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Cognome</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Cognome" 
                            name="surname" 
                            ref={register({required: true, maxLength: 80})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Inserisci il tuo cognome</i>
                            </div>
                        }
                    </div>
                </div>

                <div className="row">
                    {/* TODO improve picker, hard to use from mobile */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="dob">Data di nascita</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            id="dob" 
                            placeholder="Data di nascita" 
                            name="dob" 
                            ref={register({required: true})}
                        />
                        {errors.dob &&
                            <div className="form-field-error">
                                <i>Inserisci la tua data di nascita</i>
                            </div>
                        }
                        {/* <NumberFormat register={register({ name: 'bod' }, { required: true })} format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']}/> */}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="birthLoc">Luogo di nascita</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="birthLoc" 
                            placeholder="Luogo di nascita" 
                            name="birthLoc" 
                            ref={register({required: true, maxLength: 100})} 
                        />
                        {errors.birthLoc &&
                            <div className="form-field-error">
                                <i>Inserisci il tuo luogo di nascita</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label htmlFor="idDocument">Tipo di documento</label>
                        <div className="input-group">
                            <select className="custom-select" name="idDocument" ref={register({ required: true })}>
                                <option value="Carta d'identia'">Carta d'identià</option>
                                <option value="Passaporto">Passaporto</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="documentNum">Numero di documento</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="documentNum" 
                            placeholder="Numero di documento" 
                            name="documentNum" 
                            ref={register({required: true, maxLength: 50})} 
                        />
                        {errors.documentNum &&
                            <div className="form-field-error">
                                <i>Inserisci il numero di documento</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="documentReleasedBy">Rilasciato dal</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="documentReleasedBy" 
                            placeholder="Comune di..." 
                            name="documentReleasedBy" 
                            ref={register({required: true, maxLength: 100})} 
                        />
                        {errors.documentReleasedBy &&
                            <div className="form-field-error">
                                <i>Inserisci il comune che ha rilasciato il documento</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="documentReleaseDate">In data</label>
                        <input 
                            type="date"
                            className="form-control" 
                            id="documentReleaseDate"
                            name="documentReleaseDate" 
                            ref={register({required: true})} 
                        />
                        {errors.documentReleaseDate &&
                            <div className="form-field-error">
                                <i>Inserisci la data di rilascio del documento</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="telephone">Numero di telefono</label>
                        <input 
                            type="text"
                            className="form-control" 
                            id="telephone"
                            placeholder="Numero di telefono" 
                            name="telephone" 
                            ref={register({required: true})} 
                        />
                        {errors.telephone &&
                            <div className="form-field-error">
                                <i>Inserisci il tuo numero di telefono</i>
                            </div>
                        }
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Residenza e domicilio</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_city">Città</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_city" 
                            placeholder="Città di residenza" 
                            name="residence_city" 
                            ref={register({required: true, maxLength: 30})} 
                        />
                        {errors.residence_city &&
                            <div className="form-field-error">
                                <i>Inserisci la città di residenza</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="domicilio_city">Città</label>
                        <input 
                            disabled={reauseResidenceTick === true}
                            type="text" 
                            className="form-control" 
                            id="domicilio_city" 
                            placeholder={reauseResidenceTick ? reusableResidenceCity : "Città di domicilio"}
                            name="domicilio_city" 
                            ref={register({required: false, maxLength: 30})} 
                        />
                    </div>
                </div>
                <div className="row">    
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_address">Indirizzo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_address" 
                            placeholder="Indirizzo di residenza" 
                            name="residence_address" 
                            ref={register({required: true, maxLength: 250})} 
                        />
                        {errors.residence_address &&
                            <div className="form-field-error">
                                <i>Inserisci l' indirizzo di residenza</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="domicilio_address">Indirizzo</label>
                        <input 
                            disabled={reauseResidenceTick === true}
                            type="text"
                            className="form-control" 
                            id="domicilio_address" 
                            placeholder={reauseResidenceTick ? reusableResidenceAddress : "Indirizzo di domicilio"}
                            name="domicilio_address" 
                            ref={register({required: false, maxLength: 250})} 
                        />
                        
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="reuseResidence" placeholder="reuseResidence" name="reuseResidence" 
                                ref={register}
                                onClick={() => {
                                    setValue('domicilio_city', reusableResidenceCity)
                                    setValue('domicilio_address', reusableResidenceAddress)
                                }}
                            />
                            <label className="custom-control-label" htmlFor="reuseResidence">
                                <i>Utilizza la residenza come domicilio</i>
                            </label>
                        </div>
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Dettagli dello spostamento</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        
                        <label htmlFor="movement_startAddress">Indirizzo di partenza</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="movement_startAddress" 
                            placeholder="Indirizzo di partenza" 
                            name="movement_startAddress"
                            ref={register({required: true, maxLength: 400})} 
                        />
                        {errors.movement_startAddress &&
                            <div className="form-field-error">
                                <i>Inserisci l' indirizzo di partenza</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="movement_destination">Destinazione</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="movement_destination" 
                            placeholder="Supermercato/posta/via verdi..." 
                            name="movement_destination"
                            ref={register({required: true, maxLength: 400})} 
                        />
                        {errors.movement_destination &&
                            <div className="form-field-error">
                                <i>Inserisci la tua destinazione</i>
                            </div>
                        }
                    </div>
                </div>            
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="movement_startRegion">Regione di partenza</label>
                        <input 
                            type="text" 
                            className="form-control"
                            id="movement_startRegion"
                            placeholder="Regione di partenza"
                            name="movement_startRegion"
                            ref={register({required: true, maxLength: 50})} 
                        />
                        {errors.movement_startRegion &&
                            <div className="form-field-error">
                                <i>Inserisci la regione di partenza</i>
                            </div>
                        }
                        
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="movement_destinationRegion">Regione di arrivo</label>
                        <input
                            disabled={reuseRegion}
                            type="text" 
                            className="form-control"
                            id="movement_destinationRegion"
                            placeholder={reuseRegion ? reusableMovementStartRegion : "Regione di arrivo"}
                            name="movement_destinationRegion"
                            ref={register({required: !reuseRegion, maxLength: 50})} 
                        />
                        {errors.movement_destinationRegion &&
                            <div className="form-field-error">
                                <i>Inserisci la regione di arrivo</i>
                            </div>
                        }
                        
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="reuseRegion" placeholder="reuseRegion" name="reuseRegion" 
                                ref={register}
                                onClick={() => {
                                    // manually set the 'test' field with value 'bill'
                                    setValue('movement_destinationRegion', reusableMovementStartRegion)
                                }}
                            />
                            <label className="custom-control-label" htmlFor="reuseRegion">
                                <i>Utilizza la stessa regione di partenza</i>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="reasonNum">Lo spostamento è determinato da</label>
                        <div className="input-group">
                            <select className="custom-select" name="reasonNum" ref={register({ required: true })}>
                                <option value="1">comprovate esigenze lavorative</option>
                                <option value="2">assoluta urgenza (per trasferimenti in comune diverso)</option>
                                <option value="3">
                                    situazione di necessità (per spostamenti all’interno dello stesso comune o che rivestono carattere di quotidianità)
                                </option>
                                <option value="4"> motivi di salute</option>
                            </select>
                        </div>
                        {errors.reasonNum &&
                            <div className="form-field-error">
                                <i>Seleziona il motivo dello spostamento</i>
                            </div>
                        }              
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="declaration">Dichiarzione (spiega il perchè dello spostamento) </label>
                        <textarea 
                            type="text" 
                            className="form-control"
                            id="declaration"
                            placeholder="(lavoro presso …, devo effettuare una visita medica, urgente assistenza a congiunti o a persone con disabilità, o esecuzioni di interventi assistenziali in favore di persone in grave stato di necessità, obblighi di affidamento di minori, denunce di reati, rientro dall’estero, altri motivi particolari, etc….)."
                            name="declaration"
                            ref={register({required: true, maxLength: 1000})} 
                        />
                        {errors.declaration &&
                            <div className="form-field-error">
                                <i>Motiva il tuo spostamento</i>
                            </div>
                        }                        
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="provvedimenti">Provvedimenti della regione <i>(Opzionale)</i></label>
                        <textarea 
                            type="text" 
                            className="form-control"
                            id="provvedimenti"
                            placeholder="lo spostamento rientra in uno dei casi consentiti dai medesimi provvedimenti (indicare quali se a conoscenza)"
                            name="provvedimenti"
                            ref={register({required: false, maxLength: 500})} 
                        />                        
                    </div>
                </div>

                <button className="btn btn-primary btn-lg btn-block" type="submit">Download Certificazione</button>
            </form>
        </div>
    )
}


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
    const size = firstPage.getSize()
    const height = size.height

    // DRAW NAME
    firstPage.drawText(props.name + ' ' + props.surname, {
        x: 115,
        y: height - 72,
        size: 12,
    })

    // DRAW DOB
    const dob = new Date(props.dob)
    firstPage.drawText(dob.getUTCDate().toString(), {
        x: 470,
        y: height - 72,
        size: 12,
    })

    firstPage.drawText((dob.getUTCMonth() + 1 ).toString(), {
        x: 500,
        y: height - 72,
        size: 12,
    })
    
    firstPage.drawText(dob.getUTCFullYear().toString(), {
        x: 525,
        y: height - 72,
        size: 12,
    })

    // birth address
    firstPage.drawText(props.birthLoc, {
        x: 50,
        y: height - 98,
        size: 12,
    })

    // residenza
    firstPage.drawText(props.residence_city, {
        x: 350,
        y: height - 98,
        size: 12,
    })
    firstPage.drawText(props.residence_address, {
        x: 98,
        y: height - 124,
        size: 8,
    })

    //domicilio
    var domicilio_city = props.domicilio_address
    var domicilio_address = props.domicilio_city
    if(props.reuseResidence === true){
        domicilio_city = props.residence_city
        domicilio_address = props.residence_address
    }else{
        if(!domicilio_city){
            domicilio_city = props.residence_city
        }
        if(!domicilio_address){
            domicilio_address = props.residence_address
        }
    }

    firstPage.drawText(domicilio_city, {
        x: 395,
        y: height - 124,
        size: 12,
    })
    firstPage.drawText(domicilio_address, {
        x: 105,
        y: height - 150,
        size: 8,
    })

    //idDocument
    firstPage.drawText(props.idDocument, {
        x: 450,
        y: height - 148,
        size: 12,
    })
    
    // document number
    firstPage.drawText(props.documentNum, {
        x: 60,
        y: height - 174,
        size: 12,
    })

    // document release by
    firstPage.drawText(props.documentReleasedBy, {
        x: 330,
        y: height - 174,
        size: 12,
    })

    // document release date
    const documentReleaseDate = new Date(props.documentReleaseDate)
    firstPage.drawText(documentReleaseDate.getUTCDate().toString(), {
        x: 67,
        y: height - 200,
        size: 12,
    })
    firstPage.drawText((documentReleaseDate.getUTCMonth() + 1 ).toString(), {
        x: 100,
        y: height - 200,
        size: 12,
    })
    firstPage.drawText(documentReleaseDate.getUTCFullYear().toString(), {
        x: 125,
        y: height - 200,
        size: 12,
    })

    // phone number
    firstPage.drawText(props.telephone, {
        x: 250,
        y: height - 200,
        size: 12,
    })

    // start address
    firstPage.drawText(props.movement_startAddress, {
        x: 200,
        y: height - 305,
        size: 8,
    })

    // destination address
    firstPage.drawText(props.movement_destination, {
        x: 300,
        y: height - 325,
        size: 8,
    })

    // start region
    firstPage.drawText(props.movement_startRegion, {
        x: 170,
        y: height - 407,
        size: 12,
    })

    // destination region
    firstPage.drawText(props.movement_destinationRegion, {
        x: 170,
        y: height - 425,
        size: 12,
    })

    // provvedimenti
    // destination region
    // TODO WRAP
    firstPage.drawText(props.provvedimenti, {
        x: 350,
        y: height - 440,
        size: 8,
    })

    // reason tick
    if(props.reasonNum==='1'){
        firstPage.drawText('X', {
            x: 50,
            y: height - 505,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.reasonNum==='2'){
        firstPage.drawText('X', {
            x: 50,
            y: height - 525,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.reasonNum==='3'){
        firstPage.drawText('X', {
            x: 50,
            y: height - 558,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }
    if(props.reasonNum==='4'){
        firstPage.drawText('X', {
            x: 50,
            y: height - 602,
            size: 12,
            color: rgb(0.95, 0.1, 0.1),
        })
    }

    // declaration
    firstPage.drawText(props.declaration, {
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