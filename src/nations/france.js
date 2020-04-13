import React from 'react';
import {rgb} from 'pdf-lib';
import './france.css'
import '../App.css'
import {isMobile} from "react-device-detect";
import {getPdf, createAndDownloadBlobFile} from '../services/pdf-utils'
import {dataURItoArrayBuffer} from '../services/utils'
import {useForm} from 'react-hook-form';
import {LoadingSpinner} from '../components/loading-spinner/loading-spinner'
import SignatureCanvas from 'react-signature-canvas'

export class FranceForm extends React.Component {

    constructor(props){
        super(props)

        // defual to personal form
        var cachedData = localStorage.getItem('francepersonalFormData');
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
        this.getCachedData('france' + this.state.formType + 'FormData')
        if(this.state.cachedData){
            document.getElementById(`redrawCachedSignature${this.state.formType}France`).click();
        }
    }

    formSumbitted(data) {
        console.log(data)
        // Store in local storage
        localStorage.setItem('france' + this.state.formType + 'FormData', JSON.stringify(data));
        this.generatePdf(data)
    }

    generatePdf(formData) {
        getPdf('france_' + this.state.formType).then((doc) => {
            if(this.state.formType === 'personal') {
                enrichPdfFrancePersonal(doc, formData).then((pdfBytes) =>
                    this.pdfReady(pdfBytes)
                )
            }else{
                enrichPdfFranceEmployer(doc, formData).then((pdfBytes) =>
                    this.pdfReady(pdfBytes)
                )
            }
        })
    }

    pdfReady(pdfBytes){
        this.simulateLoading(3)
        createAndDownloadBlobFile(pdfBytes, `covid19_${this.state.formType}_auto-certification`)
        // const url = window.URL.createObjectURL(new Blob([pdfBytes]));
        // window.open(url);
    }

    getCachedData(key){
        var cachedData = localStorage.getItem(key);
        if(cachedData !== null) {
            cachedData = JSON.parse(cachedData)
        }
        return cachedData;
    }

    clearCachedData() {
        localStorage.removeItem('france' + this.state.formType + 'FormData')
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
        var cachedData = this.getCachedData('france' + formType + 'FormData')
        console.log(cachedData)
        this.setState({
            formType: event.target.value,
            cachedData: cachedData
        })
    }

    render() {

        return(
            <div>
                {this.state.loading && 
                   <LoadingSpinner loadingText="En téléchargeant le pdf..."/>
                }
                
                <div className="form-type">
                    <p>Type de formulaire</p>
                    <div className="input-group">
                        <select className="custom-select" value={this.state.formType} onChange={this.handleFormTypeChange}>            
                        <option value="personal">Personnel</option>
                        <option value="employer">Employeur</option>
                        </select>
                    </div>
                </div>
                
                {this.state.cachedData &&
                    <div className="reset-cache">
                        <button className="btn btn-outline-warning" onClick={this.clearCachedData}>Reset Form</button>
                    </div>
                }
                
                {this.state.formType === 'personal' &&
                    <FrancePersonalFormHook cachedData={this.state.cachedData} callback={this.formSumbitted}/>
                }

                {this.state.formType === 'employer' &&
                    <FranceEmployerFormHook cachedData={this.state.cachedData} callback={this.formSumbitted}/>
                }

            </div>
        )
    }
}

