import React, { Component } from 'react';
import './Login.css';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toHome: false,
      toSignup: false,
      username: '',
      password: ''
    }

    this.goSignup = this.goSignup.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.server = "http://localhost:5000";
  }

  /* ROUTE CHANGE */
  goSignup() {
    this.props.history.push("/signup")
  }

  /* STATE CHANGE METHODS */
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /* USER LOGIN: Handles when a user logins. */
  handleSubmit(event){
    event.preventDefault()

    fetch(this.server + "/login", {
      mode: 'cors',
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
        .then(res => res.text())
        .then(data => {
          // if empty field, give error popup
          if (data === "empty"){
            Alert.error('Login fields cannot be empty.', {
            position: 'bottom',
            effect: 'jelly',
            beep: false,
            timeout: 'none',
            offset: 600
            });
          }

          // if wrong password or username, give error popup
          if (data === "Wrong username or password."){
            Alert.error('Wrong username or password.', {
            position: 'bottom',
            effect: 'jelly',
            beep: false,
            timeout: 'none',
            offset: 600
            });
          }

          // move to home
          if (data === "success"){
            this.props.history.push("/home");
          }

        }).catch(err => {
      // handle err
      console.log(err)
    })
  }

  render() {
    return (
        <div className = "login-container">

            <div className = "super">
              <span className="welcome-text">MedHeroes</span>
            </div>


            <form onSubmit = {this.handleSubmit} className="loginForm">
              <div className = "username">
                <p> Username </p>
                <input type="text" id="acct-input" name="username" onChange={this.onChange} value={this.state.username}/>
              </div>

              <div className = "password">
                <p> Password </p>
                <input type="password" id ="pass-input" name="password" onChange={this.onChange} value={this.state.password}/>
              </div>
              <div className="login"> <input type="submit" value="Login" id ="submitButton"/></div>
            </form>
          <div className="signup-wrapper">
            <div className="signup">
              <p id = "make-acct"> Don't have an account? </p>
              <p id ="make" onClick ={this.goSignup} className="signup-here" tabIndex="0"> Sign up here!</p>
            </div>
          </div>


          <Alert stack={{limit: 2}} />
      </div>
    );
  }
}

export default Login;
