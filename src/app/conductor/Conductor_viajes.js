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
import "./estilos_conductor_viajes.css";

const Conductor_viajes = (props) => {
  const [usuario, setUsuario] = useState(null);
  const [viajes, setViajes] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [ultimo_viaje, setUltimoViaje] = useState(null);
  const [proximo_viaje, setProximoViaje] = useState("");
  const [acutal_viaje, setActualViaje] = useState("");

  useEffect(async () => {
    let user = localStorage.getItem("user");
    var docRef = db.collection("usuario").doc(user);

    docRef
      .get()
      .then( async (doc) => {
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

          
          
          

          if(ultimo){
            var ultimoRef =  db.collection("empresa").doc(ultimo.destino);
            await ultimoRef.get().then((doc) => {if (doc.exists) {ultimo ? ultimo.destino = doc.data().empresa : console.log("nada");} else {console.log("No such document!");}
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
          }

          if(actual){
            var actualRef =  db.collection("empresa").doc(actual.destino);
            await actualRef.get().then((doc) => {if (doc.exists) {actual.destino = doc.data().empresa; } else {console.log("No such document!");}
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
          }

          if(proximo){
            var proximoRef =  db.collection("empresa").doc(proximo.destino);
            await proximoRef.get().then((doc) => {if (doc.exists) {proximo.destino = doc.data().empresa} else {console.log("No such document!");}
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
          }
          
          

          

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
    <div className="root">
      <div className="header">
        <Header />
      </div>

      <div className="content">

        <div className="card-container">
            <div className="card">
              <div>
                <span className="card-title">Ultimo viaje: </span>
                <span className="card-fecha">{ultimo_viaje ? dayjs(ultimo_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className="card-title">con destino a :</span>
                <span className="card-fecha">{ultimo_viaje ? ultimo_viaje.destino : ""}</span>
                
                <br/>
                <span className="card-fecha">{ultimo_viaje ? ultimo_viaje.direccion : ""}</span>
                <br/>
              </div>
                <div className="icon-container">
                  <EventAvailableIcon className="icon"/>
                </div>
            </div>
            {acutal_viaje ?
            <div className="card">
            <div>
                <span className="card-title">Su viaje de hoy es: </span>
                <span className="card-fecha">{acutal_viaje ? dayjs(acutal_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className="card-title">con destino a :</span>
                <span className="card-fecha">{acutal_viaje ? acutal_viaje.destino : ""}</span>
                
                <br/>
                <span className="card-fecha">{acutal_viaje ? acutal_viaje.direccion : ""}</span>
                <br/>
              </div>
            <div className="icon-container">
                <LocationOnRoundedIcon className="icon"/>
            </div>
              
          </div>
            : 
            <div className="card">
              <div style={{display : 'flex', alignItems : 'center'}}>
                <span className="card-fecha">No tiene viajes programados para el día de hoy.</span>
              </div>
              <div className="icon-container">
                  <LocationOnRoundedIcon className="icon"/>
              </div>
                
            </div>
            }
            
            <div className="card">
              <div>
                <span className="card-title">Proximo viaje </span>
                <span className="card-fecha">{proximo_viaje ? dayjs(proximo_viaje.fecha.toDate()).locale("es").format("DD MMMM YYYY hh:mm A") : ""}</span>
                <br/>
                <span className="card-title">con destino a :</span>
                <span className="card-fecha">{proximo_viaje ? proximo_viaje.destino : ""} </span>
                <br/>
                <span className="card-fecha">{proximo_viaje ? proximo_viaje.direccion : ""} </span>
                <br/>
              </div>
              <div className="icon-container">
                <ScheduleIcon className="icon"/>
              </div>
            </div>
            
        </div> 
        <div className="table">
            <TABLA_VIAJES_CONDUCTOR setSelectedItem={setSelectedItem} setViajes={setViajes}/>
        </div>

      </div>
    </div>
  );
};

export default Conductor_viajes;