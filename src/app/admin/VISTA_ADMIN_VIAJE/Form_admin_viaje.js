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

import { db } from "../../../db/firebase";

import emailjs from "emailjs-com";

import { useSnackbar } from "notistack";

import "./estilos_form_admin_viaje.css";

import * as dayjs from "dayjs";
import { Backdrop, CircularProgress } from "@material-ui/core";
require("dayjs/locale/es");
var customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const DatePicker = (props) => {
  const {
    /*setDate, selectedItem, setSelectedItem*/ selectedItem,
    setFechaHora,
  } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  //const [selectedViaje, setSelectedViaje] = React.useState(null);

  const handleDateChange = (date) => {
    var formatDate = dayjs(date).locale("es").format("DD MMMM YYYY HH:m A");

    setDate(date);
    console.log("date => ", formatDate);
    console.log(
      "firestamp => ",
      fire.firestore.Timestamp.fromDate(new Date(date)).toDate()
    );
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
  useEffect(() => {
    console.log("DATEPICKER RENDER");
    if (selectedItem) {
      setDate(selectedItem.fecha);
      setFechaHora(selectedItem.fecha);
    }
  }, []);
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
  const { selectedItem, user__id, closeSlideMenu, setOpenModalViaje } = props;

  const [fecha_hora, setFechaHora] = useState("");
  const [conductor, setConductor] = useState("");
  const [camionId, setCamionId] = useState("");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");

  const [email_name, setEmailName] = useState("");
  const [email_destino, setEmailDestino] = useState("");
  const [email_direccion, setEmailDireccion] = useState("");
  const [email_correo, setEmailCorreo] = useState("");

  const [error, setError] = useState(false);
  const [notificar, setNotificar] = useState(true);

  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  function isChecked(e) {
    console.log(e.target.checked);
    setNotificar(e.target.checked);
  }
  function submit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("fecha y hora => ", fecha_hora);
    console.log("conductor => ", conductor);
    console.log("camion => ", camionId);
    console.log("origen => ", origen);
    console.log("destino => ", destino);
    console.log(selectedItem);

    var identifier = conductor.slice(-4);
    var formatDate = dayjs()
      .locale("es")
      .format("DDMMYYYYhhmmss-" + identifier);

    let viaje = {
      id: formatDate,
      fecha: fecha_hora,
      camion: camionId, // selectedCamion.modelo + " / " + selectedCamion.marca + " / " + selectedCamion.patente,
      origen: origen,
      destino: destino,
      id_camion: camionId,
    };

    if (selectedItem) {
      var cityRef = db.collection("usuario").doc(user__id);
      /** Remuevo el viaje a actualizar */
      cityRef
        .update({ viajes: fire.firestore.FieldValue.arrayRemove(selectedItem) })
        .then(() => {
          /** Selecciono al usuario para modificar sus viajes */
          var cityRef = db.collection("usuario").doc(conductor);

          /** Agrego el viaje modificado */
          cityRef.update({
            viajes: fire.firestore.FieldValue.arrayUnion(viaje),
          });

          //setSelectedUser(null);

          var men = "Viaje editado exitosamente.";
          enqueueSnackbar(men, {
            variant: "warning",
            preventDuplicate: true,
            autoHideDuration: 2000,
          });
        });

      if (notificar === true) {
        emailjs
          .sendForm(
            "service_3t2jqug",
            "template_60oxr8w",
            e.target,
            "user_CzJpNEaTEgmDCaNX3wWLO"
          )
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
      }

      closeSlideMenu();
      setOpenModalViaje(false);
      //(false);
      setLoading(false);
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

      if (
        new__viaje.fecha !== "" &&
        new__viaje.camion !== "" &&
        new__viaje.origen !== "" &&
        new__viaje.destino !== "" &&
        new__viaje.id_camion !== ""
      ) {
        var cityRef = db.collection("usuario").doc(conductor);

        cityRef
          .update({ viajes: fire.firestore.FieldValue.arrayUnion(new__viaje) })
          .then(() => {});

        console.log("VIAJE GENERADO => ", new__viaje);

        var men = "Viaje agregado exitosamente.";

        enqueueSnackbar(men, {
          variant: "success",
          preventDuplicate: true,
          autoHideDuration: 2000,
        });

        //setOpenModalViaje(false);
        if (notificar === true) {
          emailjs
            .sendForm(
              "service_3t2jqug",
              "template_60oxr8w",
              e.target,
              "user_CzJpNEaTEgmDCaNX3wWLO"
            )
            .then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
        }
        setOpenModalViaje(false);
        closeSlideMenu();
      } else {
        setError(true);
      }
    }
  }

  function tests(e) {
    e.preventDefault();

    var fecha = dayjs(fecha_hora).locale("es").format("DD MMMM YYYY HH:mm A");

    emailjs
      .sendForm(
        "service_3t2jqug",
        "template_60oxr8w",
        e.target,
        "user_CzJpNEaTEgmDCaNX3wWLO"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  return (
    <div className="Root">
      
      <div className="Form-description">
      <Backdrop open={loading} className="Backdrop">
        <CircularProgress color="secondary" />
      </Backdrop>
        {error ? (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>Error</strong> Todos los campos deben ser llenados.
          </div>
        ) : null}
      </div>

      <div className="Form-content">
        <div className="Form-input">
          <DatePicker selectedItem={selectedItem} setFechaHora={setFechaHora} />
        </div>
        <div className="Form-input-select">
          <span className="Label">Usuario</span>
          <SELECT_USUARIO
            conductor={conductor}
            setConductor={setConductor}
            user__id={user__id}
            selectedItem={selectedItem}
            setEmailName={setEmailName}
            setEmailCorreo={setEmailCorreo}
            user__id={user__id}
          />
        </div>

        <div className="Form-input-select">
          <span className="Label">Camión</span>
          <SELECT_CAMION
            selectedItem={selectedItem}
            camionId={camionId}
            setCamionId={setCamionId}
          />
        </div>

        <div style={{ flexDirection: "column" }}>
          <SELECT_ORIGEN selectedItem={selectedItem} setOrigen={setOrigen} />
        </div>

        <div className="Form-input-select">
          <span className="Label">Empresa Destino</span>
          <SELECT_EMPRESA
            selectedItem={selectedItem}
            destino={destino}
            setDestino={setDestino}
            setEmailDestino={setEmailDestino}
            setEmailDireccion={setEmailDireccion}
          />
        </div>
        <div className="Form-checkbox">
          <input
            type="checkbox"
            classNames="form-check-input"
            id="exampleCheck1"
            onChange={(e) => isChecked(e)}
            checked={notificar}
          />
          <label className="form-check-label" for="exampleCheck1">
            Notificar por correo
          </label>
        </div>
        <div className="Form-input-select">
          <form onSubmit={submit}>
            <input
              type="hidden"
              value={email_correo}
              name="email"
              required
            ></input>
            <input
              type="hidden"
              value={
                selectedItem
                  ? "Viaje Modificado o Reprogramado"
                  : "Nuevo Viaje Programado"
              }
              name="subject"
              required
            ></input>
            <input
              type="hidden"
              value={"Estimado/a, " + email_name}
              name="name"
              required
            ></input>
            <input
              type="hidden"
              value={
                selectedItem
                  ? selectedItem.fecha !== fecha_hora
                    ? "Su viaje del día " +
                      dayjs(selectedItem.fecha)
                        .locale("es")
                        .format("DD MMMM YYYY HH:mm A") +
                      " ha sido cambiado a la siguiente fecha => " +
                      dayjs(fecha_hora)
                        .locale("es")
                        .format("DD MMMM YYYY HH:mm A")
                    : "Su viaje para el día " +
                      dayjs(selectedItem.fecha)
                        .locale("es")
                        .format("DD MMMM YYYY HH:mm A") +
                      " ha sido modificado"
                  : "Se le ha programado un nuevo viaje para el día " +
                    dayjs(fecha_hora)
                      .locale("es")
                      .format("DD MMMM YYYY HH:mm A")
              }
              name="fecha"
              required
            ></input>
            <input
              type="hidden"
              value={"Empresa: " + email_destino}
              name="empresa"
              required
            ></input>
            <input
              type="hidden"
              value={"Dirección: " + email_direccion}
              name="direccion"
              required
            ></input>
            <input
              type="hidden"
              value="Para mas detalles visite trudistics.cl"
              name="mensaje"
              required
            ></input>
            <button
              type="submit"
              className={selectedItem ? "btn btn-warning" : "btn btn-primary"}
              required
            >
              {selectedItem ? "Modificar Viaje" : "Agregar Viaje"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form_admin_viaje;
