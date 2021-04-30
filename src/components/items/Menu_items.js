import React from "react";

import { Box } from "@material-ui/core";

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundImage: "linear-gradient(to right, #434343 0%, black 100%)",

    //display : 'flex',
    //flex : 'wrap',

    width: "100%",
    height: "100%",
    
  },

  listItem: {
    //backgroundColor: "skyblue", //** */
    height: "100%",
    width: "100%",
    overflow: "hidden",
    paddingTop : 50
  },

  listItemIcon: {
    color: "#fff",
  },
  listItemText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat, sans-serif",
  },

  topItemList: {
    //backgroundColor: "pink",
    height: "60%",
  },

  bottomItemList: {
    //backgroundColor: "green",
    height: "40%",
  },
  item: {
    "&:hover": {
      //backgroundColor: fade(theme.palette.common.white, 0.25),
      backgroundColor: "#C1BFD9",
    },
  },
}));

export const MenuTest = (props) => {
  const classes = useStyles();

  return (
    <Box className={classes.listItem}>
      <Box>
        <List className={classes.topItemList}>
          {props.admin_items.map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={item.onClick}
              disabled={item.isDisabled}
              className={classes.item}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {/**ICONO HERE!!!! */}
                {item.icon}
              </ListItemIcon>

              <ListItemText>
                <span className={classes.listItemText}>{item.text}</span>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
      <Box>
        <List className={classes.bottomItemList}>
          {props.admin_settings.map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={item.onClick}
              className={classes.item}
            >
              <ListItemIcon className={classes.listItemIcon}>
                {/**ICONO HERE!!!! */}
                {item.icon}
              </ListItemIcon>

              <ListItemText>
                <span className={classes.listItemText}>{item.text}</span>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
