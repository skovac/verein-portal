import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import { getUsers } from '../../backend-calls/GetUsers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  const [users] = useState(getUsers());
  const [search, setsearch] = useState("");

  return (
    <div className={classes.root}>
      <UsersToolbar setsearch={setsearch}/>
      <div className={classes.content}>
        <UsersTable users={users} search={search}/>
      </div>
    </div>
  );
};

export default UserList;
