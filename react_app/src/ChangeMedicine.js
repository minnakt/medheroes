import React, { Component } from 'react';
import './ChangeMedicine.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';


class ChangeMedicine extends Component {
    constructor (props){
        super(props)

        this.state = {
          password: '',
          medicine: this.props.med,
          medDesc: this.props.desc,
          editOpen: false,
          deleteOpen: false,
          sunday: this.props.sunday,
          monday: this.props.monday,
          tuesday: this.props.tuesday,
          wednesday: this.props.wednesday,
          thursday: this.props.thursday,
          friday: this.props.friday,
          saturday: this.props.saturday,
          hide: true
        }

        this.handleCancelEdit = this.handleCancelEdit.bind(this);
        this.handleOKEdit = this.handleOKEdit.bind(this);
        this.handleClickOpenEdit = this.handleClickOpenEdit.bind(this);
        this.handleCancelDelete = this.handleCancelDelete.bind(this);
        this.handleOKDelete = this.handleOKDelete.bind(this);
        this.handleClickOpenDelete = this.handleClickOpenDelete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCheck = this.onCheck.bind(this);

        this.server = "http://localhost:5000";
    }

    /* Methods to change state of different variables dynamically. */
    onChange(e) {
         this.setState({
             [e.target.name]: e.target.value
         });
     }

     /* Methods to change state of checkboxes dynamically. */
     onCheck(e) {
       this.setState({
           [e.target.name]: e.target.checked
       });
     }

    /* Method that handles deleting the medication */
    deleteMedication(){
      fetch(this.server + "/deleteMedication", {
          mode: 'cors',
          credentials: 'include',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
            body: JSON.stringify({
              password: this.state.password,
              medicine: this.props.med
            })
          })
          .then(res => res.text())
          .then(data => {
            if (data === "Wrong password"){
              this.setState({hide: false});

            }
            else{
              this.props.rerenderParentCallback();
              this.setState({ deleteOpen: false, password: '' });
            }
          });
    }

    /* Method that handles editing the medication. */
    editMedication(){
      fetch(this.server + "/editMedication", {
          mode: 'cors',
          credentials: 'include',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
            body: JSON.stringify({
              password: this.state.password,
              medicine: this.props.med,
              update: this.state.medicine,
              description: this.state.medDesc,
              sunday: this.state.sunday,
              monday: this.state.monday,
              tuesday: this.state.tuesday,
              wednesday: this.state.wednesday,
              thursday: this.state.thursday,
              friday: this.state.friday,
              saturday: this.state.saturday
            })
          })
          .then(res => res.text())
          .then(data => {
            this.props.rerenderParentCallback();
          });
    }

    /* Dialog Delete handlers */
    handleCancelDelete() {
      this.setState({ deleteOpen: false });
    };

    handleClickOpenDelete(){
      this.setState({ deleteOpen: true });
    };

    handleOKDelete(){
      this.deleteMedication();

    };

    /* Dialog Edit handlers*/
    handleCancelEdit() {
      this.setState({ editOpen: false });
    };

    handleClickOpenEdit(){
      this.setState({ editOpen: true });
    };

    handleOKEdit(){
      this.editMedication();
      this.setState({ editOpen: false });
    };

  render(){

    return(
      <div className = "single-medicine">

        <Dialog
          open={this.state.editOpen}
          onClose={this.handleCancelEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Edit medication"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please enter the changes to your medication.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Medication"
                name="medicine"
                value={this.state.medicine} onChange={this.onChange}
                fullWidth
              />
              <TextField
                  autoFocus
                  margin="dense"
                  label="Description"
                  name="medDesc"
                  value={this.state.medDesc} onChange={this.onChange}
                  fullWidth
                />
                <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.sunday}
                          onChange={this.onCheck}
                          name="sunday"
                          />
                        }
                        label="Sunday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.monday}
                          onChange={this.onCheck}
                          name="monday"
                          />
                        }
                        label="Monday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.tuesday}
                          onChange={this.onCheck}
                          name="tuesday"
                          />
                        }
                        label="Tuesday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.wednesday}
                          onChange={this.onCheck}
                          name="wednesday"
                          />
                        }
                        label="Wednesday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.thursday}
                          onChange={this.onCheck}
                          name="thursday"
                          />
                        }
                        label="Thursday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.friday}
                          onChange={this.onCheck}
                          name="friday"
                          />
                        }
                        label="Friday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.saturday}
                          onChange={this.onCheck}
                          name="saturday"
                          />
                        }
                        label="Saturday"
                      />
              </FormGroup>
          </DialogContent>
          <div className="popup-button-wrapper">
            <DialogActions>
              <Button onClick={this.handleCancelEdit} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleOKEdit} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </div>
        </Dialog>

        <Dialog
          open={this.state.deleteOpen}
          onClose={this.handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Delete medication"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please enter your password to delete the medication.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Password"
                name="password"
                value={this.state.password} onChange={this.onChange}
                type="password"
                fullWidth
              />
          </DialogContent>
              <div className={this.state.hide ? 'hidden' : 'show'}>
                Your password is not correct.
              </div>
          <DialogActions>
            <Button onClick={this.handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOKDelete} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <div className = "medicine-top-bar">

          <div className="med-title-wrapper">
            <img className="icon-med" src={require("./images/icons/Pill.png")}
              alt="pill"/>
            <p className="medicine-title"> {this.props.med}</p>
          </div>

          <div className="med-edit-wrapper">
            <img className="icon-edit"  src={require("./images/icons/editicon.png")} onClick={this.handleClickOpenEdit}
            alt="edit med icon"/>
            <img className="icon-delete" src={require("./images/icons/trashicon.png")} onClick={this.handleClickOpenDelete}
            alt="delete med icon"/>
          </div>

        </div>

        <div className="med-bottom-wrapper">
          <p className="medicine-desc"> {this.props.desc} </p>
        </div>

      </div>
    );
  }
}

export default ChangeMedicine;
