import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history';

// Containers
import Full from './containers/Full/'

// Views


import  './components/Aside/Aside.js';


import Login from './views/Pages/Login/Login'


const history = createBrowserHistory();

ReactDOM.render((
  <HashRouter history={history}>
    <Switch>
      <Route exact path="/login" name="Login Page" component={Login}/>
      <Route path="/" name="Home" component={Full}/>
    </Switch>
  </HashRouter>
), document.getElementById('root'))
