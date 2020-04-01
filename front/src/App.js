import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthentication } from "./lib/withAuthentication"

import './App.scss';

import { Layout } from "./layouts/Layout"

import { HomePage } from "./pages/Home.page"
import { SignupPage } from "./pages/Signup.page"
import { LoginPage } from './pages/Login.page';


export const App = withAuthentication(() => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </Layout>
  </Router>
));