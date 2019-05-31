import React, { Component } from 'react';
import './App.css';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import moment from "moment-timezone";


class Medicine extends Component {
    constructor (props){
        super(props)

        this.state = {
            color: '',
            open: false,
            textFieldValue: '',
            cancel: '',
            showReward: false,
            hide: true
        }

        this.changeColor = this.changeColor.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.resetCheck = this.resetCheck.bind(this);

        this.server = "http://localhost:5000";
    }

    /* COMPONENT DID MOUNT
     *
     * Determines if medicine has been taken today or not.
     * If not, the medicine checkoff will be colored white.
     * If yes, the medicine checkoff will be colored green.
     */
    componentDidMount(){
      var today = new Date();
      let getDate = moment(today).tz("America/New_York").format("YYYY/MM/DD");

      fetch(this.server + "/getDate?name=" + this.props.med, {
          mode: 'cors',
          credentials: 'include',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
      })
      .then(res => res.json())
      .then(data => {

        var dates = []

        if (typeof data[0] != 'undefined'){
          for (var x in data[0].dates){
              var d = data[0].dates[x];
              let momentd = moment(new Date(d)).tz("America/New_York").format('YYYY/MM/DD')
              dates.push(momentd);
          }
        }

        if (dates.includes(getDate)){
            return this.setState({color: '#6ADC83'})
        }
        else {
          this.resetCheck();
          return this.setState({color: 'white'})
        }
      });
    }

    resetCheck(){
      fetch(this.server + "/resetCheck", {
          mode: 'cors',
          credentials: 'include',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
            body: JSON.stringify({
              medicine: this.props.med,
            })
          });
    }

    /* Handles changes in password field value. */
    handleTextFieldChange(e) {
      this.setState({
          textFieldValue: e.target.value
      });
    }

    /* Change color of circle if medication has been checked off. */
    changeColor(){
        // do not pop up dialog if the circle is checked again.
        if (this.state.color === '#6ADC83'){
            return;
        }

        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today = moment(today).tz("America/New_York").format("YYYY/MM/DD");

        fetch(this.server + "/verifyPassword", {
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
              body: JSON.stringify({
                password: this.state.textFieldValue,
              })
            })
            .then(res => res.text())
            .then(data => {
              if (data === "Wrong password"){
                this.setState({hide: false});
                return;
              }

              if (data === "OK"){
                fetch(this.server + "/addDate", {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Credentials': true,
                    },
                      body: JSON.stringify({
                        medicine: this.props.med,
                          date: today,
                      })
                    })
                    .then(res => res.text())
                    .then(data => {
                      if (data === "equal"){
                        this.props.rerenderParentCallbackDates();

                        fetch(this.server + "/incrementReward", {
                            mode: 'cors',
                            credentials: 'include',
                            method: 'POST',
                            headers: {
                              'Accept': 'application/json',
                              'Content-Type': 'application/json',
                              'Access-Control-Allow-Credentials': true,
                            },
                            })
                            .then(res => res.text())
                            .then(data => {
                              if (data === "goal"){
                                this.props.rerenderParentCallbackReward();
                              }
                            });
                      }

              });

              var newColor = '#6ADC83';
              this.setState({color: newColor, open: false});
            }
          }).catch(err => {
            // handle err
            console.log(err)
          })

    }

  /* DIALOG METHODS FOR CHECKOFF. */
  handleClickOpen(){
    if (this.state.color !== '#6ADC83'){
      this.setState({ open: true });
    }
  };

  handleCancel(){
    this.setState({ open: false });
    this.setState({ cancel: true });
  };

  handleOK(){
    this.changeColor();
    this.setState({ cancel: false });
  };



  render(){

    return (
    <div className="medicine-wrapper">
      <div className = "one-medicine">
          <Dialog
            open={this.state.open}
            onClose={this.handleCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">{"Please enter a password."}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                To check off your medication a password is required.
              </DialogContentText>
              <TextField
                  autoFocus
                  margin="dense"
                  // id="name"
                  label="Password"
                  value={this.state.textFieldValue} onChange={this.handleTextFieldChange}
                  type="password"
                  fullWidth
                />
            </DialogContent>
              <div className={this.state.hide ? 'hidden' : 'show'}>
                Your password is not correct.
              </div>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleOK} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
            <div className = "circly" onClick ={this.handleClickOpen} style ={{background: this.state.color}}> </div>
            <p className="medicine-title"> {this.props.med}</p>
          </div>
    </div>

    );
  }
}

export default Medicine;
