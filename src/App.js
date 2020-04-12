import React from 'react';
import './App.css';
import {NationForm} from './services/form-builder'
import {Intro} from './services/utils'

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      nation: 'france'
    };

    this.handleNationChange = this.handleNationChange.bind(this);
  }

  componentDidMount() {
    
  }

  handleNationChange(event) {    
    this.setState({
      nation: event.target.value,
    });  
  }

  render(){

    return(
      <div>



        <div className="container">

          <div className="py-5 text-center app-header">
            <img className="d-block mx-auto mb-4" src="logo.png" alt="" width="128" height="128"/>
            
            <h2 className="title">covid19-Autocertification</h2>
            
            <div className="select-country">
              <label htmlFor="selectCountry">Select your country</label>
              <div className="input-group">
                <select className="custom-select" value={this.state.nation} onChange={this.handleNationChange}>            
                  <option value="italy">Italia</option>
                  <option value="france">France</option>
                </select>
              </div>
            </div>

            <div className="intro">
              <Intro nation={this.state.nation} />
            </div>
          </div>    

          <NationForm
            nation={this.state.nation} />

        </div>

        <footer className="footer">
          <div className="container">
            <div className="footer-info">
              Created by Massimo Vlacancich
              <div>
                <i className="feedback">
                  Contact me with your feedback! I will happily add your state if missing
                </i>
              </div>

              <div className="row">
                <div className="socials">
                  <a href="https://www.linkedin.com/in/massimovlacancich/" target="_blank" rel="noopener noreferrer">
                    <img alt="linkedin" src="icons/linkedin.png" height="32" width="32" />
                  </a>
                  <a href="mailto:massimovlacancich@gmail.com">
                    <img alt="gmail" src="icons/gmail.png" height="40" width="40" />
                  </a>
                  <a href="https://www.instagram.com/massimotarasso/" target="_blank" rel="noopener noreferrer">
                    <img alt="ig" src="icons/instagram.png" height="32" width="32" />
                  </a>
                </div>
              </div>
              
              <p className="help">
                With the help of <a href="https://www.linkedin.com/in/riccardo-bellatalla/">Riccardo Bellatalla </a>
              </p>

              <p className="disclaimer">
                I do not hold any responsibility for the documents created on this platform nor the way these may be employed
              </p>
            </div>
          </div>
        </footer>

      </div>
    )
  }
}

