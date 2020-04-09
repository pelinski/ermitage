import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthentication } from "./lib/withAuthentication"
import Favicon from 'react-favicon';

import './App.scss';

import { Layout } from "./layouts/Layout"

import { HomePage } from "./pages/Home.page"
import { SignupPage } from "./pages/Signup.page"
import { LoginPage } from './pages/Login.page';
import { DashboardPage } from './pages/Dashboard.page';
import { AboutusPage } from './pages/Aboutus.page';
import { FolderPage } from './pages/Folder.page';

import favicon from "./public/favicon.svg"



export const App = withAuthentication(() => (<>
  <Favicon url={favicon} />
  <Router>
    <Layout>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/aboutus" component={AboutusPage} />
        <Route path="/:user/dashboard" component={DashboardPage} />
        <Route path="/:user/:folder" component={props => <FolderPage folder={props.match.params.folder} />} />
      </Switch>
    </Layout>
  </Router>
  </>
));