import React from 'react';
import { Switch, Redirect, Route, } from 'react-router-dom';
import { Grid, colors } from '@material-ui/core';
import ReactLoading from 'react-loading';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';
import {
  UserList as UserListView,
  Account as AccountView,
  Settings as SettingsView,
  NotFound as NotFoundView,
} from './views';
import { isSignedIn } from './components/Auth/Auth';
import { SignIn } from './components/SignIn/SignIn';
import { SignUp } from './components/SignUp/SignUp';
import { loginStatus } from './util/enums';

import PdfReader from './views/PDF/PDF';

const Protokolle = () => { return <h1>Protokolle</h1> };

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: loginStatus.standby,
      updateCounter: 0
    };
  }

  updateStateIsSignedIn(isSignedIn) {
    this.setState({
      signedIn: isSignedIn
    });
  }

  componentDidMount() {
    isSignedIn(this.updateStateIsSignedIn.bind(this));
  }

  render() {
    if (this.state.signedIn === loginStatus.signedIn) {
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
            component={PdfReader}
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
    } else if (this.state.signedIn === loginStatus.signedOut) {
      return (
        <Switch>
          <Route path="/signin">
            <SignIn updateStateIsSignedIn={this.updateStateIsSignedIn.bind(this)}/>
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Redirect to="/signin" />
        </Switch>
      );
    } else {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <img
            alt="wappen.svg"
            src="/images/logos/logo--white.svg"
            width="400"
          />
          <ReactLoading type="spinningBubbles" color={colors.green[600]} height={40} width={40} />
        </Grid>
      );
    }
  }
}
