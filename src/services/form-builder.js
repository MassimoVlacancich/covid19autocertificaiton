import React from 'react';
import {ItalyForm} from '../nations/italy'
import {FranceForm} from '../nations/france'
import {MissingCountryForm} from '../nations/missing'

export function NationForm(props){

    if(props.nation === 'italy'){
        return (
            <ItalyForm />
        );
    }
    if(props.nation === 'france'){
        return(
            <FranceForm />
        )
    }
    if(props.nation === 'add'){
        return(
            <MissingCountryForm />
        )
    }
} 