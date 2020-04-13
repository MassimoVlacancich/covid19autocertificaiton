import React from 'react';
import './italy.css'
import '../App.css'
import {rgb} from 'pdf-lib';
import {getPdf, createAndDownloadBlobFile} from '../services/pdf-utils'
import {dataURItoArrayBuffer} from '../services/utils'

import {isMobile} from "react-device-detect";
import {useForm} from 'react-hook-form';
import {LoadingSpinner} from '../components/loading-spinner/loading-spinner'
import SignatureCanvas from 'react-signature-canvas'

export class ItalyForm extends React.Component{

    constructor(props){
        super(props)

        // try top get cached data
        var cachedData = localStorage.getItem('italyFormData');
        if(cachedData !== null) {
            cachedData = JSON.parse(cachedData)
        }

        this.state = {
            cachedData: cachedData,
            loading: false
        }

        this.generatePdf = this.generatePdf.bind(this)
        this.formSumbitted = this.formSumbitted.bind(this)
        this.clearCachedData = this.clearCachedData.bind(this)
    }

    componentDidMount() {
        // redraw signature via click
        if(this.state.cachedData){
            document.getElementById("redrawCachedSignatureItaly").click();
        }
    }


    pdfReady(pdfBytes){
        this.simulateLoading(3)
        createAndDownloadBlobFile(pdfBytes, 'covid19_autocertificazione')
        // const url = window.URL.createObjectURL(new Blob([pdfBytes]));
        // console.log(url)
        // window.open(url);
    }

    simulateLoading(timeoutSeconds){
        this.setState({
                loading: true
        })

        setTimeout(function() {
            this.setState({loading: false})
        }.bind(this), timeoutSeconds * 1000)
    }

    generatePdf(formData) {
        getPdf('italy').then((doc) => {
            enrichPdfItaly(doc, formData).then((pdfBytes) =>
                this.pdfReady(pdfBytes)
            )
        })
    }

    formSumbitted(data) {
        console.log(data)
        // Store in local storage
        localStorage.setItem('italyFormData', JSON.stringify(data));
        this.generatePdf(data)
    }

    clearCachedData() {
        localStorage.removeItem('italyFormData')
        window.location.reload();
    }

