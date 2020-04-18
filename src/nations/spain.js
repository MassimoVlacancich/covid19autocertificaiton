import React from 'react';
import {rgb} from 'pdf-lib';
import './spain.css'
import '../App.css'
import {isMobile} from "react-device-detect";
import {getPdf, createAndDownloadBlobFile} from '../services/pdf-utils'
import {dataURItoArrayBuffer} from '../services/utils'
import {useForm} from 'react-hook-form';
import {LoadingSpinner} from '../components/loading-spinner/loading-spinner'
import SignatureCanvas from 'react-signature-canvas'

export class SpainForm extends React.Component {

    constructor(props){
        super(props)

        // defual to personal form
        var cachedData = localStorage.getItem('spainpersonalFormData');
        if(cachedData !== null) {
            cachedData = JSON.parse(cachedData)
        }

        this.state = {
            formType: 'personal',
            cachedData: cachedData,
            loading: false
        }

        this.generatePdf = this.generatePdf.bind(this)
        this.formSumbitted = this.formSumbitted.bind(this)
        this.clearCachedData = this.clearCachedData.bind(this)
        this.handleFormTypeChange = this.handleFormTypeChange.bind(this)
    }

    componentDidMount() {
        // redraw signature via click
        this.getCachedData('spain' + this.state.formType + 'FormData')
        if(this.state.cachedData){
            document.getElementById(`redrawCachedSignature${this.state.formType}Spain`).click();
        }
    }

    formSumbitted(data) {
        console.log(data)
        // Store in local storage
        localStorage.setItem('spain' + this.state.formType + 'FormData', JSON.stringify(data));
        this.generatePdf(data)
    }

    generatePdf(formData) {
        getPdf('spain_' + this.state.formType).then((doc) => {
            if(this.state.formType === 'personal') {
                enrichPdfSpainPersonal(doc, formData).then((pdfBytes) =>
                    this.pdfReady(pdfBytes)
                )
            }else{
                enrichPdfSpainEmployer(doc, formData).then((pdfBytes) =>
                    this.pdfReady(pdfBytes)
                )
            }
        })
    }

    pdfReady(pdfBytes){
        this.simulateLoading(3)
        createAndDownloadBlobFile(pdfBytes, `covid19_${this.state.formType}_comunication`)
        //const url = window.URL.createObjectURL(new Blob([pdfBytes]));
        //window.open(url);
    }

    getCachedData(key){
        var cachedData = localStorage.getItem(key);
        if(cachedData !== null) {
            cachedData = JSON.parse(cachedData)
        }
        return cachedData;
    }

    clearCachedData() {
        localStorage.removeItem('spain' + this.state.formType + 'FormData')
        window.location.reload();
    }

    simulateLoading(timeoutSeconds){
        this.setState({
                loading: true
        })
        setTimeout(function() {
            this.setState({loading: false})
        }.bind(this), timeoutSeconds * 1000)
    }

    handleFormTypeChange(event) {
        const formType = event.target.value
        // get the cached data if present
        var cachedData = this.getCachedData('spain' + formType + 'FormData')
        this.setState({
            formType: event.target.value,
            cachedData: cachedData
        })
    }

    render() {

        return(
            <div>
                {this.state.loading && 
                   <LoadingSpinner loadingText="Descargando el pdf..."/>
                }
                
                <div className="form-type">
                    <p>Tipo de formulario</p>
                    <div className="input-group">
                        <select className="custom-select" value={this.state.formType} onChange={this.handleFormTypeChange}>            
                        <option value="personal">Autónomos</option>
                        <option value="employer">Empresa</option>
                        </select>
                    </div>
                </div>
                
                {this.state.cachedData &&
                    <div className="reset-cache">
                        <button className="btn btn-outline-warning" onClick={this.clearCachedData}>Restablecer formulario</button>
                    </div>
                }
                
                {this.state.formType === 'personal' &&
                    <SpainPersonalFormHook cachedData={this.state.cachedData} callback={this.formSumbitted}/>
                }

                {this.state.formType === 'employer' &&
                    <SpainEmployerFormHook cachedData={this.state.cachedData} callback={this.formSumbitted}/>
                }

            </div>
        )
    }
}

