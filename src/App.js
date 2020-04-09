import React from 'react';
import logo from './logo.svg';
import './App.css';
import {editPdf} from './services/edit-pdf'

export default class App extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    this.generatePdf()
  }

  generatePdf() {

    const info = {
      pdfName: 'default',
      userInfo: {
        name: 'Massimo',
        surname: 'Vlacancich',
        dob: new Date('1995-03-10'),
        birthLoc: 'Cirie, Torino',
        residence: {
          city: 'Torino',
          address: 'Via Canonico Maffei 45, San Maurizio Canavese'
        },
        domicilio: {
          city: 'Torino',
          address: 'Via Canonico Maffei 45, San Maurizio Canavese'
        },
        idDocument: 'Carta di indentita',
        documentNum: '2345545232',
        documentReleaseBy: 'Comune di San Maurizio',
        documentReleaseDate: new Date('1995-03-10'),
        telephone: '3465792372',
        movement: {
          startAddress: 'Via Canonico Maffei 45',
          destination: 'supermecato di zona',
          startRegion: 'Piemonte',
          destinationRegion: 'Piemonte',
        },
        provvedimenti: 'some text here - TODO wrap',
        reasonNum: 1,
        declaration: 'bla bla bla bla bla - TODO wrap'
      }
    }

    editPdf(info, this.pdfReady)

  }

  pdfReady(pdfUrl){
    console.log(pdfUrl)
    window.open(pdfUrl);
  }

  render(){
    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }
}

