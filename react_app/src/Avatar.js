import React, { Component } from 'react';
import './Avatar.css';

import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

class Avatar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: ''
        }
        this.onChange = this.onChange.bind(this);
        this.focusByID = this.focusByID.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.server = "http://localhost:5000";
    }

    /* Methods to change state of different variables dynamically. */
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    /* Methods to change state of different variables dynamically. */
    handleChange (e){
        this.setState({days: e.target.value})
    }

    /* Registers the avatar for the user. */
    handleSubmit(){
      if (this.state.path === ''){
        Alert.info('Pick an avatar!', {
        position: 'top',
        effect: 'jelly',
        beep: false,
        timeout: 'none',
        offset: 150
        });
      }
      else {
        document.getElementById(this.state.path).focus()

        fetch(this.server + "/createAvatar", {
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                img_path: this.state.path
            })
        })
        .then(res => res.text())
        .then(data => {
            this.props.history.push("/profile");
        });
      }

    }

    /* Focuses by on avatar by its id. */
    focusByID(id){
        document.getElementById(id).focus()
        this.setState({path: id});
    }


    render() {
        return (
            <div className = "avatar-container">

                <div className = "avatar-selection-title">
                  Avatar Selection
                </div>

                <div className = "avatar-selection">
                    <p> Pick out your avatar! </p>
                </div>

                <div className = "avatar-library">
                    <div className = "avatar-box" tabIndex="0" id="dog"
                         onClick={() => this.focusByID('dog')}>
                        <img src={require("./images/avatars/dog.png")} alt="dog"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="cat"
                         onClick={() => this.focusByID('cat')}>
                        <img src={require("./images/avatars/cat.png")} alt="cat"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="panda"
                         onClick={() => this.focusByID('panda')}>
                        <img src={require("./images/avatars/panda.png")} alt="panda"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="monkey"
                         onClick={() => this.focusByID('monkey')}>
                        <img src={require("./images/avatars/monkey.png")} alt="monkey"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="dinosaur"
                         onClick={() => this.focusByID('dinosaur')}>
                        <img src={require("./images/avatars/dinosaur.png")} alt="dinosaur"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="unicorn"
                         onClick={() => this.focusByID('unicorn')}>
                        <img src={require("./images/avatars/unicorn.png")} alt="unicorn"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="frog"
                         onClick={() => this.focusByID('frog')}>
                        <img src={require("./images/avatars/frog.png")} alt="frog"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="raccoon"
                         onClick={() => this.focusByID('raccoon')}>
                        <img src={require("./images/avatars/raccoon.png")} alt="raccoon"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="bunny"
                         onClick={() => this.focusByID('bunny')}>
                        <img src={require("./images/avatars/bunny.png")} alt="bunny"/>
                    </div>
                    <div className = "avatar-box" tabIndex="0" id="penguin"
                         onClick={() => this.focusByID('penguin', 'penguin')}>
                        <img src={require("./images/avatars/penguin.png")} alt="penguin"/>
                    </div>
                </div>

                <div className = "footer-avatar">
                    <div className= "ok-button">
                        <input type = "submit" value="Okay" id = "avatar-OK" onClick = {this.handleSubmit}/>
                    </div>
                </div>

                <Alert stack={{limit: 2}} />
            </div>
        );
    }
}

export default Avatar;
