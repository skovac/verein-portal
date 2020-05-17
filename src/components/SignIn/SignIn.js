import React from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { colors, Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';

import { signIn } from '../../components/Auth/Auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const loginFailedErrorMessage = () => {
  return (
    <Box m={1} zIndex="tooltip" style={{ position: "fixed" }}>
      <Container maxWidth="sm">
        <MuiAlert severity="error" elevation={6} variant="filled">
          Das Passwort oder die Email Adresse sind falsch, Login fehlgeschlagen.
        </MuiAlert>
      </Container>
    </Box>
  );
}

export const SignIn = props => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  const trySignin = () => {
    signIn(email, password, props.confirmLogin, setLoginFailed);
  };

  return (
    <Box  overflow="hidden">
        { loginFailed ? loginFailedErrorMessage() : <></> }
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <img
              alt="wappen.svg"
              src="/images/logos/logo--white.svg"
              width="250"
            />
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Adresse"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={event => { setEmail(event.target.value) }}
                onKeyDown={event => { if (event.keyCode === 13) { trySignin(email, password) }}}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Passwort"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={event => { setPassword(event.target.value) }}
                onKeyDown={event => { if (event.keyCode === 13) { trySignin(email, password) }}}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => trySignin(email, password)}
              >
                Einloggen
              </Button>
              <Grid container>
                <Grid item xs>
                  <RouterLink to="/reset-password" style={{ color: colors.green[900] }}>
                    Passwort vergessen?
                  </RouterLink>
                </Grid>
                <Grid item>
                  <RouterLink to="/signup" style={{ color: colors.green[900] }}>
                    Registrieren
                  </RouterLink>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
    </Box>
  );
}
