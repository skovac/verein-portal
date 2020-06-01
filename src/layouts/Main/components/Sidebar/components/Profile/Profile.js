import React from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { getOwnInfo, ownPicUrl, templInfo } from '../../../../../../backend-calls/GetProfile'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const [ user, setUser ] = useState(templInfo);
  useEffect(() => { getOwnInfo(setUser) }, []);

  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={ownPicUrl}
        to="/settings"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {(user.firstName || "") + " " + (user.lastName || "")}
      </Typography>
      <Typography variant="body2">{user.role}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
