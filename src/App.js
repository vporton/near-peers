import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import logo from './assets/logo.svg';
import nearlogo from './assets/gray_near_logo.svg';
import near from './assets/near.svg';
import './App.css';
import { distance, latitudeToI64, longtitudeToI64, i64ToLatitude, i64ToLongtitude } from './earth';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      friends: [],
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
    const response = await this.props.contract.getPerson({ /*account_id: accountId,*/ account: accountId });
    this.setState({fullname: response.fullname});
    this.setState({address: response.address});
    this.setState({description: response.description});
    this.setState({latitude: i64ToLatitude(response.latitude)});
    this.setState({longtitude: i64ToLongtitude(response.longtitude)});
  }

  async searchFriends() {
    const me = await this.props.contract.getPerson({ account: accountId });

    const quantity = Number(document.getElementById('quantity').value);
    const response = await this.props.contract.findNear({ entries: quantity, account: accountId, degree: 20 });

    response.sort((x) => distance(me.latitude, me.longtitude, x.latitude, x.longtitude));
    if(response.length > quantity) response.length = quantity;

    const friends = response.map((person, index) => {
      return <tr key={person.account_id}>
        <td>{person.fullname}</td>
        <td>{person.address}</td>
        <td>{person.description}</td>
        <td>{distance(me.latitude, me.longtitude, person.latitude, person.longtitude)}</td>
      </tr>
    })
    this.setState({friends: friends});
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
    let person = {};
    person.fullname = document.getElementById('fullname').value;
    person.address = document.getElementById('address').value;
    person.description = document.getElementById('description').value;
    person.latitude = latitudeToI64(Number(document.getElementById('latitude').value));
    person.longtitude = longtitudeToI64(Number(document.getElementById('longtitude').value));
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
          <p>Full name: <input id="fullname" defaultValue={this.state.fullname}/></p>
          <p>Address: <input id="address" defaultValue={this.state.address}/></p>
          <p>About you (hobbies, need/want volunteering, your languages, etc.):<br/>
            <textarea id="description" defaultValue={this.state.description}></textarea></p>
          <p>Latitude: <input type="text" id="latitude" defaultValue={this.state.latitude}/></p>
          <p>Longtitude: <input type="text" id="longtitude" defaultValue={this.state.longtitude}/></p>
          <p><input type="button" value="Change your data" onClick={this.changePerson}/></p>
        </div>
        <div>
          <p>Find
            <select id="quantity">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>50</option>
              <option>100</option>
              <option>200</option>
            </select>
            potential friends
            <input type="button" value="Find!" onClick={this.searchFriends.bind(this)}/>
          </p>
          <table style={{background: 'black'}}>
            <thead>
              <tr><th>Name</th><th>Address</th><th>About</th><th>km</th></tr>
            </thead>
            <tbody>
            {this.state.friends}
            </tbody>
          </table>
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
