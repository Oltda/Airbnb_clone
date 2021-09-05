import './App.css';
import React, {Component} from 'react';
import NavBar from './utility/NavBar/NavBar';
import Home from './pages/Home/Home'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import SingleFullVenue from './pages/SingleFullVenue/SingleFullVenue';
import Modal from './utility/Modal/Modal';
import CityVenues from './pages/CityVenues/CityVenues';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import Account from './pages/Account/Account';
import Search from './pages/Search/Search'

class App extends Component {
  render(){
    return (
      <Router>
          <Route path="/" component={NavBar} />
          <Route exact path="/" component={Home} />
          <Route exact path="/venue/:vid" component={SingleFullVenue} />
          <Route exact path="/city/:cityName" component={CityVenues} />
          <Route exact path="/payment-success/:stripeToken" component={PaymentSuccess} />
          <Route path="/" component={Modal} />
          <Route path="/account" component={Account} />
          <Route path="/search/:searchTerm" component={Search} />

      </Router>
    );
  }

}

export default App;
