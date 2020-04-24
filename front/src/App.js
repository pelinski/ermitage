import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Favicon from 'react-favicon';

import './App.scss';

import { withAuthentication } from "./lib/withAuthentication"
import { Layout } from "./layouts/Layout"

import { HomePage } from "./pages/Home.page"
import { DashboardPage } from './pages/Dashboard.page';
import { FolderPage } from './pages/Folder.page';

import favicon from "./public/favicon.svg"



export const App = withAuthentication(() => (<>
  <Favicon url={favicon} />
  <Router>
    <Layout>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/:user/dashboard" component={props => <DashboardPage dashboardUsername={props.match.params.user} />} />
        <Route path="/:user/:folder" component={props => <FolderPage folder={props.match.params.folder} folderUsername={props.match.params.user} />} />
      </Switch>
    </Layout>
  </Router>
</>
));