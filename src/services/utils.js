import React from 'react';
import '../App.css'

export function Intro(props) {
    if(props.nation === 'italy'){
        return(
          <div>
            <h3>
              Compila e scarica l'autocertificazione in maniera semplice e veloce.
            </h3>
            <p>
              I campi immessi verranno salvati nella memoria del tuo dispositivo per rendere più rapido il riempimento del modulo in futuro.
            <br/>
            Il sito non utilizza cookies e non salva alcuna informazione personale.
              </p>
          </div>
        )
    }
    else if(props.nation === 'france'){
        return(
            <div>
              <h3>
                Remplissez et téléchargez l'auto-certification rapidement et facilement.
              </h3>
              <p>
                Les champs que vous entrez seront enregistrés dans la mémoire de votre appareil pour accélérer le remplissage du formulaire à l'avenir. 
                <br/>
                Le site n'utilise pas de cookies et n'enregistre aucune information personnelle.
              </p>
            </div>
        )
    }
    else{
        return (
            <div>
              <h3>
                Fill and download your self-certification easily. 
              </h3>
              <p>
                The values you enter in each field will be saved in your device's memory to make the form quicker to fill in the future.
                <br/>
                The site doesn't use cookies and won't store any of your personal information.
              </p>
            </div>
        )
    }
}

export function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return ab
}
