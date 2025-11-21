import React from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { colors, Box } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import MuiAlert from '@mui/material/Alert';

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
    signIn(email, password, props.updateStateIsSignedIn, setLoginFailed);
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
          <form className={classes.form} noValidate method='POST' action='/login'>
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
