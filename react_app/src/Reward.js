import React, { Component } from 'react';
import './Reward.css';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class Reward extends Component {
  constructor(props) {
    super(props);

    this.state = {
      desc: '',
      days: "1",
      path: '',
    }
    this.onChange = this.onChange.bind(this);
    this.focusByID = this.focusByID.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.server = "http://localhost:5000";
  }

  /* STATE CHANGE FUNCTION. */
  onChange(e) {
       this.setState({
           [e.target.name]: e.target.value
       });
   }

   handleChange (e){
     this.setState({days: e.target.value})
   }

  /* Creates reward when the user presses ok. */
  handleSubmit(){
    if (this.state.path === ''){
      Alert.error('Pick a reward!', {
      position: 'top',
      effect: 'jelly',
      beep: false,
      timeout: 'none',
      offset: 150
      });
    }
    else {
      document.getElementById(this.state.path).focus()

      fetch(this.server + "/createReward", {
          mode: 'cors',
          credentials: 'include',
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
          },
            body: JSON.stringify({
              goalCount: this.state.days,
              desc: this.state.desc,
              img_path: this.state.path
            })
          })
          .then(res => res.json())
          .then(data => {
            this.props.history.push("/profile");
          });
    }
  }

  /* Set focus on an image. */
  focusByID(id, url){
        document.getElementById(id).focus()
        this.setState({path: url});
  }


  render() {
    return (
      <div className = "reward-container">
        <div className = "reward-card">
          <div className = "reward-selection-title">
            Reward Selection
            <div className = "time-to-set">
              <p> It's time to set another reward!</p>
            </div>
            </div>
        </div>

        <div className = "goal">


            <div className = "inner-goal">

              <div className="reward-desc">
                <p> Description: </p>
                <input type="text" id ="reward-desc-input" name ="desc" value={this.state.desc} onChange={this.onChange} />
              </div>

              <div className="reward-days">
                <p> Goal (in number of days): </p>
                <div className="select-reward">
                  <select value={this.state.days} onChange={this.handleChange}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                  </select>
                </div>

              </div>
            </div>
          </div>


          <div className = "reward-choose">
            <p> Choose your reward: </p>
          </div>

          <div className = "reward-library">
            <div className = "reward-box" tabIndex="0" id="icecream"
            onClick={() => this.focusByID('icecream', 'icecream')}>
              <img src={require("./images/rewards/icecream.png")} alt="icecream"
              width="80" height="80"/>
              </div>

            <div className = "reward-box" tabIndex="0" id="bowling"
            onClick={() => this.focusByID('bowling', 'bowling')}>
              <img src={require("./images/rewards/bowling.png")} alt="bowling"
              width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="baking"
            onClick={() => this.focusByID('baking', 'baking')}>
            <img src={require("./images/rewards/baking.png")} alt="baking"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="beach"
            onClick={() => this.focusByID('beach', 'beach')}>
            <img src={require("./images/rewards/beach.png")} alt="beach"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="book"
            onClick={() => this.focusByID('book', 'book')}>
            <img src={require("./images/rewards/book.png")} alt="book"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="card"
            onClick={() => this.focusByID('card', 'card')}>
            <img src={require("./images/rewards/card.png")} alt="card"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="carnival"
            onClick={() => this.focusByID('carnival', 'carnival')}>
            <img src={require("./images/rewards/carnival.png")} alt="carnival"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="chess"
            onClick={() => this.focusByID('chess', 'chess')}>
            <img src={require("./images/rewards/chess.png")} alt="chess"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="fire"
            onClick={() => this.focusByID('fire', 'fire')}>
            <img src={require("./images/rewards/fire.png")} alt="fire"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="game"
            onClick={() => this.focusByID('game', 'game')}>
            <img src={require("./images/rewards/game.png")} alt="game"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="gift"
            onClick={() => this.focusByID('gift', 'gift')}>
            <img src={require("./images/rewards/gift.png")} alt="gift"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="hamburger"
            onClick={() => this.focusByID('hamburger', 'hamburger')}>
            <img src={require("./images/rewards/hamburger.png")} alt="hamburger"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="hotdog"
            onClick={() => this.focusByID('hotdog', 'hotdog')}>
            <img src={require("./images/rewards/hotdog.png")} alt="hotdog"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="pizza"
            onClick={() => this.focusByID('pizza', 'pizza')}>
            <img src={require("./images/rewards/pizza.png")} alt="pizza"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="makeup"
            onClick={() => this.focusByID('makeup', 'makeup')}>
            <img src={require("./images/rewards/makeup.png")} alt="makeup"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="movies"
            onClick={() => this.focusByID('movies', 'movies')}>
            <img src={require("./images/rewards/movies.png")} alt="movies"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="picnic"
            onClick={() => this.focusByID('picnic', 'picnic')}>
            <img src={require("./images/rewards/picnic.png")} alt="picnic"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="shopping"
            onClick={() => this.focusByID('shopping', 'shopping')}>
            <img src={require("./images/rewards/shopping.png")} alt="shopping"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="puzzle"
            onClick={() => this.focusByID('puzzle', 'puzzle')}>
            <img src={require("./images/rewards/puzzle.png")} alt="puzzle"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="teddy"
            onClick={() => this.focusByID('teddy', 'teddy')}>
            <img src={require("./images/rewards/teddy.png")} alt="teddy"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="tennis"
            onClick={() => this.focusByID('tennis', 'tennis')}>
            <img src={require("./images/rewards/tennis.png")} alt="tennis"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="sneakers"
            onClick={() => this.focusByID('sneakers', 'sneakers')}>
            <img src={require("./images/rewards/sneakers.png")} alt="sneakers"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="clothes"
            onClick={() => this.focusByID('clothes', 'clothes')}>
            <img src={require("./images/rewards/clothes.png")} alt="clothes"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="jewelry"
            onClick={() => this.focusByID('jewelry', 'jewelry')}>
            <img src={require("./images/rewards/jewelry.png")} alt="jewelry"
            width="90" height="90"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="kart"
            onClick={() => this.focusByID('kart', 'kart')}>
            <img src={require("./images/rewards/kart.png")} alt="kart"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="ball"
            onClick={() => this.focusByID('ball', 'ball')}>
            <img src={require("./images/rewards/ball.png")} alt="ball"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="bike"
            onClick={() => this.focusByID('bike', 'bike')}>
            <img src={require("./images/rewards/bike.png")} alt="bike"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="ferris"
            onClick={() => this.focusByID('ferris', 'ferris')}>
            <img src={require("./images/rewards/ferris.png")} alt="ferris"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="paint"
            onClick={() => this.focusByID('paint', 'paint')}>
            <img src={require("./images/rewards/paint.png")} alt="paint"
            width="80" height="80"/>
            </div>

            <div className = "reward-box" tabIndex="0" id="swimming"
            onClick={() => this.focusByID('swimming', 'swimming')}>
            <img src={require("./images/rewards/swimming.png")} alt="swimming"
            width="80" height="80"/>
            </div>
        </div>

        <div className = "footer-reward">
          <div className= "ok-button">
            <input type = "submit" value="Okay" id = "OK" onClick = {this.handleSubmit}/>
          </div>
        </div>

        <Alert stack={{limit: 2}} />
      </div>
    );
  }
}

export default Reward;