export function SpainPersonalFormHook(props) {
    const { register, handleSubmit, errors, setValue } = useForm();
    const onSubmit = data => props.callback(data);

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
                    <h3 className="mb-3 title">COMUNICACIÓN DE TRABAJO AUTÓNOMO</h3>
                </div>

                <hr className="mb-4"/>

                <h4 className="mb-3">Información personal</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName">Nombre</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Nombre" 
                            name="name"
                            defaultValue={props.cachedData ? props.cachedData.name : ''}
                            ref={register({required: true})} 
                        />
                        {errors.name &&
                            <div className="form-field-error">
                                <i>Escribe su nombre</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Apellido</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Apellido" 
                            name="surname"
                            defaultValue={props.cachedData ? props.cachedData.surname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Escribe su apellido</i>
                            </div>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="idNumber">DNI</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="idNumber" 
                            placeholder="DNI" 
                            name="idNumber"
                            defaultValue={props.cachedData ? props.cachedData.idNumber : ''}
                            ref={register({required: true})} 
                        />
                        {errors.idNumber &&
                            <div className="form-field-error">
                                <i>Escribe su DNI</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="naf">NAF</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="naf" 
                            placeholder="NAF" 
                            name="naf"
                            defaultValue={props.cachedData ? props.cachedData.naf : ''}
                            ref={register({required: true})} 
                        />
                        {errors.naf &&
                            <div className="form-field-error">
                                <i>Escribe su NAF</i>
                            </div>
                        }
                    </div>
                </div>

                <hr className="mb-4"/>

                <h4 className="mb-3">Información de trabajo</h4>
                <div className="row">
                        
                    <div className="col-md-12 mb-3">
                        <label htmlFor="declaration">Desempeñando la actividad de</label>
                        <textarea 
                            type="text" 
                            className="form-control"
                            id="declaration"
                            placeholder="breve descripción de la misma"
                            name="declaration"
                            defaultValue={props.cachedData ? props.cachedData.declaration : ''}
                            ref={register({required: true})} 
                        />
                        {errors.declaration &&
                            <div className="form-field-error">
                                <i>Motiva tu movimiento</i>
                            </div>
                        }       
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="servicesLocation">Presto mis servicios en la empresa/lugar sita en</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="servicesLocation" 
                            placeholder="localidad" 
                            name="servicesLocation"
                            defaultValue={props.cachedData ? props.cachedData.servicesLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.servicesLocation &&
                            <div className="form-field-error">
                                <i>Entrar al lugar</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="activityTime">Horario de actividad</label>
                        <input 
                            type="time"
                            className="form-control"
                            id="activityTime"
                            name="activityTime"
                            defaultValue={props.cachedData ? props.cachedData.activityTime : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.activityTime &&
                            <div className="form-field-error">
                                <i>Entrez horario de actividad</i>
                            </div>
                        }
                    </div>
                </div>



                {/* SIGNATURE */}
                <hr className="mb-4"/>
                <h4 className="mb-3">FDO</h4>
                <div className="row">
                        
                    <div className="col-md-6 mb-3">
                        
                        <label htmlFor="subscriptionLocation">Localidad</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="subscriptionLocation" 
                            placeholder="Localidad" 
                            name="subscriptionLocation"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.subscriptionLocation &&
                            <div className="form-field-error">
                                <i>Entrar al localidad</i>
                            </div>
                        }
                    
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="subscriptionDate">Y fecha</label>
                        <input 
                            type="date" 
                            className="form-control"
                            id="subscriptionDate"
                            name="subscriptionDate"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionDate : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.subscriptionDate &&
                            <div className="form-field-error">
                                <i>Indica la fecha actual</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">Android: abra y haga clic en el año en la esquina superior izquierda para seleccionar el año</p>
                        }
                    </div>
                
                </div>
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
                                <i>Escribe su firma</i>
                            </div>
                        }
                        <button className="btn btn-outline-secondary" onClick={clearSignature} type="button">
                            Borra
                        </button>
                        <button id="redrawCachedSignaturepersonalSpain" className="btn btn-outline-secondary redraw-signature" onClick={redrawSignatureFromCache} type="button">
                            Redraw
                        </button>
                    </div>
                </div>

              <button className="btn btn-primary btn-lg btn-block" type="submit">Descargar la comunicación</button>

            </form>
        </div>
    )
}


