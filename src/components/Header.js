import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BusinessRoundedIcon from "@material-ui/icons/BusinessRounded";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../db/firebase";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { cerrar__sesion } from "../db/auth";
import { useHistory } from "react-router-dom";

import { HEADER_BG_COLOR } from "../variables";

const useStyles = makeStyles((theme) => ({
  /**         4A051C       */
  root: {
    background: HEADER_BG_COLOR, //"#363457"
    height: "100%",
    width: "100%",

    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "4px 4px 10px 10px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    //borderLeft: "1px #ccc solid",
    //minHeight: '100vh',
  },

  cnt_avatar: {
    //backgroundColor: "blue",
    width: "25%",

    display: "flex",
    alignItems: "center",

    //paddingLeft : 15,
    justifyContent: "flex-end",
    //paddingLeft : 50,
    paddingRight : 10,
    [theme.breakpoints.down("sm")]: {
    },
  },

  cnt_avatar_dos: {
    //backgroundColor: "blue",
    width: "50px",
    height: "50px",
  },

  cnt_links: {
    //backgroundColor : 'blue',

    width: "50%", //50 para 100%

    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  top: {
    //backgroundColor : 'red',
    //borderTop : '1px solid #ccc',
    display: "flex",

    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    //padding: 5,
    [theme.breakpoints.down("sm")]: {
      width: "55%",
      justifyContent: "center",
      alignItems: "center",
    },
  },

  __icon_mobile: {
    //backgroundColor: "green",
    width: "25%",
    justifyContent: "flex-start",
    paddingLeft : 10,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "25%",
      height: "100%",
      padding: 5,
    },
  },

  icons: {
    color: "#ccc",
    textDecoration: "none",
    "&:hover": {
      color: "#fff",
    },
  },

  icon_mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      //backgroundColor : "red",
      display: "flex",
      width: "50%",
      justifyContent: "center",
    },
  },

  menu_mobile: {
    //backgroundColor: "blue",
    //width: "20%",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },

  displayName: {
    //backgroundImage: "linear-gradient(to left, #c31432, #240b36)",
    width: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
    },
  },

  links: {
    width: "100%",
    display: "flex",
    alignItems: "center",

    justifyContent: "center",

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  nav__links: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#ccc",
    fontSize: "15px",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "bold",
    textDecoration: "none",
    position: "absoluted",
    marginRight: 24,
    transition: "color 300ms ease-in-out",

    "&:hover": {
      //backgroundColor: fade(theme.palette.common.white, 0.25),
      color: "#ffff",
      borderBottom: "5px solid #fff",
      paddingBottom: "10px",
    },
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  username: {
    color: "#fff",
    fontSize: "15px",
    //fontWeight: "bold",
    fontFamily: "Montserrat, sans-serif",
    marginLeft: 10,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },

    [theme.breakpoints.down("md")]: {
      fontSize: 13,
    },
  },
  icon: {
    fontSize: 32,
  },

  logo: {
    //backgroundColor : 'blue',
    height: "40px",
    width: "40px",
    marginRight: 10,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },

  title: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Dela Gothic One, cursive",
    [theme.breakpoints.down("sm")]: {
      //width: "100%",
    },
  },

  __active_nav: {
    color: "#fff",
  },

  navigation_mobile: {
    backgroundColor: "yellow",
    zIndex: 10,
  },
}));

