import React, { Component } from 'react';
import './App.css';

// foreign imports
import Button from '@material-ui/core/Button';
import Medicine from './Medicine';
import Calendar from 'react-calendar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import moment from "moment-timezone";
import { BarLoader } from 'react-spinners';

// imgs
import footerHome from "./images/icons/iconhome.png";
import footerProfile from "./images/icons/smile.png"

class Home extends Component {
  constructor(props) {

    super(props);

    this.state = {
      medicine: '',
      medicine_array: [],
      reward_array: [],
      image: '',
      avatar:'',
      open: false,
      medDesc: '',
      Sunday: false,
      completed: null,
      username:'',
      medicine_render: false,
      scroll: '',
      navColor: "",
      showReward: false
    }

    /* dialog methods */
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOK = this.handleOK.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleOKReward = this.handleOKReward.bind(this);
    this.handleCancelReward = this.handleCancelReward.bind(this);

    /* render and rerendering methods */
    this.renderReward = this.renderReward.bind(this);
    this.renderMedicine = this.renderMedicine.bind(this);
    this.getMedList = this.getMedList.bind(this);
    this.rerenderParentCallbackReward = this.rerenderParentCallbackReward.bind(this);
    this.rerenderParentCallbackMedicine = this.rerenderParentCallbackMedicine.bind(this);
    this.rerenderParentCallbackDates = this.rerenderParentCallbackDates.bind(this);

    /* state changing methods */
    this.onCheck = this.onCheck.bind(this);
    this.onChange = this.onChange.bind(this);


    /* image accessor methods*/
    this.getImage = this.getImage.bind(this);
    this.getAvatar = this.getAvatar.bind(this);

    /* Scrolling, submission, and rerouting */
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToProfile = this.goToProfile.bind(this);

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

    this.HEADS = {
      bunny: require('./images/heads/bunny.png'),
      cat: require('./images/heads/cat.png'),
      dinosaur: require('./images/heads/dinosaur.png'),
      dog: require('./images/heads/dog.png'),
      frog: require('./images/heads/frog.png'),
      monkey: require('./images/heads/monkey.png'),
      panda: require('./images/heads/panda.png'),
      penguin: require('./images/heads/penguin.png'),
      raccoon: require('./images/heads/raccoon.png'),
      unicorn: require('./images/heads/unicorn.png'),
    }

    this.server = "http://localhost:5000";
  }