export function SpainEmployerFormHook(props) {
    const { register, handleSubmit, errors, setValue } = useForm();
    const onSubmit = data => props.callback(data);

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
        <div className="py-5 order-md-1 spain">
            <form className="needs-validation"  onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <h3 className="mb-3 title">CERTIFICADO DE TRABAJO</h3>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Empresa</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="employerName">Nombre del director</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="employerName" 
                            placeholder="nombre" 
                            name="employerName"
                            defaultValue={props.cachedData ? props.cachedData.employerName : ''}
                            ref={register({required: true})} 
                        />
                        {errors.employerName &&
                            <div className="form-field-error">
                                <i>Escriber el nombre del director</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="employerSurname">Apellido del director</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="employerSurname" 
                            placeholder="apellido" 
                            name="employerSurname"
                            defaultValue={props.cachedData ? props.cachedData.employerSurname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.employerSurname &&
                            <div className="form-field-error">
                                <i>Escriber l apellido del director</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="companyName">Nombre de la empresa</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="companyName" 
                            placeholder="nombre de la empresa" 
                            name="companyName"
                            defaultValue={props.cachedData ? props.cachedData.companyName : ''}
                            ref={register({required: true})} 
                        />
                        {errors.companyName &&
                            <div className="form-field-error">
                                <i>Escriber el nombre de la empresa</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="companyActivity">Actividad principal</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="companyActivity" 
                            placeholder="activitad de la empresa" 
                            name="companyActivity"
                            defaultValue={props.cachedData ? props.cachedData.companyActivity : ''}
                            ref={register({required: true})} 
                        />
                        {errors.companyActivity &&
                            <div className="form-field-error">
                                <i>Escriber l activitad de la empresa</i>
                            </div>
                        }
                    </div>
                
                </div>


                <hr className="mb-4"/>
                <h4 className="mb-3">Información del empleado</h4>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="firstName">Nombre</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Nombre" 
                            name="name"
                            defaultValue={props.cachedData ? props.cachedData.name : ''}
                            ref={register({required: true})} 
                        />
                        {errors.name &&
                            <div className="form-field-error">
                                <i>Escribe su nombre</i>
                            </div>
                        }
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="lastName">Apellido</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Apellido" 
                            name="surname"
                            defaultValue={props.cachedData ? props.cachedData.surname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Escribe su apellido</i>
                            </div>
                        }
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="idNumber">DNI</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="idNumber" 
                            placeholder="DNI" 
                            name="idNumber"
                            defaultValue={props.cachedData ? props.cachedData.idNumber : ''}
                            ref={register({required: true})} 
                        />
                        {errors.idNumber &&
                            <div className="form-field-error">
                                <i>Escribe su DNI</i>
                            </div>
                        }
                    </div>

                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Información de trabajo</h4>
                <div className="row">
                        
                    <div className="col-md-12 mb-3">
                        <label htmlFor="declaration">Desempeñando la actividad de</label>
                        <textarea 
                            type="text" 
                            className="form-control"
                            id="declaration"
                            placeholder="breve descripción de la misma"
                            name="declaration"
                            defaultValue={props.cachedData ? props.cachedData.declaration : ''}
                            ref={register({required: true})} 
                        />
                        {errors.declaration &&
                            <div className="form-field-error">
                                <i>Motiva tu movimiento</i>
                            </div>
                        }       
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="servicesLocation">En la sede de la empresa sita en</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="servicesLocation" 
                            placeholder="localidad" 
                            name="servicesLocation"
                            defaultValue={props.cachedData ? props.cachedData.servicesLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.servicesLocation &&
                            <div className="form-field-error">
                                <i>Entrar la localidad</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="activityTime">Horario laboral</label>
                        <input 
                            type="time"
                            className="form-control"
                            id="activityTime"
                            name="activityTime"
                            defaultValue={props.cachedData ? props.cachedData.activityTime : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.activityTime &&
                            <div className="form-field-error">
                                <i>Entrez horario laboral</i>
                            </div>
                        }
                    </div>
                </div>


                {/* SIGNATURE */}
                <hr className="mb-4"/>
                <h4 className="mb-3">FDO</h4>
                <div className="row">
                        
                    <div className="col-md-6 mb-3">
                        
                        <label htmlFor="subscriptionLocation">Localidad</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="subscriptionLocation" 
                            placeholder="Localidad" 
                            name="subscriptionLocation"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.subscriptionLocation &&
                            <div className="form-field-error">
                                <i>Entrar al localidad</i>
                            </div>
                        }
                    
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="subscriptionDate">Y fecha</label>
                        <input 
                            type="date" 
                            className="form-control"
                            id="subscriptionDate"
                            name="subscriptionDate"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionDate : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.subscriptionDate &&
                            <div className="form-field-error">
                                <i>Indica la fecha actual</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">Android: abra y haga clic en el año en la esquina superior izquierda para seleccionar el año</p>
                        }
                    </div>
                
                </div>
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
                                <i>Escribe su firma</i>
                            </div>
                        }
                        <button className="btn btn-outline-secondary" onClick={clearSignature} type="button">
                            Borra
                        </button>
                        <button id="redrawCachedSignaturepersonalSpain" className="btn btn-outline-secondary redraw-signature" onClick={redrawSignatureFromCache} type="button">
                            Redraw
                        </button>
                    </div>
                </div>


                <button className="btn btn-primary btn-lg btn-block" type="submit">Télécharger la certification</button>
 
            </form>
        </div>
    )
}


