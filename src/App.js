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
    console.log('accountId:', accountId);
    await this.welcome();
  }

  async welcome() {
    const response = await this.props.contract.getPerson({ /*account_id: accountId,*/ account: accountId });
    console.log('response:', response)
    this.setState({fullname: response.fullname});
    this.setState({address: response.address});
    this.setState({description: response.description});
    this.setState({phone: response.phone});

    const response2 = await this.props.contract.getCoords({ /*account_id: accountId,*/ account: accountId });
    this.setState({latitude: i64ToLatitude(response2.latitude)});
    this.setState({longtitude: i64ToLongtitude(response2.longtitude)});
  }

  async searchFriends() {
    const me = await this.props.contract.getCoords({ account: accountId });

    const quantity = Number(document.getElementById('quantity').value);
    const response = await this.props.contract.findNear({ entries: quantity, account: accountId });
    console.log('response', response)

    response.sort((x) => distance(me.latitude, me.longtitude, x.latitude, x.longtitude));
    if(response.length > quantity) response.length = quantity;

    const friends = response.map((person, index) => {
      return <tr key={person.person.account_id}>
        <td>{person.person.fullname}</td>
        <td>{person.person.address}</td>
        <td>{person.person.phone}</td>
        <td>{person.person.description}</td>
        <td>{distance(i64ToLatitude(me.latitude),
                      i64ToLongtitude(me.longtitude),
                      i64ToLatitude(person.coords.latitude),
                      i64ToLongtitude(person.coords.longtitude))}</td>
      </tr>
    });    
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
    const fullname = document.getElementById('fullname').value;
    const address = document.getElementById('address').value;
    const description = document.getElementById('description').value;
    const phone = document.getElementById('description').value;
    await this.props.contract.changePerson({ account_id: accountId, fullname: fullname, address: address, description: description, phone: phone });
    alert("Person data changed.")
  }

  async movePerson() {
    const latitude = latitudeToI64(Number(document.getElementById('latitude').value));
    const longtitude = longtitudeToI64(Number(document.getElementById('longtitude').value));

    // Split into two operations, to use less gas on each.
    await this.props.contract.removeCoords({ account_id: accountId });
    console.log("coords removed");
    await this.props.contract.addCoords({ account_id: accountId, latitude: latitude, longtitude: longtitude });
    console.log("coords added");

    alert("Person coordinates changed.");
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
          {this.state.login ? 
              <button onClick={this.requestSignOut}>Log out</button>
            : <button onClick={this.requestSignIn}>Log in with NEAR</button>}
        </div>
        <div>
          <p>Full name: <input id="fullname" defaultValue={this.state.fullname}/></p>
          <p>Address: <input id="address" defaultValue={this.state.address}/></p>
          <p>Phone: <input id="phone" defaultValue={this.state.phone}/></p>
          <p>About you (hobbies, need/want volunteering, your languages, etc.):<br/>
            <textarea id="description" defaultValue={this.state.description}></textarea></p>
          <p><input type="button" value="Change your data" onClick={this.changePerson}/></p>
          <p>Latitude: <input type="text" id="latitude" defaultValue={this.state.latitude}/></p>
          <p>Longtitude: <input type="text" id="longtitude" defaultValue={this.state.longtitude}/></p>
          <p><input type="button" value="Move" onClick={this.movePerson.bind(this)}/></p>
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
              <tr><th>Name</th><th>Address</th><th>Phone</th><th>About</th><th>km</th></tr>
            </thead>
            <tbody>
            {this.state.friends}
            </tbody>
          </table>
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
