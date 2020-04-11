import React from 'react';
import './App.css';
import {NationForm} from './services/form-builder'
import {getIntro} from './services/utils'

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      nation: 'italy',
      intro: getIntro('italy')
    };

    this.handleNationChange = this.handleNationChange.bind(this);
  }

  componentDidMount() {
    
  }

  handleNationChange(event) {    
    this.setState({
      nation: event.target.value,
      intro: getIntro(event.target.value)
    });  
  }

  render(){

    return(
      <div className="container">

        <div className="py-5 text-center">
          <img className="d-block mx-auto mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"/>
          <h2>covid19-Autocertification</h2>
          <p className="lead">
            {this.state.intro}
          </p>

          <div className="input-group">
            <select className="custom-select" value={this.state.nation} onChange={this.handleNationChange}>            
              <option value="italy">Italy</option>
              <option value="france">France</option>
            </select>
          </div>
        
        </div>       

        <NationForm
          nation={this.state.nation} />

      </div>
    )
  }
}

