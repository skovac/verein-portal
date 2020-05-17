import React from 'react';
import { Switch, Redirect, Route, } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  UserList as UserListView,
  Account as AccountView,
  Settings as SettingsView,
  NotFound as NotFoundView
} from './views';

import { isSignedIn } from './components/Auth/Auth';
import { SignIn } from './components/SignIn/SignIn';
import { SignUp } from './components/SignUp/SignUp';

const TeutonenZeitung = () => { return <h1>TZ</h1> };
const Protokolle = () => { return <h1>Protokolle</h1> };

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: isSignedIn(),
    };
  }
  
  checkForAuth() {
    this.setState({
      signedIn: isSignedIn(),
    });
  }

  render() {
    if (this.state.signedIn) { 
      return (
        <Switch>
          <Redirect
            exact
            from="/"
            to="/profil"
          />
          <Redirect
            exact
            from="/signin"
            to="/profil"
          />
          <RouteWithLayout
            component={AccountView}
            exact
            layout={MainLayout}
            path="/profil"
          />
          <RouteWithLayout
            component={UserListView}
            exact
            layout={MainLayout}
            path="/mitglieder"
          />
          <RouteWithLayout
            component={TeutonenZeitung}
            exact
            layout={MainLayout}
            path="/tz"
          />
          <RouteWithLayout
            component={Protokolle}
            exact
            layout={MainLayout}
            path="/protokolle"
          />
          <RouteWithLayout
            component={SettingsView}
            exact
            layout={MainLayout}
            path="/einstellungen"
          />
          <RouteWithLayout
            component={NotFoundView}
            exact
            layout={MinimalLayout}
            path="/not-found"
          />
          <Redirect to="/not-found" />
        </Switch>
      );
    } else {
      return (
        <Switch>
          <Route path="/signin">
            <SignIn confirmLogin={this.checkForAuth.bind(this)}/>
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Redirect to="/signin" />
        </Switch>
      );
    }
  }
}
