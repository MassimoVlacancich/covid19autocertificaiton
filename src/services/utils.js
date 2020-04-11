import React from 'react';
import '../App.css'

export function Intro(props) {
    if(props.nation === 'italy'){
        return(
            <div>
                Questo sito è nato con l'intento di auitare i cittadini ad ottenere un autocertificazione per il proprio stato in modo semplice e veloce.
                <br/>
                <u>Il sito ricorda i campi immessi per rendere piu' rapido il riempimento del form la volta successiva </u>
                <br/>
                <div className="disclaimer">
                   <i>il sito non utilizza cookies e non salva nessuna informazione personale, i campi riempieti vegono temporaneamente salvati sulla memoria del tuo dispositivo</i>
                </div>
            </div>
        )
    }else{
        return (
            <div>
                This website was born with the intention of helping citiziend to easily obtain the autocertificaiton for their country.
                The website stores previosly entered fields to allow a quicker fill in the next time.
                NOTE: this website does not use cookies nor stores any personal information, the fields are cached locally on your device
            </div>
        )
    }
}

export function dataURItoArrayBuffer(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return ab

//   // write the ArrayBuffer to a blob, and you're done
//   var blob = new Blob([ab], {type: mimeString});
//   return blob;

}