export function FrancePersonalFormHook(props) {
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
                    <h3 className="mb-3 title">Formulaire Personnel</h3>
                </div>

                <hr className="mb-4"/>

                <h4 className="mb-3">Informations personnel</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName">Nom</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Nom" 
                            name="name"
                            defaultValue={props.cachedData ? props.cachedData.name : ''}
                            ref={register({required: true})} 
                        />
                        {errors.name &&
                            <div className="form-field-error">
                                <i>Entrez votre nom</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Prénom</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Prénom" 
                            name="surname"
                            defaultValue={props.cachedData ? props.cachedData.surname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Entrez votre prénom</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="dob">Date de naissance</label>
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
                                <i>Entrez votre date de naissance</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(Android:ouvrez et cliquez sur l'année en haut à gauche pour sélectionner l'année)</p>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="birthLoc">Lieu de naissance</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="birthLoc" 
                            placeholder="Lieu de naissance" 
                            name="birthLoc"
                            defaultValue={props.cachedData ? props.cachedData.birthLoc : ''}
                            ref={register({required: true})} 
                        />
                        {errors.birthLoc &&
                            <div className="form-field-error">
                                <i>Entrez votre lieu de naissance</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_address">Adresse de résidence</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_address" 
                            placeholder="Adresse de résidence" 
                            name="residence_address"
                            defaultValue={props.cachedData ? props.cachedData.residence_address : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_address &&
                            <div className="form-field-error">
                                <i>Entrez votre adresse de résidence</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="residence_pcode">Code postal</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_pcode" 
                            placeholder="Adresse de résidence" 
                            name="residence_pcode"
                            defaultValue={props.cachedData ? props.cachedData.residence_pcode : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_pcode &&
                            <div className="form-field-error">
                                <i>Entrez votre code postal</i>
                            </div>
                        }
                    </div>
                </div>


                <hr className="mb-4"/>
                <h4 className="mb-3">Détails du déplacement</h4>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="reasonNum">Raison du déplacement</label>
                        <div className="input-group">
                            <select className="custom-select" name="reasonNum" 
                                defaultValue={props.cachedData ? props.cachedData.reasonNum : '1'}
                                ref={register({ required: true })}>
                                <option value="1">
                                    Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle, lorsqu’ils sont indispensables 
                                    à l’exercice d’activités ne pouvant être organisées sous forme de télétravail ou déplacements professionnels ne 
                                    pouvant être différés2 / Travel between my home and my work, when remote work isn’t an option (you’ll also have 
                                    to fill the work travel document) or work travels can’t be canceled.
                                </option>
                                <option value="2">
                                    Déplacements pour effectuer des achats de fournitures nécessaires à l’activité professionnelle et des achats de 
                                    première nécessité3 dans des établissements dont les activités demeurent autorisées (liste sur gouvernement.fr) 
                                    / travel to purchase essential goods within the nearest authorized facilities (list available at gouvernement.fr).
                                </option>
                                <option value="3">
                                    Consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ; consultations et soins 
                                    des patients atteints d'une affection de longue durée / travels for medical consultations that can’t be done remotely. 
                                </option>
                                <option value="4"> 
                                    Déplacements pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou la garde d’enfants / 
                                    Travels for family reasons, to assist vulnerable individuals, or for child care.
                                </option>
                                <option value="5"> 
                                    Déplacements brefs, dans la limite d'une heure quotidienne et dans un rayon maximal d'un kilomètre autour du domicile, 
                                    liés soit à l'activité physique individuelle des personnes, à l'exclusion de toute pratique sportive collective et de 
                                    toute proximité avec d'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, 
                                    soit aux besoins des animaux de compagnie / short travels, close to home, for individual physical activity (excluding 
                                    group sports or proximity with other individuals), or for walking pets.
                                </option>
                                <option value="6"> 
                                    Convocation judiciaire ou administrative / judicial or administrative summons
                                </option>
                                <option value="7"> 
                                    Participation à des missions d’intérêt général sur demande de l’autorité administrative / participation to general interest 
                                    missions commissionned by an administrative authority. 
                                </option>
                            </select>
                        </div>
                        {errors.reasonNum &&
                            <div className="form-field-error">
                                <i>Entrez la raison du déplacement</i>
                            </div>
                        }              
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="location">Fait à</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="location" 
                            placeholder="localisation actuelle" 
                            name="location"
                            defaultValue={props.cachedData ? props.cachedData.location : ''}
                            ref={register({required: true})} 
                        />
                        {errors.location &&
                            <div className="form-field-error">
                                <i>Entrez votre localisation actuelle</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="subscriptionDate">À date</label>
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
                                <i>Indique la date actuelle</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(Android:ouvrez et cliquez sur l'année en haut à gauche pour sélectionner l'année)</p>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="subscriptionDate_hours">Heure</label>
                        <input 
                            type="time"
                            className="form-control"
                            id="subscriptionDate_hours"
                            name="subscriptionDate_hours"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionDate_hours : new Date()}
                            ref={register({required: true})}
                        />
                        {errors.subscriptionDate_hours &&
                            <div className="form-field-error">
                                <i>Entrez l'heure actuelle</i>
                            </div>
                        }
                    </div>
                </div>

                {/* SIGNATURE */}
                <hr className="mb-4"/>
                <h4 className="mb-3">Signature</h4>
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
                                <i>Entrez votre signature</i>
                            </div>
                        }
                        <button className="btn btn-outline-secondary" onClick={clearSignature} type="button">
                            Effacer
                        </button>
                        <button id="redrawCachedSignaturepersonalFrance" className="btn btn-outline-secondary redraw-signature" onClick={redrawSignatureFromCache} type="button">
                            Redraw
                        </button>
                    </div>
                </div>

                <button className="btn btn-primary btn-lg btn-block" type="submit">Télécharger la certification</button>

            </form>
        </div>
    )
}

// TODO
export function FranceEmployerFormHook(props) {
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
                    <h3 className="mb-3 title">Justificatif de déplacement professionnel</h3>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Employeur</h4>
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <label htmlFor="employerSurname">Nom de l’employeur</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="employerSurname" 
                            placeholder="Nom" 
                            name="employerSurname"
                            defaultValue={props.cachedData ? props.cachedData.employerSurname : ''}
                            ref={register({required: true, maxLength: 80})} 
                        />
                        {errors.employerSurname &&
                            <div className="form-field-error">
                                <i>Entrez le nom de l’employeur</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-3 mb-3">
                        <label htmlFor="employerName">Prénom de l’employeur</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="employerName" 
                            placeholder="Nom" 
                            name="employerName"
                            defaultValue={props.cachedData ? props.cachedData.employerName : ''}
                            ref={register({required: true, maxLength: 80})} 
                        />
                        {errors.employerName &&
                            <div className="form-field-error">
                                <i>Entrez le prénom de l’employeur</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="employerRole">Fonctions</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="employerRole" 
                            placeholder="Fonctions" 
                            name="employerRole"
                            defaultValue={props.cachedData ? props.cachedData.employerRole : ''}
                            ref={register({required: true, maxLength: 80})} 
                        />
                        {errors.employerRole &&
                            <div className="form-field-error">
                                <i>Entrez employeur fonctions</i>
                            </div>
                        }
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Informations personnelles</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="surname">Nom</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="surname" 
                            placeholder="Nom" 
                            name="surname"
                            defaultValue={props.cachedData ? props.cachedData.surname : ''}
                            ref={register({required: true})} 
                        />
                        {errors.surname &&
                            <div className="form-field-error">
                                <i>Entrez votre nom</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName">Prénom</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Prénom" 
                            name="name"
                            defaultValue={props.cachedData ? props.cachedData.name : ''}
                            ref={register({required: true})} 
                        />
                        {errors.name &&
                            <div className="form-field-error">
                                <i>Entrez votre prénom</i>
                            </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="dob">Date de naissance</label>
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
                                <i>Entrez votre date de naissance</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(ouvrez et cliquez sur l'année en haut à gauche pour sélectionner l'année)</p>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="residence_address">Adresse de résidence</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_address" 
                            placeholder="Adresse de résidence" 
                            name="residence_address"
                            defaultValue={props.cachedData ? props.cachedData.residence_address : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_address &&
                            <div className="form-field-error">
                                <i>Entrez votre adresse de résidence</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="residence_pcode">Code postal</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="residence_pcode" 
                            placeholder="Adresse de résidence" 
                            name="residence_pcode"
                            defaultValue={props.cachedData ? props.cachedData.residence_pcode : ''}
                            ref={register({required: true})} 
                        />
                        {errors.residence_pcode &&
                            <div className="form-field-error">
                                <i>Entrez votre code postal</i>
                            </div>
                        }
                    </div>
                </div>

                <hr className="mb-4"/>
                <h4 className="mb-3">Informations professionnelles</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="job">Nature de l’activité professionnelle</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="job" 
                            placeholder="activité professionnelle" 
                            name="job"
                            defaultValue={props.cachedData ? props.cachedData.job : ''}
                            ref={register({required: true})} 
                        />
                        {errors.job &&
                            <div className="form-field-error">
                                <i>Entrez votre activité professionnelle</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="jobLocation">Lieux d’exercice de l’activité professionnelle </label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="jobLocation" 
                            placeholder="Lieux d’exercice" 
                            name="jobLocation"
                            defaultValue={props.cachedData ? props.cachedData.jobLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.jobLocation &&
                            <div className="form-field-error">
                                <i>Entrez votre lieux d’exercice</i>
                            </div>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="transport">Moyen de déplacement </label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="transport" 
                            placeholder="Moyen de déplacement " 
                            name="transport"
                            defaultValue={props.cachedData ? props.cachedData.transport : ''}
                            ref={register({required: true})} 
                        />
                        {errors.transport &&
                            <div className="form-field-error">
                                <i>Entrez votre moyen de déplacement </i>
                            </div>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="duration">Durée de validité</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="duration" 
                            placeholder="durée..." 
                            name="duration"
                            defaultValue={props.cachedData ? props.cachedData.duration : ''}
                            ref={register({required: true})} 
                        />
                        {errors.duration &&
                            <div className="form-field-error">
                                <i>Entrez la durée de validité</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="stamp">Nom (et cachet) de l'employeur</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="stamp" 
                            placeholder="nom" 
                            name="stamp"
                            defaultValue={props.cachedData ? props.cachedData.stamp : ''}
                            ref={register({required: true})} 
                        />
                        {errors.stamp &&
                            <div className="form-field-error">
                                <i>Entrez le nom de l'employeur</i>
                            </div>
                        }
                    </div>
                </div>


                <hr className="mb-4"/>
                <h4 className="mb-3">Déclaration</h4>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="subscriptionLocation">Fait à</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="subscriptionLocation" 
                            placeholder="localisation actuelle" 
                            name="subscriptionLocation"
                            defaultValue={props.cachedData ? props.cachedData.subscriptionLocation : ''}
                            ref={register({required: true})} 
                        />
                        {errors.subscriptionLocation &&
                            <div className="form-field-error">
                                <i>Entrez votre localisation actuelle</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="subscriptionDate">Le</label>
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
                                <i>Indique la date actuelle</i>
                            </div>
                        }
                        {isMobile &&
                            <p className="suggestion">(ouvrez et cliquez sur l'année en haut à gauche pour sélectionner l'année)</p>
                        }
                    </div>
                </div>

                {/* SIGNATURE */}
                <hr className="mb-4"/>
                <h4 className="mb-3">Signature</h4>
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
                                <i>Entrez votre signature</i>
                            </div>
                        }
                        <button className="btn btn-outline-secondary" onClick={clearSignature} type="button">
                            Claire
                        </button>
                        <button id="redrawCachedSignatureemployerFrance" className="btn btn-outline-secondary redraw-signature" onClick={redrawSignatureFromCache} type="button">
                            Redraw
                        </button>
                    </div>
                </div>

                <button className="btn btn-primary btn-lg btn-block" type="submit">Télécharger la certification</button>
 
            </form>
        </div>
    )
}



export function enrichPdfFrancePersonal(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]
    const blue = rgb(0.0, 0.09, 0.86)

    const size = firstPage.getSize()
    const height = size.height

    // DRAW NAME
    firstPage.drawText(props.surname + ' ' + props.name, {
        x: 120,
        y: height - 156,
        size: 10,
        color: blue,
    })

    // DRAW BOD
    firstPage.drawText(props.dob, {
        x: 120,
        y: height - 181,
        size: 10,
        color: blue,
    })

    // birth address
    firstPage.drawText(props.birthLoc, {
        x: 87,
        y: height - 204,
        size: 10,
        color: blue,
    })

    // DRAW Address
    firstPage.drawText(props.residence_address + ' - ' + props.residence_pcode, {
        x: 133,
        y: height - 229,
        size: 10,
        color: blue,
    })

    // DRAW REASON TICK
    switch(props.reasonNum){
        case '1':
            firstPage.drawText('X', {
                x: 55,
                y: height - 316,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '2':
            firstPage.drawText('X', {
                x: 55,
                y: height - 366,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '3':
            firstPage.drawText('X', {
                x: 55,
                y: height - 407,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '4':
            firstPage.drawText('X', {
                x: 55,
                y: height - 443,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '5':
            firstPage.drawText('X', {
                x: 55,
                y: height - 500,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '6':
            firstPage.drawText('X', {
                x: 55,
                y: height - 546,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break

        case '7':
            firstPage.drawText('X', {
                x: 55,
                y: height - 582,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break
        default:
            firstPage.drawText('X', {
                x: 55,
                y: height - 316,
                size: 16,
                color: rgb(0.95, 0.1, 0.1),
            })
            break
    }

    // DRAW LOCATION
    firstPage.drawText(props.location, {
        x: 105,
        y: height - 617,
        size: 10,
        color: blue,
    })

    // DRAW DATE
    firstPage.drawText(props.subscriptionDate, {
        x: 95,
        y: height - 640,
        size: 10,
        color: blue,
    })

    // DRAW TIME HOUR:MINUTES --> HOUR
    firstPage.drawText(props.subscriptionDate_hours.split(':')[0], {
        x: 200,
        y: height - 640,
        size: 10,
        color: blue,
    })

    // DRAW TIME HOUR:MINUTES --> MINUTES
    firstPage.drawText(props.subscriptionDate_hours.split(':')[1], {
        x: 220,
        y: height - 640,
        size: 10,
        color: blue,
    })


    const signatureArrayBuffer = dataURItoArrayBuffer(props.signature)

    return pdfDoc.embedPng(signatureArrayBuffer).then(
        (signatureImage) => {

            const singatureDims = signatureImage.scale(0.4)

            // Add signature and return
            firstPage.drawImage(signatureImage, {
                x: 115,
                y: height - 730,
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

export function enrichPdfFranceEmployer(pdfDoc, props) {
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0]
    const blue = rgb(0.0, 0.09, 0.86)

    const size = firstPage.getSize()
    const height = size.height

    // DRAW EMPLOYER NAME
    firstPage.drawText(props.employerSurname + ' ' + props.employerName, {
        x: 223,
        y: height - 196,
        size: 10,
        color: blue,
    })

    // DRAW EMPLOYER ROLE
    firstPage.drawText(props.employerRole, {
        x: 132,
        y: height - 222,
        size: 10,
        color: blue,
    })

    // DRAW SURNNAME
    firstPage.drawText(props.surname, {
        x: 108,
        y: height - 332,
        size: 10,
        color: blue,
    })

    // DRAW NAME
    firstPage.drawText(props.name, {
        x: 118,
        y: height - 356,
        size: 10,
        color: blue,
    })

    // DRAW DOB
    firstPage.drawText(props.dob, {
        x: 170,
        y: height - 380.5,
        size: 10,
        color: blue,
    })

    // DRAW ADDRESS
    firstPage.drawText(props.residence_address + ' - ' + props.residence_pcode, {
        x: 180,
        y: height - 405,
        size: 10,
        color: blue,
    })

    // DRAW JOB
    firstPage.drawText(props.job, {
        x: 250,
        y: height - 429,
        size: 10,
        color: blue,
    })

    // DRAW LOCATION
    firstPage.drawText(props.jobLocation, {
        x: 295,
        y: height - 453.5,
        size: 10,
        color: blue,
    })

    // DRAW TRANSPORT
    firstPage.drawText(props.transport, {
        x: 198,
        y: height - 477.5,
        size: 10,
        color: blue,
    })

    // DRAW DURATION
    firstPage.drawText(props.duration, {
        x: 170,
        y: height - 501.5,
        size: 10,
        color: blue,
    })

    // DRAW STAMP
    firstPage.drawText(props.stamp, {
        x: 220,
        y: height - 538.5,
        size: 10,
        color: blue,
    })

    // SUBSCRIPTION LOCATION
    firstPage.drawText(props.subscriptionLocation, {
        x: 107,
        y: height - 609.5,
        size: 10,
        color: blue,
    })

    // SUBSCRIPTION DATE
    firstPage.drawText(props.subscriptionDate, {
        x: 92,
        y: height - 635,
        size: 10,
        color: blue,
    })


    const signatureArrayBuffer = dataURItoArrayBuffer(props.signature)

    return pdfDoc.embedPng(signatureArrayBuffer).then(
        (signatureImage) => {

            const singatureDims = signatureImage.scale(0.4)

            // Add signature and return
            firstPage.drawImage(signatureImage, {
                x: 230,
                y: height - 655,
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