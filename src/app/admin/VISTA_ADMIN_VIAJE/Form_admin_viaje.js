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

import "./estilos_form_admin_viaje.css";

import * as dayjs from "dayjs";
require("dayjs/locale/es");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const DatePicker = (props) => {
  const { /*setDate, selectedItem, setSelectedItem*/ selectedItem } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  //const [selectedViaje, setSelectedViaje] = React.useState(null);

  const handleDateChange = (date) => {
    var formatDate = dayjs(date).locale("es").format("DD MMMM YYYY HH:m A");


    setDate(date);
    console.log("date => ", formatDate);
    console.log("firestamp => ",fire.firestore.Timestamp.fromDate(new Date(date)).toDate());
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
  const { selectedItem } = props;
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
                <DatePicker selectedItem={selectedItem} />
            </div>
            <div className="Form-input-select">
               <SELECT_USUARIO/>
            </div>

            <div className="Form-input-select">
               <SELECT_CAMION/>
            </div>
            
        </div>
        
    </div>
  );
}

export default Form_admin_viaje;
