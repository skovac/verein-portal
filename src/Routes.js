import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { Grid, colors } from '@mui/material';
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
        <RouterRoutes>
          <Route path="/" element={<Navigate to="/profil" replace />} />
          <Route path="/signin" element={<Navigate to="/profil" replace />} />
          <RouteWithLayout
            component={AccountView}
            layout={MainLayout}
            path="/profil"
          />
          <RouteWithLayout
            component={UserListView}
            layout={MainLayout}
            path="/mitglieder"
          />
          <RouteWithLayout
            component={PdfReader}
            layout={MainLayout}
            path="/tz"
          />
          <RouteWithLayout
            component={Protokolle}
            layout={MainLayout}
            path="/protokolle"
          />
          <RouteWithLayout
            component={SettingsView}
            layout={MainLayout}
            path="/einstellungen"
          />
          <RouteWithLayout
            component={NotFoundView}
            layout={MinimalLayout}
            path="/not-found"
          />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </RouterRoutes>
      );
    } else if (this.state.signedIn === loginStatus.signedOut) {
      return (
        <RouterRoutes>
          <Route path="/signin" element={<SignIn updateStateIsSignedIn={this.updateStateIsSignedIn.bind(this)}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </RouterRoutes>
      );
    } else {
      return (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
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
