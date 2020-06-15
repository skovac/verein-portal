import React from 'react';
import { useState } from 'react';
import { Link as RouterLink} from 'react-router-dom';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { signUp } from '../../components/Auth/Auth';

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

export const SignUp = props => {
  const classes = useStyles();
  const [ firstName, updateFirstName ] = useState("");
  const [ lastName, updateLastName ] = useState("");
  const [ memberStatus, updateMemberStatus ] = useState("");
  const [ email, updateEmail ] = useState("");
  const [ password, updatePassword ] = useState("");

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img
          alt="wappen.svg"
          src="/images/logos/logo--white.svg"
          width="250"
        />
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Vorname"
                autoFocus
                value={firstName}
                onChange={event => updateFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Nachname"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={event => updateLastName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl variant="outlined" className={classes.formControl} style={{minWidth: 120}}>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="status-chooser"
                  id="status-chooser"
                  label="Status"
                  width="2000"
                  value={memberStatus}
                  onChange={event => updateMemberStatus(event.target.value)}
                >
                  <MenuItem value={"fuchs"}>Fuchs</MenuItem>
                  <MenuItem value={"ab"}>aB</MenuItem>
                  <MenuItem value={"iab"}>iaB</MenuItem>
                  <MenuItem value={"ah"}>AH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Adresse"
                name="email"
                autoComplete="email"
                value={email}
                onChange={event => updateEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Passwort"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={event => updatePassword(event.target.value)}
                onKeyDown={event => { if (event.keyCode === 13) { signUp({firstName, lastName, memberStatus, email, password}) }}}

              />
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              href="/signin"
              onClick={() => {
                signUp({firstName, lastName, memberStatus, email, password});
              }}
            >
              Registrieren
            </Button>
          </Grid>
          <RouterLink to="/signin" style={{ color: colors.green[900] }}>
            Zurück zum Login
          </RouterLink>
        </form>
      </div>
    </Container>
  );
}
