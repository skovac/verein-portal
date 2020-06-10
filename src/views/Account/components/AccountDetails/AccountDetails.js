import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { getOwnInfo, templInfo, updateProfile } from '../../../../backend-calls/GetProfile'

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [ user, setUser ] = useState(templInfo);
  useEffect(() => { getOwnInfo(setUser) }, []);

  const handleChange = event => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="Diese Informationen können verändert werden"
          title="Profil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Vorname"
                margin="dense"
                name="firstName"
                onChange={handleChange}
                required
                value={user.firstName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Nachname"
                margin="dense"
                name="lastName"
                onChange={handleChange}
                required
                value={user.lastName || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Status"
                margin="dense"
                name="role"
                onChange={handleChange}
                required
                value={user.role || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email Adresse"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={user.email || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Telefonnummer"
                margin="dense"
                name="tel"
                onChange={handleChange}
                required
                value={user.tel || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Stadt"
                margin="dense"
                name="city"
                onChange={handleChange}
                required
                value={user.city || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Bundesland/Provinz"
                margin="dense"
                name="state"
                onChange={handleChange}
                required
                value={user.state || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Staat"
                margin="dense"
                name="country"
                onChange={handleChange}
                required
                value={user.country || ''}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Zeitzone"
                margin="dense"
                name="timezone"
                onChange={handleChange}
                required
                value={user.timezone || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => updateProfile(user)}
          >
            Änderungen speichern
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
