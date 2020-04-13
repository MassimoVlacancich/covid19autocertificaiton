import './missing.css'
import React from 'react';
import {useForm} from 'react-hook-form';

export function MissingCountryForm(props){

    const { register, handleSubmit, errors, watch } = useForm();
    const onSubmit = (data) => {
        console.log(data)
        const myAddress = 'massimovlacancich@gmail.com'
        const mailIntro = `Hi Massimo! %0D%0A %0D%0AIt would be amazing if you could add ${data.country} to the website. %0D%0A`
        var mailLink = ''
        if(data.link){
            mailLink = `Here is the link to ${data.country} self certification: ${data.link}%0D%0A`
        }
        const mailConclusion = '%0D%0AThanks!'
        const mailBody= mailIntro + mailLink + mailConclusion
        const mail = `mailto:${myAddress}?subject=New country to be added to covid19-Selfcertification!&body=${mailBody}`
        window.location.href = mail;
    };

    const providedCountry = watch("country");
    const yourCountry = ' your country'

    return(
        <div className="py-5 order-md-1 missing">
            <form className="needs-validation"  onSubmit={handleSubmit(onSubmit)}>

                <div className="title">
                    <h3 className="mb-3">Request for a country to be added</h3>
                    <p>
                        Hi! Thanks for getting so far, please provide me with
                        <br/>
                        <b> your state's name and a link to the self certification document</b>
                        <br/>
                        I will add it in 24h!
                    </p>
                </div>

                <hr className="mb-4"/>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="country">Country</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="country" 
                            placeholder="The name of your country" 
                            name="country"
                            ref={register({required: true})} 
                        />
                        {errors.country &&
                            <div className="form-field-error">
                                <i>Please enter the name of your country</i>
                            </div>
                        }
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="link">Link to document <i>(Optional)</i></label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="link" 
                            placeholder="A link to a document or webpage containing it" 
                            name="link"
                            ref={register({required: false})} 
                        />
                    </div>
                </div>

                <button className="btn btn-primary btn-lg btn-block" type="submit">
                    Let's help 
                    {!providedCountry && 
                        yourCountry
                    }
                    {providedCountry &&
                        <span className="your-country">{' ' + providedCountry}</span>
                    }
                </button>
            </form>
        </div>
    )
} 