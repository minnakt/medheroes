import React, { Component } from 'react';
import './Signup.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      confPassword: '',
      open: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOK = this.handleOK.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);

    this.server = "http://localhost:5000";
  }

  /* STATE CHANGE FUNCTIONS */
  onChange(e) {
       this.setState({
           [e.target.name]: e.target.value
       });
   }

   /* PRIVACY POLICY DIALOG. */
   // close dialog by clicking out
   handleCancel() {
     this.setState({ open: false });
   };
   // open dialog
   handleClickOpen(){
     this.setState({ open: true });
   };
   // close dialog by clicking OK
   handleOK(){
     this.setState({ open: false });
   };

  /* HANDLE USER ATTEMPT TO SIGNUP */
  handleSubmit(event){
    event.preventDefault()

    fetch(this.server +"/signup", {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confPassword: this.state.confPassword,
          })
        })
        .then(res => res.text())
        .then(data => {
            // not a valid email
            if (data === "not-email"){
              Alert.error('Not a valid email.', {
              position: 'top',
              effect: 'jelly',
              beep: false,
              timeout: 'none',
              offset: 100
              });
            }

            // any one of the fields are empty
            if (data === "empty"){
              Alert.error('Signup fields cannot be empty.', {
              position: 'top',
              effect: 'jelly',
              beep: false,
              timeout: 'none',
              offset: 100
              });
            }

            // passwords do not match
            if (data === "passwords dont match"){
                Alert.error('Passwords do not match.', {
                position: 'top',
                effect: 'jelly',
                beep: false,
                timeout: 'none',
                offset: 100
                });
            }

            // user already exists
            if (data === "User already exists"){
              Alert.error('User already exists.', {
              position: 'top',
              effect: 'jelly',
              beep: false,
              timeout: 'none',
              offset: 100
              });
            }

            // successful registration
            if (data === "success"){
              Alert.success('Signup successful! Go back to the login page to log in.', {
                position: 'top',
                effect: 'jelly',
                beep: false,
                timeout: 'none',
                offset: 100,
              })
            }

        }).catch(err => {
          console.log(err)
        })
  }


  render() {

    return (
      <div className = "signup-container">
      <Dialog
        className = "dialog"
        open={this.state.open}
        onClose={this.handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">

        <DialogContent>
            <div className="privacy-container">
              <span className="privacy-title">MedHeroes Privacy Policy</span>
              <div>
                <p>Your privacy is critically important to us.</p>

                <p>It is MedHeroes's policy to respect your privacy regarding any information we may collect
                  while operating our website. This Privacy Policy applies to MedHeroes (hereinafter, "us", "we", or
                  "MedHeroes"). We respect your privacy and are committed to protecting personally identifiable
                  information you may provide us through the Website.</p>

                <p>We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected
                  on our Website, how we use this information, and under what circumstances we may disclose the
                  information to third parties. This Privacy Policy applies only to information we collect through
                  the Website and does not apply to our collection of information from other sources.</p>

                <p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth
                  the general rules and policies governing your use of our Website. Depending on your activities when
                  visiting our Website, you may be required to agree to additional terms and conditions.</p>
              </div>

              <div>
                <span className="privacy-content-title">I. Website Visitors</span>
                <p>Like most website operators, MedHeroes collects non-personally-identifying information of the
                  sort that web browsers and servers typically make available, such as the browser type, language
                  preference, referring site, and the date and time of each visitor request. MedHeroes's purpose in
                  collecting non-personally identifying information is to better understand how MedHeroes's visitors
                  use its website. From time to time, MedHeroes may release non-personally-identifying information in
                  the aggregate, e.g., by publishing a report on trends in the usage of its website.
                  MedHeroes also collects potentially personally-identifying information like Internet Protocol
                  (IP) addresses for logged in users.</p>
                <p>MedHeroes only discloses logged in user IP addresses under the same circumstances that it
                  uses and discloses personally-identifying information as described below.</p>
              </div>

              <div>
                <span className="privacy-content-title">II. Gathering of Personally-Identifying Information</span>
                <p>Certain visitors to MedHeroes's websites choose to interact with MedHeroes in ways that
                  require MedHeroes to gather personally-identifying information. The amount and type of information
                  that MedHeroes gathers depends on the nature of the interaction. For example, we ask visitors who
                  sign up for http://medheroes.com to provide a username and email address.</p>
              </div>

              <div>
                <span className="privacy-content-title">III. Security</span>
                <p>The security of your Personal Information is important to us, but remember that no method
                  of transmission over the Internet, or method of electronic storage is 100% secure. While we
                  strive to use commercially acceptable means to protect your Personal Information, we cannot
                  guarantee its absolute security.</p>
              </div>

              <div>
                <span className="privacy-content-title">IV. Links To External Sites</span>
                <p>Our Service may contain links to external sites that are not operated by us. If you click on a
                  third party link, you will be directed to that third party's site. We strongly advise you to
                  review the Privacy Policy and terms and conditions of every site you visit.
                  We have no control over, and assume no responsibility for the content, privacy policies or
                  practices of any third party sites, products or services.</p>
              </div>

              <div>
                <span className="privacy-content-title">V. Cookies</span>
                <p>To enrich and perfect your online experience, MedHeroes uses "Cookies", similar technologies
                  and services provided by others to display personalized content, appropriate advertising and store
                  your preferences on your computer.</p>
                <p>A cookie is a string of information that a website stores on a visitor's computer, and that the
                  visitor's browser provides to the website each time the visitor returns. MedHeroes uses cookies to
                  help MedHeroes identify and track visitors, their usage of http://medheroes.com, and their website
                  access preferences. MedHeroes visitors who do not wish to have cookies placed on their computers
                  should set their browsers to refuse cookies before using MedHeroes's websites, with the drawback
                  that certain features of MedHeroes's websites may not function properly without the aid of cookies.</p>

                <p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge
                  and agree to MedHeroes's use of cookies.</p>
              </div>

              <div>
                <span className="privacy-content-title">VI. Privacy Policy Changes</span>
                <p>Although most changes are likely to be minor, MedHeroes may change its Privacy Policy from time
                  to time, and in MedHeroes's sole discretion. MedHeroes encourages visitors to frequently check this
                  page for any changes to its Privacy Policy. Your continued use of this site after any change in this
                  Privacy Policy will constitute your acceptance of such change.</p>
              </div>
              </div>
          </DialogContent>

          <div className="privacy-button-wrapper">
            <DialogActions>
                <Button onClick={this.handleOK} color="primary" autoFocus>
                  OK
                </Button>
            </DialogActions>
          </div>
        </Dialog>

          <div className="terms">
              <span>If you are under 16 years old</span>
              <span>, please ask your parent or guardian to sign up on your behalf.
              </span>
            <br></br><br></br>
            <span> Signing up means you agree to our </span>
              <span onClick={this.handleClickOpen} className="termsandconditions">terms and conditions</span><span>.</span>
          </div>

      <form onSubmit={this.handleSubmit} className="signupForm">
        <div className = "username-signup">
          <p> Email address </p>
          <input type="text" id="email-input-signup" name="email" onChange={this.onChange} value={this.state.email}/>
        </div>

        <div className = "username-signup">
          <p> Username</p>
          <input type="text" id="acct-input-signup" name="username" onChange={this.onChange} value={this.state.username}/>
        </div>


        <div className = "password-signup">
          <p> Password </p>
          <input type="password" id = "pass-input-signup" name="password" onChange={this.onChange} value={this.state.password}/>
        </div>


        <div className = "password-signup">
          <p> Confirm password </p>
          <input type="password" id = "conf-input-signup" name="confPassword" onChange={this.onChange} value={this.state.confPassword}/>
        </div>

          <div className="submit-signup"> <input type="submit" value="Sign up" id ="submitButton-signup" tabIndex="0"/> </div>
      </form>

      <Alert stack={{limit: 2}} />
      </div>
    );
  }
}

export default Signup;
