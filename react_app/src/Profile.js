import React, { Component } from 'react';
import './Profile.css';

// foreign imports
import Button from '@material-ui/core/Button';
import ChangeMedicine from './ChangeMedicine';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// imgs
import footerHome from "./images/icons/web-page-home.png";
import footerProfile from "./images/icons/iconsmile.png";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allMedicine: [],
      addOpen: false,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      medicine: '',
      medDesc: '',
      reward_array: [],
      username:'',
      avatar_path: '',
      navColor: ''
    }

    /* dialog methods */
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOKAdd = this.handleOKAdd.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);

    /* change methods */
    this.onCheck = this.onCheck.bind(this);
    this.onChange = this.onChange.bind(this);

    /* rerouting methods */
    this.goHome = this.goHome.bind(this);
    this.goReward = this.goReward.bind(this);
    this.goAvatar = this.goAvatar.bind(this);

    /* image accessor methods */
    this.getImage = this.getImage.bind(this);
    this.getAvatar = this.getAvatar.bind(this);

    /* logout method */
    this.handleLogout = this.handleLogout.bind(this);

    /* rerender method */
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);

    this.REWARDS = {
      icecream: require('./images/rewards/icecream.png'),
      baking: require('./images/rewards/baking.png'),
      ball: require('./images/rewards/ball.png'),
      beach: require('./images/rewards/beach.png'),
      bike: require('./images/rewards/bike.png'),
      book: require('./images/rewards/book.png'),
      bowling: require('./images/rewards/bowling.png'),
      card: require('./images/rewards/card.png'),
      carnival: require('./images/rewards/carnival.png'),
      chess: require('./images/rewards/chess.png'),
      clothes: require('./images/rewards/clothes.png'),
      ferris: require('./images/rewards/ferris.png'),
      fire: require('./images/rewards/fire.png'),
      game: require('./images/rewards/game.png'),
      gift: require('./images/rewards/gift.png'),
      hamburger: require('./images/rewards/hamburger.png'),
      hotdog: require('./images/rewards/hotdog.png'),
      jewelry: require('./images/rewards/jewelry.png'),
      kart: require('./images/rewards/kart.png'),
      makeup: require('./images/rewards/makeup.png'),
      movies: require('./images/rewards/movies.png'),
      paint: require('./images/rewards/paint.png'),
      picnic: require('./images/rewards/picnic.png'),
      pizza: require('./images/rewards/pizza.png'),
      puzzle: require('./images/rewards/puzzle.png'),
      shopping: require('./images/rewards/shopping.png'),
      sneakers: require('./images/rewards/sneakers.png'),
      swimming: require('./images/rewards/swimming.png'),
      teddy: require('./images/rewards/teddy.png'),
      tennis: require('./images/rewards/tennis.png')
    }

    this.AVATARS = {
      bunny: require('./images/avatars/bunny.png'),
      cat: require('./images/avatars/cat.png'),
      dinosaur: require('./images/avatars/dinosaur.png'),
      dog: require('./images/avatars/dog.png'),
      frog: require('./images/avatars/frog.png'),
      monkey: require('./images/avatars/monkey.png'),
      panda: require('./images/avatars/panda.png'),
      penguin: require('./images/avatars/penguin.png'),
      raccoon: require('./images/avatars/raccoon.png'),
      unicorn: require('./images/avatars/unicorn.png'),
    }

      this.server = "http://localhost:5000";
  }

  /* Accessor for the reward images. */
  getImage(name) {
    return this.REWARDS[name];
  }

  /* Accessor for the avatar images. */
  getAvatar(name) {
    return this.AVATARS[name];
  }

  /* Rerender profile medicine when medication is edited, deleted, or added. */
  rerenderParentCallback(){
    this.getProfileMedicine();
  }

   /* DYNAMICALLY CHANGING STATE FUNCTIONS  */
  onChange(e) {
       this.setState({
           [e.target.name]: e.target.value
       });
   }

   onCheck(e) {
     this.setState({
         [e.target.name]: e.target.checked
     });
   }

   /* DIALOG FUNCTIONS */
   handleCancel() {
     this.setState({ addOpen: false });
   };

   handleClickOpen(){
     this.setState({ addOpen: true });
   };

   /* Method for adding a new medication. */
   handleOKAdd(){
     fetch(this.server + "/addMedicine", {
         mode: 'cors',
         credentials: 'include',
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'Access-Control-Allow-Credentials': true,
         },
           body: JSON.stringify({
             medicine: this.state.medicine,
             medDesc: this.state.medDesc,
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
           this.getProfileMedicine();

           this.setState({medicine: '', medDesc: '',
           sunday: false, monday:false, tuesday: false, wednesday:false, thursday:false, friday:false, saturday:false,
           addOpen: false})
         });
   }

  /* ROUTES */
  goHome(){
    // go /home
    this.props.history.push("/home");
  }

  goAvatar(){
    // go /avatar
    this.props.history.push("/avatar");
  }

  goReward(){
    // go /reward
    this.props.history.push("/reward");
  }

  /* COMPONENT DID MOUNT
   *
   * Gets the medicines, avatars, and rewards for the user.
   */
  componentDidMount(){
    this.setState({navColor: "#1871ff"});

    fetch(this.server + "/getProfileMedicine", {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({allMedicine: data})
    });

    fetch(this.server + "/getAvatar", {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      }
    })
    .then(res => res.json())
    .then(data => {
      if (typeof data != 'undefined' && data !== null){
          this.setState({username: data.username, avatar: data.avatar_path});
      }
    });
    fetch(this.server + "/getReward", {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      }
    })
    .then(res => res.json())
    .then(data => {
      if (typeof data[0] != 'undefined'){
          this.setState( {reward_array: data[0]} )
      }
    });
  }

  /*
   * Handles when a user logs out.
   * Redirects to the home page once logged out.
   */
  handleLogout() {
      fetch(this.server + "/logout", {
          mode: 'cors',
          credentials: 'include',
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
          }
      })
          .then(res => res.text())
          .then(data => {
              if (data === "redirect"){
                  this.props.history.push("/")
              }
          });
  }

  /*
   * Fetches all medicines associated with the user from the database.
   */
  getProfileMedicine(){
    fetch(this.server + "/getProfileMedicine", {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({allMedicine: data})
    });
  }

  /* RENDER METHODS */

  /*
   * Renders user conditionally.
   * If no avatar, renders an empty circle.
   * Else, shows their avatar.
   */
  renderUser(){
    if (this.state.avatar !== "" && typeof this.state.avatar !== 'undefined'){
      var thumbnail = this.getAvatar(this.state.avatar);

      return ( <div className="avatarWrapper"> <img src={thumbnail} alt="thumbnail" width="160" height="160" onClick ={this.goAvatar}/> </div>);
    }
    else{
      return (<div id = "circle" onClick ={this.goAvatar}> <span>click to edit your avatar!</span></div>);
    }
  }

  // helper method to render medications.
  getMedList(){
    return (this.state.allMedicine.map((data, index) => {
      return (<ChangeMedicine key= {index} med={data.medicine} desc={data.description}
              sunday={data.sunday} monday={data.monday} tuesday={data.tuesday}
              wednesday={data.wednesday} thursday={data.thursday} friday={data.friday}
              saturday={data.saturday}
              rerenderParentCallback={this.rerenderParentCallback}/>) })
      );
  }

  /*
   * Renders medication conditionally.
   * If no medication associated with the user, displays a message.
   * Else, shows the medications that the user has.
   */
  renderAllMedicine(){
    if (this.state.allMedicine.length === 0){
      return (
        <div className = "med-container">
          <div className = "deargod-med">
            <div className="deargod-top" id="medicationNoneTop">
              <p className="deargodTopTitle" id="med">
                My Medication
              </p>
            </div>
            <p id="notif"> There is no medication currently linked to your account. </p>
            <Button id = "editbutton" variant="outlined" onClick ={this.handleClickOpen}>
              + Add medications
            </Button>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="med-container">
          <div className = "deargod-med">
              <div className="deargod-top" id="medicationNoneTop">
                  <p className="deargodTopTitle" id="med">
                      My Medication
                  </p>
              </div>

            {this.getMedList()}

            <Button id = "editbutton" variant="outlined" onClick ={this.handleClickOpen}>
              + Add medications
            </Button>
          </div>
        </div>
      );
    }
  }

  /*
   * Renders reward conditionally.
   * If no reward associated with the user, displays a message.
   * Else, shows the reward that the user has.
   */
  renderReward(){
    if (this.state.reward_array.length === 0 ){
      return (
        <div className = "rewards-container">
          <div className = "deargod-rewards" id="rewardsNone">
            <div className="deargod-top">
              <p className="deargodTopTitle">
                My Current Reward
              </p>
            </div>
              <p id="notif"> You don't have any ongoing rewards.</p>
              <Button id = "editbutton" variant="outlined" onClick = {this.goReward}>
                + Create a new reward
              </Button>
          </div>
        </div>
      );
    }
    else {
      var thumbnail = this.getImage(this.state.reward_array.img_path);

      return (
        <div className="rewards-container">
          <div className = "deargod-rewards">
            <div className="deargod-top">
              <p className="deargodTopTitle">
                My Current Reward
              </p>
            </div>
            <div className = "rewards-home-inner">
              <img src={thumbnail} alt="icecweam" width="60" height="60"/>
              <div className = "rewards-home-info">
                <p>Description: <span>{this.state.reward_array.desc}</span></p>
                <p>You have <span>{this.state.reward_array.goalCount - this.state.reward_array.actualCount} </span> day(s) left until
                  you reach your reward for <span> {this.state.reward_array.img_path}</span>!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className = "containerProfile">

        <Dialog
          open={this.state.addOpen}
          onClose={this.handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Add medication"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please enter the following information.
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
                        label="Sunday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.monday}
                          onChange={this.onCheck}
                          name="monday"
                          />
                        }
                        label="Monday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.tuesday}
                          onChange={this.onCheck}
                          name="tuesday"
                          />
                        }
                        label="Tuesday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.wednesday}
                          onChange={this.onCheck}
                          name="wednesday"
                          />
                        }
                        label="Wednesday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.thursday}
                          onChange={this.onCheck}
                          name="thursday"
                          />
                        }
                        label="Thursday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.friday}
                          onChange={this.onCheck}
                          name="friday"
                          />
                        }
                        label="Friday"/>
                      <FormControlLabel
                        control={
                          <Checkbox
                          checked={this.state.saturday}
                          onChange={this.onCheck}
                          name="saturday"
                          />
                        }
                        label="Saturday"/>
              </FormGroup>
          </DialogContent>
          <div className="popup-button-wrapper">
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleOKAdd} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </div>
        </Dialog>


          <div className = "user">
            {this.renderUser()}
            <div id = "name">
              {this.state.username}
            </div>
          </div>

          {this.renderAllMedicine()}

          {this.renderReward()}

          <div className="logout">
              <input type="submit" value="Logout" id ="submitButton" onClick ={this.handleLogout}/>
          </div>

          <div className="footer" style={{boxShadow: this.state.scroll}} onScroll={this.handleScroll}>
            <div className="toHome" onClick = {this.goHome}>
              <img src={footerHome} alt="footer-home"></img>
              <p >home</p>
            </div>
            <div className="toProfile">
              <img src={footerProfile} alt="footer-profile" style={{backgroundColor: this.state.navColor}}/>
              <p style={{color: this.state.navColor}}>me</p>
            </div>
          </div>

      </div>
    );
  }
}

export default Profile;
