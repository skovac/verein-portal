import React from 'react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { Profile, SidebarNav } from './components';
import { isAdmin } from '../../../../backend-calls/Auth/Auth';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const [ pages, setPages ] = useState([
    {
      title: 'Profil',
      href: '/profil',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Mitglieder',
      href: '/mitglieder',
      icon: <PeopleIcon />
    },
    {
      title: 'Teutonenzeitung',
      href: '/tz',
      icon: <MenuBookIcon />
    },
    {
      title: 'Protokolle',
      href: 'protokolle',
      icon: <AttachFileIcon />
    },
    {
      title: 'Einstellungen',
      href: '/einstellungen',
      icon: <SettingsIcon />
    },
  ]);

  const adminPage = {
    title: 'Neue Benutzer',
    href: '/new-users',
    icon: <PersonAddIcon />
  };

  const addAdminPage = () => {
    let tmp = [...pages];
    tmp.push(adminPage);
    setPages(tmp);
  };

  useEffect(() => {
    isAdmin(addAdminPage);
  }, []);

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
