import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

/**Components import */
import Header from "../../components/Header";
import {db} from "../../db/firebase";
import * as dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#f1f5f9",
    width: "100vw",
    height: "100vh",
  },

  __header: {
    height: "10vh",
    width: "100vw",
    [theme.breakpoints.down("sm")]: {
      //marginLeft: "70px",
    },
  },
  __content: {
    //backgroundColor: "#d4c4fb",
    width: "100%",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    //marginLeft: "280px",
    [theme.breakpoints.down("sm")]: {
      //marginLeft: "70px",
    },
  },
}));

const Conductor_home = (props) => {
  const classes = useStyles();
  const [usuario, setUsuario] = useState(null);
  const [viajes, setViajes] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    var docRef = db.collection("usuario").doc(user);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setUsuario(doc.data())
          setViajes(doc.data().viajes)

          doc.data().viajes.forEach(x => {
            /** antes de */
            if(dayjs(x.fecha.toDate()).isBefore(dayjs()) == true){
              console.log("Viajes Anteriores => ", dayjs(x.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A"));
            }else if(dayjs(x.fecha.toDate()).isSame(dayjs(), 'date') == true){
              console.log("Posee un viaje hoy => ", dayjs(x.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A"));
            }else if (dayjs(x.fecha.toDate()).isAfter(dayjs()) == true){
              console.log("Proximos viajes => ", dayjs(x.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A"));
            }
            
          });

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  },[]);

  return (
    <div className={classes.root}>
      <div className={classes.__header}>
        <Header />
      </div>

      <div className={classes.__content}>
        <h1>Conductor_home</h1>
        <h1>{dayjs().locale("es").format("DD MMMM YYYY hh:mm A")}</h1>
        <h1>Viajes Totales : {viajes ? viajes.length : "cargando..."}</h1>
        <h1>Viajes Terminados : {viajes ? viajes.length : "cargando..."}</h1>
        <h1>Viajes Programados : {viajes ? viajes.length : "cargando..."}</h1>
        
        <Box>
          <Link to="/">Volver al inicio</Link>
        </Box>
      </div>
    </div>
  );
};

export default Conductor_home;
