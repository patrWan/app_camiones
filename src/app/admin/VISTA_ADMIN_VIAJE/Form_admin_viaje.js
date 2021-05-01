import React, { useEffect, useState } from "react";
import { fire } from "../../../db/firebase";
// date picker.
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DatedayjsUtils from "@date-io/dayjs";

import SELECT_USUARIO from "./Select";
import SELECT_CAMION from "./SelectCamion";
import SELECT_ORIGEN from "./SelectOrigen";
import SELECT_EMPRESA from "./SelectEmpresa";

import {db} from "../../../db/firebase";

import { useSnackbar } from "notistack";

import "./estilos_form_admin_viaje.css";

import * as dayjs from "dayjs";
require("dayjs/locale/es");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const DatePicker = (props) => {
  const { /*setDate, selectedItem, setSelectedItem*/ selectedItem, setFechaHora } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  //const [selectedViaje, setSelectedViaje] = React.useState(null);

  const handleDateChange = (date) => {
    var formatDate = dayjs(date).locale("es").format("DD MMMM YYYY HH:m A");


    setDate(date);
    console.log("date => ", formatDate);
    console.log("firestamp => ",fire.firestore.Timestamp.fromDate(new Date(date)).toDate());
    setFechaHora(fire.firestore.Timestamp.fromDate(new Date(date)).toDate());
    //setDate(date);
    /*
      if (selectedItem) {
        console.log("!! SELECTED ITEM !!");
        selectedItem.fecha = fire.firestore.Timestamp.fromDate(
          new Date(date)
        ).toDate();
        console.log(selectedItem);
      }
      */
  };
  useEffect(()=> {
    console.log("DATEPICKER RENDER");
    if(selectedItem){
        setDate(selectedItem.fecha);
        setFechaHora(selectedItem.fecha);
    }
    
  },[]);
  return (
    <MuiPickersUtilsProvider utils={DatedayjsUtils} locale="es">
      <KeyboardDatePicker
        variant="inline"
        margin="normal"
        id="date-picker-dialog"
        label="Fecha"
        format={"DD, MMMM-YYYY"}
        value={date}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
      />
      <KeyboardTimePicker
        margin="normal"
        id="time-picker"
        label="Hora"
        value={date}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          "aria-label": "change time",
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

function Form_admin_viaje(props) {
  const { selectedItem, user__id } = props;

  const [fecha_hora, setFechaHora] = useState('');
  const [conductor, setConductor] = useState('');
  const [camionId, setCamionId] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  function submit(){
    console.log("fecha y hora => ",fecha_hora);
    console.log("conductor => ",conductor);
    console.log("camion => ", camionId);
    console.log("origen => ",origen);
    console.log("destino => ", destino);
    console.log(selectedItem)

    var identifier = conductor.slice(-4);
    var formatDate = dayjs().locale("es").format("DDMMYYYYhhmmss-" + identifier);

    let viaje = {
      id : formatDate,
      fecha : fecha_hora,
      camion : camionId, // selectedCamion.modelo + " / " + selectedCamion.marca + " / " + selectedCamion.patente,
      origen : origen,
      destino : destino,
      id_camion : camionId,
    }

    if (selectedItem) {
      var cityRef = db.collection("usuario").doc(user__id);
      /** Remuevo el viaje a actualizar */
      cityRef.update({viajes: fire.firestore.FieldValue.arrayRemove(selectedItem)}).then(() => {

        /** Selecciono al usuario para modificar sus viajes */
        var cityRef = db.collection("usuario").doc(conductor);
          
        /** Agrego el viaje modificado */
        cityRef.update({viajes: fire.firestore.FieldValue.arrayUnion(viaje)});

        //setSelectedUser(null);

        var men = "Viaje editado exitosamente.";
        enqueueSnackbar(men, {
          variant: "warning",
          preventDuplicate: true,
        });
      });

      //setOpenModalViaje(false);
    } else {
      console.log("REGISTRAR VIAJE !!");

      var new__viaje = {
        id: formatDate,
        fecha: fecha_hora,
        camion: camionId,
        origen: origen,
        destino: destino,
        id_camion: camionId,
      };

      var cityRef = db.collection("usuario").doc(conductor);

      cityRef.update({viajes: fire.firestore.FieldValue.arrayUnion(new__viaje)}).then(() => {
/*
        var camionRef = db.collection("camion").doc(camionId);

        camionRef.update({disponible: false,}).then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
*/
      });

      /*
        var fechaDisp = dayjs(date).locale("es").format("DD MMMM YYYY");

        let disp = {
          id: formatDate,
          fecha: fechaDisp,
        };

        var camionRef = db.collection("camion").doc(selectedCamion.id);

        camionRef.update({
          disp: fire.firestore.FieldValue.arrayUnion(disp),
        });
      */

      console.log("VIAJE GENERADO => ", new__viaje);

      /** limpiar campos */
      //setSelectedUser(null);

      var men = "Viaje agregado exitosamente.";
      //setOpenModalCamion(false);
      enqueueSnackbar(men, {
        variant: "success",
        preventDuplicate: true,
      });

      //setOpenModalViaje(false);
    }
  }

  return (
    /**
     * fecha y hora
     * condcutor
     * camion -> id_camion
     * origen
     * destino
     *
     */
    <div className="Root">
        <div className="Form-description">
            <span>Descripción</span>
        </div>

        <div className="Form-content">
            <div className="Form-input">
              <DatePicker selectedItem={selectedItem} setFechaHora={setFechaHora}/>
            </div>
            <div className="Form-input-select">
              <span className="Label">Usuario</span>
              <SELECT_USUARIO conductor={conductor} setConductor={setConductor} user__id={user__id} selectedItem={selectedItem}/>
            </div>

            <div className="Form-input-select">
              <span className="Label">Camión</span>
              <SELECT_CAMION selectedItem={selectedItem} camionId={camionId} setCamionId={setCamionId}/>
            </div>

            <div style={{flexDirection : "column"}}>
              <SELECT_ORIGEN selectedItem={selectedItem} setOrigen={setOrigen}/>
            </div>

            <div className="Form-input-select">
              <span className="Label">Empresa Destino</span>
              <SELECT_EMPRESA selectedItem={selectedItem} destino={destino} setDestino={setDestino}/>
            </div>

            <div className="Form-input-select">
              <button className="btn btn-primary" onClick={submit}>Agregar Viaje</button>
            </div>

            
            
        </div>
        
    </div>
  );
}

export default Form_admin_viaje;