export function enrichPdfSpainPersonal(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]
    const blue = rgb(0.0, 0.09, 0.86)

    const size = firstPage.getSize()
    const height = size.height

    // DRAW NAME
    firstPage.drawText(props.surname + ' ' + props.name, {
        x: 140,
        y: height - 190,
        size: 14,
        color: blue,
    })

    // DRAW ID NUMBER
    firstPage.drawText(props.idNumber, {
        x: 140,
        y: height - 213,
        size: 14,
        color: blue,
    })

    // DRAW NAF
    firstPage.drawText(props.naf, {
        x: 140,
        y: height - 236,
        size: 14,
        color: blue,
    })

    // DRAW DECLARATION
    firstPage.drawText(props.declaration, {
        x: 85,
        y: height - 300,
        size: 12,
        color: blue,
    })

    // DRAW SERVICES LOCATION
    firstPage.drawText(props.servicesLocation, {
        x: 85,
        y: height - 390,
        size: 12,
        color: blue,
    })

    // DRAW ACTIVITY TIME
    firstPage.drawText(props.activityTime, {
        x: 260,
        y: height - 428,
        size: 12,
        color: blue,
    })

    // DRAW LOCATION
    firstPage.drawText(props.subscriptionLocation, {
        x: 85,
        y: height - 660,
        size: 12,
        color: blue,
    })

    // DRAW DATE
    firstPage.drawText(props.subscriptionDate, {
        x: 85,
        y: height - 680,
        size: 12,
        color: blue,
    })


    const signatureArrayBuffer = dataURItoArrayBuffer(props.signature)

    return pdfDoc.embedPng(signatureArrayBuffer).then(
        (signatureImage) => {

            const singatureDims = signatureImage.scale(0.4)

            // Add signature and return
            firstPage.drawImage(signatureImage, {
                x: 115,
                y: height - 610,
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

export function enrichPdfSpainEmployer(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]
    const blue = rgb(0.0, 0.09, 0.86)

    const size = firstPage.getSize()
    const height = size.height

    // DRAW EMPLOYER NAME
    firstPage.drawText(props.employerSurname + ' ' + props.employerName, {
        x: 130,
        y: height - 212,
        size: 14,
        color: blue,
    })

    // DRAW COMPANY NAME
    firstPage.drawText(props.companyName, {
        x: 85,
        y: height - 250,
        size: 14,
        color: blue,
    })

    // DRAW COMPANY ACTIVITY
    firstPage.drawText(props.companyActivity, {
        x: 290,
        y: height - 277,
        size: 14,
        color: blue,
    })

    // DRAW NAME
    firstPage.drawText(props.surname + ' ' + props.name, {
        x: 130,
        y: height - 321,
        size: 14,
        color: blue,
    })

    // DRAW ID NUMBER
    firstPage.drawText(props.idNumber, {
        x: 140,
        y: height - 343,
        size: 14,
        color: blue,
    })

    // DRAW COMPANY NAME
    firstPage.drawText(props.companyName, {
        x: 290,
        y: height - 365,
        size: 14,
        color: blue,
    })

    // DRAW NAME
    firstPage.drawText(props.surname + ' ' + props.name, {
        x: 200,
        y: height - 408,
        size: 14,
        color: blue,
    })

    // DRAW LOCATION
    firstPage.drawText(props.servicesLocation, {
        x: 420,
        y: height - 430,
        size: 12,
        color: blue,
    })

    // DRAW TIME
    firstPage.drawText(props.activityTime, {
        x: 380,
        y: height - 452,
        size: 12,
        color: blue,
    })

    // DRAW DECLARATION
    firstPage.drawText(props.declaration, {
        x: 85,
        y: height - 530,
        size: 10,
        color: blue,
    })

    // DRAW LOCATION
    firstPage.drawText(props.subscriptionLocation, {
        x: 85,
        y: height - 730,
        size: 12,
        color: blue,
    })

    // DRAW DATE
    firstPage.drawText(props.subscriptionDate, {
        x: 85,
        y: height - 750,
        size: 12,
        color: blue,
    })




    



    const signatureArrayBuffer = dataURItoArrayBuffer(props.signature)

    return pdfDoc.embedPng(signatureArrayBuffer).then(
        (signatureImage) => {

            const singatureDims = signatureImage.scale(0.4)

            // Add signature and return
            firstPage.drawImage(signatureImage, {
                x: 90,
                y: height - 715,
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