import React from 'react';
import logo from './logo.svg';
import './App.css';
import {getPdf} from './services/edit-pdf'
import {enrichPdf} from './services/enrich-pdf'

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      nation: 'spain'
    };

    this.handleChange = this.handleNationChange.bind(this);
    this.handleSubmit = this.handleNationSubmit.bind(this);

    this.pdfReady = this.pdfReady.bind(this)
  }

  componentDidMount() {
    
  }

  // TODO pass obtained fields data
  generatePdf() {

    var info = {}

    // different mock data depending on nation
    if(this.state.nation === 'italy') {

      // TODO build correct form and get data - mock for now
      info = {
        pdfName: this.state.nation,
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

    }
    else if(this.state.nation === 'france'){
      info = {
        pdfName: this.state.nation,
        userInfo: {
          name: 'Massimo',
          surname: 'Vlacancich',
          sex: 'la france!!'
        }
      }
    }

    getPdf(this.state.nation).then((doc) => {
      enrichPdf(this.state.nation, doc, info, this.pdfReady)
    })
  }

  pdfReady(pdfUrl){
    console.log(pdfUrl)
    window.open(pdfUrl);
  }

  handleNationChange(event) {    
    this.setState({nation: event.target.value});  
  }

  handleNationSubmit(event) {
    event.preventDefault();
    this.generatePdf()
  }


  render(){
    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form onSubmit={this.handleSubmit}>
            <label>
              <select value={this.state.nation} onChange={this.handleChange}>            
                <option value="italy">Italy</option>
                <option value="france">France</option>
                <option value="spain">Spain</option>
              </select>
            </label>
            <input type="submit" value="Submit" />
          </form>
          

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

