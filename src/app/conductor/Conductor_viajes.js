import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

/**Components import */
import Header from "../../components/Header";
import {db} from "../../db/firebase";
import * as dayjs from "dayjs";

import TABLA_VIAJES_CONDUCTOR from "../admin/data_tables/DataTable_conductor_viajes_ant";

import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';

import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';

import ScheduleIcon from '@material-ui/icons/Schedule';
import { LocationOnOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#f1f5f9",
    width: "100vw",
    height: "auto",
    fontFamily: 'Montserrat, sans-serif',
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
    width: "100vw",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    //padding : 30,
    //marginLeft: "280px",
    [theme.breakpoints.down("sm")]: {
      //marginLeft: "70px",
      height: "100%",
    },
  },

  __card_container : {
    //backgroundColor: "#ccc",
    display : 'flex',
    justifyContent : 'center',
    alignItems :'center',
    alignSelf : 'center',
    height : '30%',
    width : '100%',
    float : "left",
    marginBottom : 30,
    marginTop : 20,
    [theme.breakpoints.down("md")]: {
        flexDirection : 'column',
        height : 'auto',
        width : '100%',
    },
  },

  __card : {
    backgroundColor: "#fff",
    height : '80%',
    width : '30%',
    boxShadow : '4px 4px 8px 1px rgba(26,32,46,100)',
    borderRadius : 2,
    marginRight : 18,
    padding : 20,
    display : 'flex',
    alignItems : 'center',
    justifyContent : 'space-between',
    [theme.breakpoints.down("md")]: {
        width : '100%',
        marginTop : 15
    },
  },

  __card_title : {
    fontFamily: 'Montserrat, sans-serif',
    fontSize : '.8rem',
    color : '#555',
    textTransform : 'uppercase',
    //backgroundColor : 'red',
    display : 'flex',
    alignItems : 'center'
    //color : "#ffff"
  },
  __table : {
    backgroundColor: "#fff",
    width : '100%',
    alignSelf: "center",
    marginTop : 10,
    //padding: 5,
    boxShadow : '4px 4px 4px 0px rgba(0,0,0,0.1)',
    borderRadius : '2px',
    //marginTop : 50
    [theme.breakpoints.down("sm")]: {
        width : '100%',
    },
    
  },

  __card_fecha : {
    fontFamily: 'Montserrat, sans-serif',
    fontSize : 16,
    fontWeight : 'bold',
    color : '#555',
    marginLeft : 14,
    //color : "#ffff"
  },

  __icon : {
    position : 'relative',
    fontSize : 124,
    color : '#ccc',
  },

  __icon_container : {
    //backgroundColor : 'skyblue',
    justifySelf : 'flex-end'
  },


  
}));

const Conductor_viajes = (props) => {
  const classes = useStyles();
  const [usuario, setUsuario] = useState(null);
  const [viajes, setViajes] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [ultimo_viaje, setUltimoViaje] = useState(null);
  const [proximo_viaje, setProximoViaje] = useState("");
  const [acutal_viaje, setActualViaje] = useState("");

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
          let cont = 0;

          const filtro_ultimo = doc.data().viajes.filter(x =>  dayjs(x.fecha.toDate()).isBefore(dayjs()));
          console.log(" FILTRO ULTIMO => ",filtro_ultimo);

          const filtro_proximo = doc.data().viajes.filter(x =>  dayjs(x.fecha.toDate()).isAfter(dayjs()));
          console.log(" FILTRO PROXIMO => ",filtro_proximo);

          const sorted_filtro_ultimo = filtro_ultimo.sort((a, b) => b.fecha - a.fecha);
          console.log(" SORTED FILTRO ULTIMO => ",sorted_filtro_ultimo);

          const sorted_filtro_proximo = filtro_proximo.sort((a, b) => a.fecha - b.fecha);
          console.log(" SORTED FILTRO PROXIMO => ",sorted_filtro_proximo);

          

          const ultimo = sorted_filtro_ultimo.find(element => dayjs(element.fecha.toDate()).isBefore(dayjs(), 'date'));
          const proximo = sorted_filtro_proximo.find(element => dayjs(element.fecha.toDate()).isAfter(dayjs()));
          const actual = doc.data().viajes.find(element => dayjs(element.fecha.toDate()).isSame(dayjs(), 'date'));
          console.log(actual);
          setUltimoViaje(ultimo);
          setProximoViaje(proximo);
          setActualViaje(actual);

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

        <div className={classes.__card_container}>
            <div className={classes.__card}>
              <div>
                <span className={classes.__card_title}>Ultimo viaje: </span>
                <span className={classes.__card_fecha}>{ultimo_viaje ? dayjs(ultimo_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className={classes.__card_title}>con destino a :</span>
                <span className={classes.__card_fecha}>{ultimo_viaje ? ultimo_viaje.destino : ""}</span>
                
                <br/>
                <span className={classes.__card_fecha}>{ultimo_viaje ? ultimo_viaje.direccion : ""}</span>
                <br/>
              </div>
                <div className={classes.__icon_container}>
                  <EventAvailableIcon className={classes.__icon}/>
                </div>
            </div>
            {acutal_viaje ?
            <div className={classes.__card}>
            <div>
                <span className={classes.__card_title}>Su viaje de hoy es: </span>
                <span className={classes.__card_fecha}>{acutal_viaje ? dayjs(acutal_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className={classes.__card_title}>con destino a :</span>
                <span className={classes.__card_fecha}>{acutal_viaje ? acutal_viaje.destino : ""}</span>
                
                <br/>
                <span className={classes.__card_fecha}>{acutal_viaje ? acutal_viaje.direccion : ""}</span>
                <br/>
              </div>
            <div className={classes.__icon_container}>
                <LocationOnRoundedIcon className={classes.__icon}/>
            </div>
              
          </div>
            : 
            <div className={classes.__card}>
              <div style={{display : 'flex', alignItems : 'center'}}>
                <span className={classes.__card_fecha}>No tiene viajes programados para el día de hoy.</span>
              </div>
              <div className={classes.__icon_container}>
                  <LocationOnRoundedIcon className={classes.__icon}/>
              </div>
                
            </div>
            }
            
            <div className={classes.__card}>
              <div>
                <span className={classes.__card_title}>Proximo viaje </span>
                <span className={classes.__card_fecha}>{proximo_viaje ? dayjs(proximo_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className={classes.__card_title}>con destino a :</span>
                <span className={classes.__card_fecha}>{proximo_viaje ? proximo_viaje.destino : ""} </span>
                <br/>
                <span className={classes.__card_fecha}>{proximo_viaje ? proximo_viaje.direccion : ""} </span>
                <br/>
              </div>
              <div className={classes.__icon_container}>
                <ScheduleIcon className={classes.__icon}/>
              </div>
            </div>
            
        </div> 
        <div className={classes.__table}>
            <TABLA_VIAJES_CONDUCTOR setSelectedItem={setSelectedItem} setViajes={setViajes}/>
        </div>

      </div>
    </div>
  );
};

export default Conductor_viajes;