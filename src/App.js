import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null
    }
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.changePerson = this.changePerson.bind(this);
  }

  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  async signedInFlow() {
    console.log("come in sign in flow")
    this.setState({
      login: true,
    })
    const accountId = await this.props.wallet.getAccountId()
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    await this.welcome();
  }

  async welcome() {
    console.log("XXX")
    const response = await this.props.contract.getPersonFullname({ account_id: accountId });
    console.log('response', response);
    if(!response) return;

    // const response = await this.props.contract.getPerson({/* account_id: accountId */});
    // console.log('response', response);
    // if(!response) return;
    // this.setState({speech: response.text});
  }

  async requestSignIn() {
    const appTitle = 'NEAR React template';
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    )
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn())
  }

  async changePerson() {
    // FIXME
    let person = {};
    person.fullname = document.getElementById('fullname').value;
    person.address = document.getElementById('address').value;
    person.description = document.getElementById('description').value;
    person.latitude = document.getElementById('latitude').value;
    person.longtitude = document.getElementById('longtitude').value;
    await this.props.contract.changePerson(person);
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(window.location.origin + window.location.pathname)
    }
    this.setState({
      login: false,
      speech: null
    })
  }

  render() {
    let style = {
      fontSize: "1.5rem",
      color: "#0072CE",
      textShadow: "1px 1px #D1CCBD"
    }
    return (
      <div className="App-header">
        <div className="image-wrapper">
          <img className="logo" src={nearlogo} alt="NEAR logo" />
          <p><span role="img" aria-label="fish">🐟</span> Find friends near you.<span role="img" aria-label="fish">🐟</span></p>
        </div>
        <div>
          <p>Full name: <input id="fullname" value={this.props.fullname}/></p>
          <p>Address: <input id="address" value={this.props.address}/></p>
          <p>About you (hobbies, need/want volunteering, your languages, etc.):<br/>
            <textarea id="description">{this.props.description}</textarea></p>
          <p>Latitude: <input type="number" id="latitude" value={this.props.latitude}/></p>
          <p>Longtitude: <input type="number" id="longtitude" value={this.props.longtitude}/></p>
          <p><input type="button" value="Change your data" onClick={this.changePerson}/></p>
        </div>
        <div>
          {this.state.login ? 
              <button onClick={this.requestSignOut}>Log out</button>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>
        <div>
          <div className="logo-wrapper">
            <img src={near} className="App-logo margin-logo" alt="logo" />
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </div>
      </div>
    )
  }

}

export default App;
