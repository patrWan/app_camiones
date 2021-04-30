import React from "react";

import { Box, Divider } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundImage: "linear-gradient(to right, #434343 0%, black 100%)",

    //display : 'flex',
    //flex : 'wrap',

    width: "100%",

    height: "100%",
  },

  footer: {
    //backgroundColor : 'red',
    //borderTop : '1px solid #ccc',
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center",
  },

  top: {
   //backgroundColor : 'red',
    //borderTop : '1px solid #ccc',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 0,
    [theme.breakpoints.down("sm")]: {
      marginTop: 5,
      flexDirection: "column",
    },
  },

  container_icon: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },

  icons: {
    color: "#ccc",
    textDecoration: "none",
    "&:hover": {
      color: "#fff",
    },
  },

  center: {
    //backgroundColor : 'blue',
  },

  logo: {
    //backgroundColor : 'blue',
    height: "40px",
    width: "40px",
    //marginRight: 10,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  title: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Dela Gothic One, cursive",
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },

  __icon_mobile: {
    backgroundColor: "green",
    display: "none",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "20%",
    },
  },
}));

const Side_menu = (props) => {
  const { closeSlideMenu } = props;
  /** recibe -> itemList , settingList */
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.top}>
      <span className={classes.container_icon}>
          <a href="#" className={classes.icons} onClick={closeSlideMenu}>
            <i
              class="bi bi-x"
              style={{ fontSize: 42, marginLeft: 5, marginRight: 5 }}
            ></i>
          </a>
        </span>
        <img src="/logo_3.png" className={classes.logo}></img>

        

        <Box
          style={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span className={classes.title}>INKA SPA</span>
        </Box>
      </div>

      <Box className={classes.center}>{props.itemList}</Box>

      <Box className={classes.footer}>
        <Divider />
        <Box></Box>
        <Box></Box>
        <Box>
          <Typography variant="body1" component="h2" gutterBottom>
            info extra
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Side_menu;
