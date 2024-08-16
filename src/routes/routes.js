import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import Login from '../containers/Login';
import Register from '../containers/Register';
import Home from '../containers/Home';
import PrivateRoute from './private-route'
import Products from '../containers/Products';


function Routes() {
  return (
    <Router>
      <Switch>
        <Route component={Login} path='/login' />
        <Route component={Register} path='/cadastro' />
        <PrivateRoute exact component={Home} path='/' />
        <PrivateRoute component={Products} path='/produtos' />
      </Switch> 
    </Router>
  );
}

export default Routes;
