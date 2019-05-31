import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Profile from './Profile';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Reward from './Reward';
import Avatar from './Avatar';

class App extends Component {

  render() {
    return (
      <BrowserRouter>

      <Switch>
        <Route exact path = "/" component ={Login} />
        <Route exact path = "/signup" component ={Signup} />
        <Route exact path = "/home" component ={Home} />
        <Route exact path = "/profile" component ={Profile} />
        <Route exact path = "/reward" component ={Reward} />
        <Route exact path = "/avatar" component = {Avatar}/>
      </Switch>

      </BrowserRouter>
    );
  }
}

export default App;
