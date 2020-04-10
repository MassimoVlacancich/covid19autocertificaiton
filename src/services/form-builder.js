import React from 'react';
import {ItalyForm} from '../nations/italy'
import {FranceForm} from '../nations/france'

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
} 