const Header = (props) => {
  const { openSlideMenu, openNavigationMobileMenu } = props;

  const [visible, setVisible] = useState(false);

  let history = useHistory();

  const [usuario, setUsuario] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setVisible(true);
  };

  const handleSignOut = () => {
    cerrar__sesion();
    history.push("/");
    setAnchorEl(null);
  };

  const [refresh, setRefresh] = useState(false);
  useEffect(async () => {
    let user = localStorage.getItem("user");
    console.log("usuario => ", user);
    var docRef = db.collection("usuario").doc(user);

    await docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setUsuario(doc.data());
          db.collection("usuario")
            .doc(doc.id)
            .onSnapshot((doc) => {
              console.log("Current data: ", doc.data());
              setUsuario(doc.data());
            });
        } else {
          // doc.data() will be undefined in this case
          //console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

  const LINKS_ADMIN = [
    {
      text: "INICIO",
      linkTo: "/admin/home",
      icon: <HomeRoundedIcon />,
    },
    {
      text: "USUARIOS",
      linkTo: "/admin/conductores",
      icon: <GroupRoundedIcon />,
    },
    {
      text: "CAMIONES",
      linkTo: "/admin/camiones",
      icon: <LocalShippingRoundedIcon />,
    },
    {
      text: "VIAJES",
      linkTo: "/admin/viajes",
      icon: <DateRangeRoundedIcon />,
    },
    {
      text: "EMPRESAS",
      linkTo: "/admin/empresa",
      icon: <BusinessRoundedIcon />,
    },
  ];
  const LINKS_CONDUCTOR = [
    {
      text: "MIS VIAJES",
      linkTo: "/conductor/viajes",
      icon: <LocalShippingRoundedIcon />,
    },
  ];

  const classes = useStyles();

  let isAdmin = localStorage.getItem("isAdmin");
  const links = (isAdmin) => {
    if (isAdmin === "true") {
      return (
        <Box className={classes.cnt_links}>
          {/** Cambiar dependiendo de los privilegios */}
          <Box className={classes.links}>
            {LINKS_ADMIN.map((x) => (
              <NavLink
                to={x.linkTo}
                className={classes.nav__links}
                key={x.text}
                activeClassName={classes.__active_nav}
              >
                {x.icon}
                {x.text}
              </NavLink>
            ))}
          </Box>

          <Box className={classes.menu_mobile}>
            <MenuIcon />
          </Box>
        </Box>
      );
    } else if (isAdmin === "false") {
      return (
        <Box className={classes.cnt_links}>
          {/** Cambiar dependiendo de los privilegios */}
          <Box className={classes.links}>
            {LINKS_CONDUCTOR.map((x) => (
              <NavLink
                to={x.linkTo}
                className={classes.nav__links}
                activeClassName={classes.__active_nav}
              >
                {x.icon}
                {x.text}
              </NavLink>
            ))}
          </Box>
        </Box>
      );
    }
  };

  return (
    <div className={classes.root}>
      {isAdmin == "true" ? (
        <Box className={classes.__icon_mobile}>
          <span>
            <a href="#" className={classes.icons} onClick={openSlideMenu}>
              <i class="bi bi-list" style={{ fontSize: 42 }}></i>
            </a>
          </span>
        </Box>
      ) : (
        <Box className={classes.__icon_mobile}>
          <span>
            <a href="#" className={classes.icons} onClick={openSlideMenu}>
              <i class="bi bi-list" style={{ fontSize: 42 }}></i>
            </a>
          </span>
        </Box>
      )}
      {isAdmin == "true" ? (
        <Box className={classes.icon_mobile}>
          <span>
            <a
              href="#"
              className={classes.icons}
              onClick={openNavigationMobileMenu}
            >
              <i
                className="bi bi-caret-down-fill"
                style={{ fontSize: 40 }}
              ></i>
            </a>
          </span>
        </Box>
      ) : (
        ""
      )}

      {/** Cambiar dependiendo de los privilegios */}

      {links(isAdmin)}
      <Box className={classes.cnt_avatar}>
        <Box className={classes.displayName} elevation={3}>
          {/** Cambiar dependiendo del usuario que inició sesión */}
          <div className={classes.cnt_avatar_dos}>
            <img
              alt="user_avatar"
              src={usuario ? usuario.photoURL === '' ? "/default_avatar.png" : usuario.photoURL : "/default_avatar.png"}
              className={classes.avatar}
            />
          </div>

          <span className={classes.username}>
            {usuario ? usuario.nombres.toUpperCase() : ""}
          </span>
        </Box>
      </Box>
    </div>
  );
};

export default Header;