  /* COMPONENT DID MOUNT
   *
   * Gets the user's medication, reward, avatar, and completed days.
   */
  componentDidMount() {
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    today = moment(today).tz("America/New_York").format("YYYY/MM/DD");
    this.setState({navColor: "#1871ff"});

    fetch(this.server + "/getMedicine?date=" + today, {
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
      var thing = []
      for (var x in data){
        thing.push(data[x].medicine);
      }

      this.setState({medicine_array: thing})
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
          this.setState({reward_array: data[0], image: data[0].img_path })
      }
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


    fetch(this.server + "/getCompleted", {
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

      if (data.length !== 0){
        this.setState({completed: data[0].completed_dates })
      }
      else {
        this.setState({completed: []})
      }
    });
  }

  /* STATE CHANGING METHODS */
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


  /* IMAGE ACCESSORS */
  /* Accessor for the reward images. */
  getImage(name) {
    return this.REWARDS[name];
  }

  /* Accessor for the avatar images. */
  getAvatar(name) {
    return this.HEADS[name];
  }

  /* DIALOG HANDLERS */
  handleCancelReward() {
    this.setState({ showReward: false });
  };

  handleOKReward() {
    this.setState({ showReward: false, reward_array:[] });
  };

  handleCancel() {
    this.setState({ open: false });
  };

  handleClickOpen(){
    this.setState({ open: true });
  };

  handleOK(){
    this.setState({ open: false });
  };

  /* RERENDER METHODS */
  /* Show reward dialog. */
  rerenderParentCallbackReward(){
    this.setState({showReward: true});
  }

  /* IUpdate calendar days. */
  rerenderParentCallbackDates(){
    fetch(this.server + "/getCompleted", {
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
      if (data.length !== 0){
        this.setState({completed: data[0].completed_dates })
      }
      else {
        this.setState({completed: []})
      }
    });

  }

  /* Update medicine rerender. */
  rerenderParentCallbackMedicine(){
    this.setState({medicine_render: true});
  }

  /* ROUTING METHOD */
  goToProfile(event) {
    // go /profile
    this.props.history.push("/profile");
  }

  /* Adds medication for a user. Updates medicine list after added. */
  handleSubmit(event){
    event.preventDefault()
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    today = moment(today).tz("America/New_York").format("YYYY/MM/DD");

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
              medicine: this.state.medicine
            })
          })
          .then(res => res.text())
          .then(data => {

            fetch(this.server + "/getMedicine?date=" + today, {
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
              var thing = []
              for (var x in data){
                thing.push(data[x].medicine);
              }

              this.setState({medicine_array: thing})
            });
          }).catch(err => {
            // handle err
            console.log(err)
          })
  }


  /* METHODS USED IN RENDERING */

  /*
   * Renders user conditionally.
   * If no avatar, renders an empty circle.
   * Else, shows their avatar.
   */
  renderUser(){
    if (this.state.avatar !== "" && typeof this.state.avatar !== 'undefined'){
      var thumbnail = this.getAvatar(this.state.avatar);
      return ( <img src={thumbnail} alt="thumbnail" width="120" height="120"/> );
    }
    else{
      return (<div id = "circle"> </div>);
    }
  }

  // helper method to render medications
  getMedList(){
    return (this.state.medicine_array.map((data, index) => {
      return (<Medicine key= {index} med={data} rerenderParentCallbackReward={this.rerenderParentCallbackReward}
        rerenderParentCallbackMedicine={this.rerenderParentCallbackMedicine}
        rerenderParentCallbackDates={this.rerenderParentCallbackDates}
        />) })
    );
  }

  /*
   * Renders medicine conditionally.
   * If no medicine listed for today, renders message.
   * Else, shows the medications that they must take today.
   */
  renderMedicine(){
    if (this.state.medicine_array.length === 0){
      return (
        <div className="med-container">
        <div className="deargod-med">
          <div className="deargod-top" id="medicationNoneTop">
            <p className="deargodTopTitle" id="med">
              My Medication
            </p>
          </div>

            <p id="notif"> You don't have any medications for today.  </p>
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

              <div className="med-displayed-innner">
                {this.getMedList()}
              </div>
            </div>
          </div>
      );
    }
  }

  /*
   * Renders reward conditionally.
   * If no reward associated with the user, renders a message.
   * Else, shows the reward associated with the user.
   */
  renderReward(){
    if (this.state.reward_array.length === 0 ){
      return (
          <div className="rewards-container">
            <div className = "deargod-rewards" id="rewardsNone">
            <div className="deargod-top" id="medicationNoneTop">
              <p className="deargodTopTitle" id="med">
                Current Reward
              </p>
            </div>
                <p id="notif"> You don't have any ongoing rewards.</p>
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
                My Reward
              </p>
            </div>

            <div className = "rewards-home-inner">
              <img src={thumbnail} alt="thumbnail of reward" width="60" height="60"/>
              <div className = "rewards-home-info">
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

  /* Method for scrolling. */
  handleScroll() {
    this.setState({scroll: "none"});
  }

  render() {

      // highlights completed dates if they exist.
      if (this.state.completed === null || this.state.username === ""){
        return (
          <div className = "loading-container">
            <BarLoader sizeUnit={"px"} width ={200} height={8} size={500} color={'#01c13b'} />
            <div className="loading-text">Loading... </div>
          </div>);
      }
      else{
        const tileClassName = ({ date, view }) => {
         let getDate = moment(date).format("YYYY/MM/DD");

         if (this.state.completed.includes(getDate)){
           return "highlight-day";
         }
         return null;
       };
      return (
          <div className = "containerHome">
            <Dialog
              open={this.state.showReward}
              onClose={this.handleCancelReward}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title"><div className="rewards-popup-title">{"Congrats!"}</div></DialogTitle>
                <DialogContent>
                    <div className="rewards-popup-wrapper">
                      <div className="rewards-popup">You've reached your goal and can now receive your reward of
                        <span className="bold-this"> {this.state.reward_array.img_path}</span>!
                      </div>
                      <div className="rewards-popup-img"><img src={this.getImage(this.state.reward_array.img_path)} alt="thumbnail of reward"/></div>
                    </div>
                </DialogContent>
              <DialogActions>
                <Button onClick={this.handleOKReward} color="primary" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>

        <Dialog
          open={this.state.open}
          onClose={this.handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Please enter a password."}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              To check off your medication a password is required.
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
                <Checkbox
                  checked={this.state.Sunday}
                  onChange={this.onCheck}

                  name="Sunday"
                />
                <p> Sunday </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleOK} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <div className = "user">
          {this.renderUser()}
          <div id ="name">Hello, {this.state.username}!</div>
        </div>


        {this.renderMedicine()}

        {this.renderReward()}

        <div className="calendar-container">
          <div className="deargod-top" id="medicationNoneTop">
            <p className="deargodTopTitle" id="med">
              My History
            </p>
          </div>
        </div>

        <Calendar
            tileClassName={tileClassName}
            locale="en"
        />

        <div className="footer" style={{boxShadow: this.state.scroll}} onScroll={this.handleScroll}>
          <div className="toHome">
            <img src={footerHome} alt="footer-home" style={{backgroundColor: this.state.navColor}}/>
            <p style={{color: this.state.navColor}}>home</p>
          </div>
          <div className="toProfile" onClick = {this.goToProfile}>
            <img src={footerProfile} alt="footer-profile"/>
            <p>me</p>
          </div>
        </div>

      </div>
        );
    }
  }
}

export default Home;