    render() {

        return(
            <div>
                {this.state.loading && 
                   <LoadingSpinner loadingText="Scaricando il pdf..."/>
                }
                
                {this.state.cachedData &&
                    <div className="reset-cache">
                        <button className="btn btn-outline-warning" onClick={this.clearCachedData}>Reset Form</button>
                    </div>
                }
                <ItalyFormHook cachedData={this.state.cachedData} callback={this.formSumbitted}/>
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

    // SIGNATURE
    var signaturePad = {}
    var signaturePadWidth = 500
    var signaturePadHeight = 200

    if(isMobile){
        signaturePadWidth = window.innerWidth * 0.8
    }

    const clearSignature = () => {
        signaturePad.clear()
    }

    const saveSignature = () => {
        const url = signaturePad.toDataURL('image/png', 1.0)
        setValue('signature', url)
    }

    const redrawSignatureFromCache = () => {
        if(props.cachedData) {
            signaturePad.fromDataURL(props.cachedData.signature, {})
        }
    } 

    return(
        <div className="py-5 order-md-1 italy">
            <form className="needs-validation"  onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <h3 className="mb-3 title">Compila il form</h3>
                </div>

                <hr className="mb-4"/>

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
                            defaultValue={props.cachedData ? props.cachedData.name : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.surname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Inserisci il tuo cognome</i>
                            </div>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="dob">Data di nascita</label>
                        <input 
                            type="date" 
                            className="form-control"
                            id="dob"
                            name="dob"
                            defaultValue={props.cachedData ? props.cachedData.dob : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.dob &&
                            <div className="form-field-error">
                                <i>Inserisci la tua data di nascita</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(Android: apri e click sull anno in alto a sinistra per selezionare l'anno)</p>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="birthLoc">Luogo di nascita</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="birthLoc" 
                            placeholder="Luogo di nascita" 
                            name="birthLoc"
                            defaultValue={props.cachedData ? props.cachedData.birthLoc : ''}
                            ref={register({required: true})} 
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
                            <select 
                                className="custom-select" name="idDocument" 
                                defaultValue={props.cachedData ? props.cachedData.idDocument : "Carta d'identità"}
                                ref={register({ required: true })}>
                                <option value="Carta d'identità">Carta d'identità</option>
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
                            defaultValue={props.cachedData ? props.cachedData.documentNum : ''}
                            ref={register({required: true})} 
                        />
                        {errors.documentNum &&
                            <div className="form-field-error">
                                <i>Inserisci il numero di documento</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="documentReleasedBy">Rilasciato dal comune di</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="documentReleasedBy" 
                            placeholder="comune di..." 
                            name="documentReleasedBy"
                            defaultValue={props.cachedData ? props.cachedData.documentReleasedBy : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.documentReleaseDate : ''}
                            ref={register({required: true})} 
                        />
                        {errors.documentReleaseDate &&
                            <div className="form-field-error">
                                <i>Inserisci la data di rilascio del documento</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(Android: apri e click sull anno in alto a sinistra per selezionare l'anno)</p>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="telephone">Numero di telefono</label>
                        <input 
                            type="number"
                            className="form-control" 
                            id="telephone"
                            placeholder="Numero di telefono" 
                            name="telephone"
                            defaultValue={props.cachedData ? props.cachedData.telephone : ''}
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
                <h4 className="mb-3">Residenza</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_city">Città</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_city" 
                            placeholder="Città di residenza" 
                            name="residence_city"
                            defaultValue={props.cachedData ? props.cachedData.residence_city : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_city &&
                            <div className="form-field-error">
                                <i>Inserisci la città di residenza</i>
                            </div>
                        }
                    </div>
                    
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_address">Indirizzo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_address" 
                            placeholder="Indirizzo di residenza" 
                            name="residence_address"
                            defaultValue={props.cachedData ? props.cachedData.residence_address : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_address &&
                            <div className="form-field-error">
                                <i>Inserisci l' indirizzo di residenza</i>
                            </div>
                        }
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Domicilio</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
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
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="domicilio_city">Città</label>
                        <input 
                            disabled={reauseResidenceTick === true}
                            type="text" 
                            className="form-control" 
                            id="domicilio_city" 
                            placeholder={reauseResidenceTick ? reusableResidenceCity : "Città di domicilio"}
                            defaultValue={props.cachedData ? props.cachedData.domicilio_city : ''}
                            name="domicilio_city" 
                            ref={register({required: false})} 
                        />
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
                            defaultValue={props.cachedData ? props.cachedData.domicilio_address : ''}
                            ref={register({required: false})} 
                        />
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
                            defaultValue={props.cachedData ? props.cachedData.movement_startAddress : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.movement_destination : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.movement_startRegion : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.movement_destinationRegion : ''}
                            ref={register({required: !reuseRegion})} 
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
                            <select className="custom-select" name="reasonNum" 
                                defaultValue={props.cachedData ? props.cachedData.reasonNum : '1'}
                                ref={register({ required: true })}>

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
                            defaultValue={props.cachedData ? props.cachedData.declaration : ''}
                            ref={register({required: true})} 
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
                            defaultValue={props.cachedData ? props.cachedData.provvedimenti : ''}
                            ref={register({required: false})} 
                        />                        
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Controllo</h4>
                <p>
                    Puoi lasciare la sezione vuota per ora, e scaricare il documento, 
                    torna ad inseriere i dati durante il controllo e scarica la versione 
                    aggionata
                    <br/>
                    <i className="suggestion">Nota: gli altri campi rimagono compilati, il sito ricorda i dettagli sulla memoria del tuo dispositivo (a patto che la certificazione sia scaricata)</i>
                </p>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="checkDate">Data del controllo</label>
                        <input 
                            type="date"
                            className="form-control" 
                            id="checkDate"
                            name="checkDate"
                            defaultValue={props.cachedData ? props.cachedData.checkDate : ''}
                            ref={register({required: false})} 
                        />
                        {isMobile &&
                            <p className="suggestion">(Android: apri e click sull anno in alto a sinistra per selezionare l'anno)</p>
                        }
                        <i>Puoi inserire la data di oggi.</i>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="checkTime">Ora</label>
                        <input 
                            type="time"
                            className="form-control"
                            id="checkTime"
                            name="checkTime"
                            defaultValue={props.cachedData ? props.cachedData.checkTime : new Date()}
                            ref={register({required: false})}
                        />
                        <i>Puoi inserire l'ora in cui sarai in movimento</i>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="checkLocation">Luogo del controllo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="checkLocation" 
                            placeholder="Supermercato/posta/via verdi..." 
                            name="checkLocation"
                            defaultValue={props.cachedData ? props.cachedData.checkLocation : ''}
                            ref={register({required: false})} 
                        />
                        <i>Puoi inserire la tua posizione attuale.</i>
                    </div>
                </div>


                {/* SIGNATURE */}
                <hr className="mb-4"/>
                <h4 className="mb-3">Firma</h4>
                <div className="row">

                    <div className="col-md-6 mb-3">
                        <input 
                            type="text" 
                            className="form-control signature-field" 
                            id="signature" 
                            placeholder="Signature" 
                            name="signature"
                            defaultValue={props.cachedData ? props.cachedData.signature : ''}
                            ref={register({required: true})} 
                        />
                        <SignatureCanvas penColor='black'
                            ref={(ref) => { signaturePad = ref }}
                            onEnd={saveSignature}
                            canvasProps={{width: signaturePadWidth, height: signaturePadHeight, className: 'signature-pad'}} 
                        />
                        {errors.signature &&
                            <div className="form-field-error">
                                <i>Inserisci la firma</i>
                            </div>
                        }
                        <button className="btn btn-outline-secondary" onClick={clearSignature} type="button">
                            Cancella
                        </button>
                        <button id="redrawCachedSignatureItaly" className="btn btn-outline-secondary redraw-signature" onClick={redrawSignatureFromCache} type="button">
                            Redraw
                        </button>
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
    const blue = rgb(0.0, 0.09, 0.86)

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
        color: blue,
    })

    // DRAW DOB
    // consider mobile case
    const dob = new Date(props.dob)
    firstPage.drawText(dob.getUTCDate().toString(), {
        x: 470,
        y: height - 72,
        size: 12,
        color: blue,
    })

    firstPage.drawText((dob.getUTCMonth() + 1 ).toString(), {
        x: 500,
        y: height - 72,
        size: 12,
        color: blue,
    })
    
    firstPage.drawText(dob.getUTCFullYear().toString(), {
        x: 525,
        y: height - 72,
        size: 12,
        color: blue,
    })

    // birth address
    firstPage.drawText(props.birthLoc, {
        x: 50,
        y: height - 98,
        size: 12,
        color: blue,
    })

    // residenza
    firstPage.drawText(props.residence_city, {
        x: 350,
        y: height - 98,
        size: 12,
        color: blue,
    })
    firstPage.drawText(props.residence_address, {
        x: 98,
        y: height - 124,
        size: 8,
        color: blue,
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
        color: blue,
    })
    firstPage.drawText(domicilio_address, {
        x: 105,
        y: height - 150,
        size: 8,
        color: blue,
    })

    //idDocument
    firstPage.drawText(props.idDocument, {
        x: 450,
        y: height - 148,
        size: 12,
        color: blue,
    })
    
    // document number
    firstPage.drawText(props.documentNum, {
        x: 60,
        y: height - 174,
        size: 12,
        color: blue,
    })

    // document release by
    firstPage.drawText(props.documentReleasedBy, {
        x: 330,
        y: height - 174,
        size: 12,
        color: blue,
    })

    // document release date
    const documentReleaseDate = new Date(props.documentReleaseDate)
    firstPage.drawText(documentReleaseDate.getUTCDate().toString(), {
        x: 67,
        y: height - 200,
        size: 12,
        color: blue,
    })
    firstPage.drawText((documentReleaseDate.getUTCMonth() + 1 ).toString(), {
        x: 100,
        y: height - 200,
        size: 12,
        color: blue,
    })
    firstPage.drawText(documentReleaseDate.getUTCFullYear().toString(), {
        x: 125,
        y: height - 200,
        size: 12,
        color: blue,
    })

    // phone number
    firstPage.drawText(props.telephone, {
        x: 250,
        y: height - 200,
        size: 12,
        color: blue,
    })

    // start address
    firstPage.drawText(props.movement_startAddress, {
        x: 200,
        y: height - 305,
        size: 8,
        color: blue,
    })

    // destination address
    firstPage.drawText(props.movement_destination, {
        x: 300,
        y: height - 325,
        size: 8,
        color: blue,
    })

    // start region
    firstPage.drawText(props.movement_startRegion, {
        x: 170,
        y: height - 407,
        size: 12,
        color: blue,
    })

    // destination region
    firstPage.drawText(props.movement_destinationRegion, {
        x: 170,
        y: height - 425,
        size: 12,
        color: blue,
    })

    // provvedimenti
    // destination region
    // TODO WRAP
    firstPage.drawText(props.provvedimenti, {
        x: 350,
        y: height - 440,
        size: 8,
        color: blue,
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
        color: blue,
    })

    // check date
    firstPage.drawText(props.checkDate, {
        x: 60,
        y: height - 730,
        size: 10,
        color: blue,
    })

    // check time
    firstPage.drawText(props.checkTime, {
        x: 120,
        y: height - 730,
        size: 10,
        color: blue,
    })

    // check location
    firstPage.drawText(props.checkLocation, {
        x: 170,
        y: height - 730,
        size: 10,
        color: blue,
    })

    const signatureArrayBuffer = dataURItoArrayBuffer(props.signature)
    return pdfDoc.embedPng(signatureArrayBuffer).then(
        (signatureImage) => {

            const singatureDims = signatureImage.scale(0.4)

            // Add signature and return
            firstPage.drawImage(signatureImage, {
                x: 70,
                y: height - 845,
                width: singatureDims.width,
                height: singatureDims.height,
            })

            return pdfDoc.save().then(
                (pdfBytes) => {
                    return pdfBytes
                }
            )

        }
    )
}