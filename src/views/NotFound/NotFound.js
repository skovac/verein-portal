import React from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    paddingTop: 50,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <Typography variant="h1">
              404: Diese Seite existiert nicht. Aber hier ist ein Bier.
            </Typography>
            <Typography variant="subtitle2">
              Falls diese Seite existieren sollte kontaktiere bitte Bbr. Sébastien Kovacs um dies zu melden.
            </Typography>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/beer.png"
              style={{width: "40%"}}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
