import React, { Component } from 'react';
import  '../../../components/Aside/Aside.js';
import axios from 'axios';
import validator from 'validator';
import {Modal} from 'react-bootstrap';
import  {Button}  from 'react-bootstrap';
import Dropdown from 'react-dropdown';
import {SplitButton, MenuItem} from 'react-bootstrap';


class Login extends Component {

constructor(props){
  super(props);
  this.state = {
    userid: '',
    password:'',
    applicationKey:''
  };
this.handleClick = this.handleClick.bind(this);
}

   componentWillMount(){
    if(localStorage.getItem("loggedinUser")){
      console.log("Login page");
        window.location="/#/dashboard";
    }
   }

   handleClick (event){
   event.preventDefault();
   var userId =this.state.userId;
   var applicationKey=this.state.applicationKey?this.state.applicationKey:"applozic-sample-app";
   var password =this.state.password;
   localStorage.setItem("loggedinUser", userId);
   localStorage.setItem("applicationId", applicationKey);
   localStorage.setItem("password",password);
   console.log("Login page udesr");

   window.location="/#/dashboard";

        }


  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card-group mb-0">
                <div className="card p-4">
                  <div className="card-block">
                    <h1></h1>
                    <p className="text-muted"></p>
                    <div className="input-group mb-3" >
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                       <input type="text" className="form-control" placeholder="ApplicationKey" onChange = {(event) => this.setState({applicationKey:event.target.value})} />

                    </div>
                    <div className="input-group mb-3" >
                      <span className="input-group-addon"><i className="icon-user"></i></span>
                       <input type="text" className="form-control" placeholder="Username" onChange = {(event) => this.setState({userId:event.target.value})} />

                    </div>

                    <div className="input-group mb-4">
                      <span className="input-group-addon"><i className="icon-lock"></i></span>
                      <input type="password" className="form-control" placeholder="Password"onChange = {(event) => this.setState({password:event.target.value})} />
                    </div>

                    <div className="row">
                      <div className="col-3">
                        <button id="login-button" type="button" className="btn btn-primary px-3 km-login-btn" onClick={(event) => this.handleClick(event)}>login</button>
                      </div>
                      <div className="col-3 text-left" >

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
