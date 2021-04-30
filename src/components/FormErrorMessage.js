import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Typography from '@material-ui/core/Typography';

import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundColor: "#bed3f3",
    display: "flex",
    alignItems : 'center'
  },

  icon: {
    color: "#db3e00",
    fontSize: 24,
    marginRight: 5,
    marginLeft: 3,
    [theme.breakpoints.down("sm")]: {
        fontSize: 18,
        marginLeft: 0,
    },
  },

  text : {
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
        fontSize: 12,
    },
  }
}));

const FormErrorMessage = (props) => {
  const classes = useStyles();

  const { children } = props;

  return (
    <div className={classes.root}>
      <ErrorIcon className={classes.icon} />
      <Typography 
        align="center"
        color="error"
        variant="body2"
        className={classes.text}
      >
        {children}
      </Typography>
    </div>
  );
};

export default FormErrorMessage;
