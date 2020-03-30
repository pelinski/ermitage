import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthentication } from "./lib/protectRoute.hoc"

import './App.css';

import { Layout } from "./layouts/Layout"

import { HomePage } from "./pages/Home.page"


export const App = withAuthentication(() => (
  <Router>
    <Layout>
      <Switch>
        <Route path="/" exact component={HomePage} />
      </Switch>
    </Layout>
  </Router>
));