import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from '@material-ui/core';
import { getOwnInfo, ownPicUrl, uploadProfilePic, deleteProfilePic, templInfo } from './../../../../backend-calls/GetProfile'

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const userCompleteness = user => {
  const values = Object.values(user);
  const numValues = values.length;
  let numCompletedValues = 0;
  for (let i = 0; i < numValues; ++i) {
    if (values[i]) {
      ++numCompletedValues;
    }
  }
  return Math.round(numCompletedValues / numValues * 100);
}

const AccountProfile = props => {
  const [ user, setUser ] = useState(templInfo);
  useEffect(() => { getOwnInfo(setUser) }, []);

  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {(user.firstName || "") + " " + (user.lastName || "")}
            </Typography>
            <Typography
              className={classes.locationText}
              color="textSecondary"
              variant="body1"
            >
              {user.city} {user.country}
            </Typography>
            <Typography
              className={classes.dateText}
              color="textSecondary"
              variant="body1"
            >
              {moment().format('HH:mm')} ({user.timezone || "GMT-0"})
            </Typography>
          </div>
          <Avatar
            className={classes.avatar}
            src={ownPicUrl}
          />
        </div>
        <div className={classes.progress}>
          <Typography variant="body1">Profil Vollständigkeit: {userCompleteness(user)}%</Typography>
          <LinearProgress
            value={userCompleteness(user)}
            variant="determinate"
          />
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={event => {
            const data = new FormData();
            data.append('file', event.target.files[0]);
            uploadProfilePic(data);
            window.location.reload();
          }}
        />
        <label htmlFor="raised-button-file">
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
            component="span"
          >
            Bild hochladen
          </Button>
        </label>
        <Button 
          variant="text"
          onClick={() => {
            deleteProfilePic();
          }}
        >
          Bild löschen
        </Button>
      </CardActions>
    </Card>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string
};

export default AccountProfile;
