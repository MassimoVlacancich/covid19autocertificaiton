export function getIntro(nation) {
    if(nation === 'italy'){
        return "Questo sito è nato con l'intento di auitare i cittadini ad ottenere un autocertificazione per il proprio stato in modo semplice e veloce." +
        "\n Il sito ricorda i campi immessi per rendere piu' rapido il riempimento del form la volta successiva" + 
        "\n NOTA: il sito non utilizza cookies e non salva nessuna informazione personale, i campi riempieti vegono temporaneamente salvati sulla memoria del tuo dispositivo"
    }else{
        return "This website was born with the intention of helping citiziend to easily obtain the autocertificaiton for their country." +
        "\n The website stores previosly entered fields to allow a quicker fill in the next time." +
        " \n NOTE: this website does not use cookies nor stores any personal information, the fields are cached locally on your device"
    }
}