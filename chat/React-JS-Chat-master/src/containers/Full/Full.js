import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom'
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/'
import Conversations from '../../views/Conversations/'
import LoggedInAuthentication from  '../../views/Pages/Login/Login.js'


class Full extends Component {

  
  componentDidMount() {
    /*if(localStorage.getItem("loggedinUser") === null){
      window.location = "/#/login";
      return;
    }*/
    if(localStorage.loggedinUser != 'undefined'){
      console.log("userloggedin initializng chat");
      window.chatLogin();
    }
  }
  /*componentWillMount(){
    if(localStorage.loggedinUser !== 'undefined'){
      console.log("userloggedin initializng chat");
      window.chatLogin();

    }
  }
*/

   checkLogin() {
    var loggedIn = false;
    if (!localStorage.getItem('loggedinUser')) {
      <Redirect to="/#/login"/>
    }
  };

  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb />
            <div className="container-fluid">
              <Switch >

                <Route path="/dashboard" name="Dashboard"  component={Dashboard}/>
                <Route exact path="/conversations" name="Conversations" component={Conversations}/>
                <Redirect from="/" to="/login"/>

              </Switch>
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
