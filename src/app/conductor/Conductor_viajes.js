import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

/**Components import */
import Header from "../../components/Header";
import MENU_LATERAL from "../../components/Side_menu";
import {MenuTest} from "../../components/items/Menu_items";
import DRAWERPERFILUSUARIO from "../../components/DrawerPerfilUsuario";

import { cerrar__sesion } from "../../db/auth";

import { useHistory } from "react-router-dom";

import { db } from "../../db/firebase";
import * as dayjs from "dayjs";

import TABLA_VIAJES_CONDUCTOR from "../admin/data_tables/DataTable_conductor_viajes_ant";

import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import EventBusyIcon from "@material-ui/icons/EventBusy";

import LocationOnRoundedIcon from "@material-ui/icons/LocationOnRounded";

import ScheduleIcon from "@material-ui/icons/Schedule";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AddBoxIcon from "@material-ui/icons/AddBox";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import "./estilos_conductor_viajes.css";

import {CARDS_ADMIN_BG_COLOR, CARDS_ADMIN_TEXT_COLOR, DATATABLE_BG_COLOR} from "../../variables";

const Conductor_viajes = (props) => {
  const [visible, setVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [viajes, setViajes] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [ultimo_viaje, setUltimoViaje] = useState(null);
  const [proximo_viaje, setProximoViaje] = useState("");
  const [acutal_viaje, setActualViaje] = useState("");

  let history = useHistory();

  useEffect(async () => {
    let user = localStorage.getItem("user");
    var docRef = db.collection("usuario").doc(user);

    docRef
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setUsuario(doc.data());
          setViajes(doc.data().viajes);
          let cont = 0;

          const filtro_ultimo = doc
            .data()
            .viajes.filter((x) => dayjs(x.fecha.toDate()).isBefore(dayjs()));
          console.log(" FILTRO ULTIMO => ", filtro_ultimo);

          const filtro_proximo = doc
            .data()
            .viajes.filter((x) => dayjs(x.fecha.toDate()).isAfter(dayjs()));
          console.log(" FILTRO PROXIMO => ", filtro_proximo);

          const sorted_filtro_ultimo = filtro_ultimo.sort(
            (a, b) => b.fecha - a.fecha
          );
          console.log(" SORTED FILTRO ULTIMO => ", sorted_filtro_ultimo);

          const sorted_filtro_proximo = filtro_proximo.sort(
            (a, b) => a.fecha - b.fecha
          );
          console.log(" SORTED FILTRO PROXIMO => ", sorted_filtro_proximo);

          const ultimo = sorted_filtro_ultimo.find((element) =>
            dayjs(element.fecha.toDate()).isBefore(dayjs(), "date")
          );
          const proximo = sorted_filtro_proximo.find((element) =>
            dayjs(element.fecha.toDate()).isAfter(dayjs())
          );
          const actual = doc
            .data()
            .viajes.find((element) =>
              dayjs(element.fecha.toDate()).isSame(dayjs(), "date")
            );
          console.log(actual);

          if (ultimo) {
            var ultimoRef = db.collection("empresa").doc(ultimo.destino);
            await ultimoRef
              .get()
              .then((doc) => {
                if (doc.exists) {
                  ultimo.destino = doc.data().empresa;
                  ultimo.direccion = doc.data().direccion;
                } else {
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          }

          if (actual) {
            var actualRef = db.collection("empresa").doc(actual.destino);
            await actualRef
              .get()
              .then((doc) => {
                if (doc.exists) {
                  actual.destino = doc.data().empresa;
                  actual.direccion = doc.data().direccion;
                } else {
                  console.log("No such document!");
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          }

          if (proximo) {
            var proximoRef = db.collection("empresa").doc(proximo.destino);
            await proximoRef
              .get()
              .then((doc) => {
                if (doc.exists) {
                  proximo.destino = doc.data().empresa;
                  proximo.direccion = doc.data().direccion;
                } else {
                  console.log("No such document!");
                }
              })
              .catch((error) => {
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
  }, []);

  const CONDUCTOR_ITEMS = [
    {
      key: 2,
      text: "Mi Perfil",
      icon: <AccountCircleIcon />,
      onClick: () => {
        setVisible(true);
        //setSelectedItem(null);
        //setOpenModalCamion(true);
      },
    },
    {
      key: 3,
      text: "Cerrar Sesión",
      icon: <ExitToAppIcon />,
      onClick: () => {
        cerrar__sesion();
        history.push("/");
      },
    },
  ];

  const openSlideMenu = () => {
    menu_lateral.current.style.width = "240px";
  };

  const closeSlideMenu = () => {
    menu_lateral.current.style.width = "0";
    content.current.style.marginLeft = "0";
    header.current.style.marginLeft = "0";
  };

  const openNavigationMobileMenu = () => {
    navigation_mobile.current.style.height = "250px";
  };

  const closeNavigationMobileMenu = () => {
    navigation_mobile.current.style.height = "0";
  };

  const menu_lateral = useRef(null);
  const content = useRef(null);
  const header = useRef(null);
  const navigation_mobile = useRef(null);
  return (
    <div className="root">
      <div className="header" ref={header}>
        <Header openSlideMenu={openSlideMenu} openNavigationMobileMenu={openNavigationMobileMenu}/>
      </div>

      <div className="menu_lateral" ref={menu_lateral}>
        <MENU_LATERAL
          closeSlideMenu={closeSlideMenu}
          itemList={
            <MenuTest
              admin_items={CONDUCTOR_ITEMS}
              admin_settings={[]}
              selectedUser={selectedItem}
            />
          }
        />
      </div>

      <div className="content" ref={content}>
        <div className="card-container">
          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
          <div style={{padding : 10}}>
              <span className="card-title">Ultimo viaje: </span>
              <span className="card-fecha">
                {ultimo_viaje
                  ? dayjs(ultimo_viaje.fecha.toDate())
                      .locale("es")
                      .format("DD MMMM YYYY hh:mm A")
                  : "No posee viajes realizados"}
              </span>
              <br />
              <span className="card-title">con destino a :</span>
              <span className="card-fecha">
                {ultimo_viaje ? ultimo_viaje.destino : "No posee viajes realizados"}
              </span>

              <br />
              <span className="card-fecha">
                {ultimo_viaje ? ultimo_viaje.direccion : ""}
              </span>
              <br />
            </div>
            <div className="icon-container">
              <EventAvailableIcon className="icon" />
            </div>
          </div>
          {acutal_viaje ? (
            <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
              <div style={{padding : 10}}>
                <span className="card-title">Su viaje de hoy es: </span>
                <span className="card-fecha">
                  {acutal_viaje
                    ? dayjs(acutal_viaje.fecha.toDate())
                        .locale("es")
                        .format("DD MMMM YYYY hh:mm A")
                    : ""}
                </span>
                <br />
                <span className="card-title">con destino a :</span>
                <span className="card-fecha">
                  {acutal_viaje ? acutal_viaje.destino : "No posee viajes programados"}
                </span>

                <br />
                <span className="card-fecha">
                  {acutal_viaje ? acutal_viaje.direccion : "No posee viajes programados"}
                </span>
                <br />
              </div>
              <div className="icon-container">
                <LocationOnRoundedIcon className="icon" />
              </div>
            </div>
          ) : (
            <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="card-fecha">
                  No tiene viajes programados para el día de hoy.
                </span>
              </div>
              <div className="icon-container">
                <LocationOnRoundedIcon className="icon" />
              </div>
            </div>
          )}

          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
            <div style={{padding : 10}}>
              <span className="card-title">Proximo viaje </span>
              <span className="card-fecha">
                {proximo_viaje
                  ? dayjs(proximo_viaje.fecha.toDate())
                      .locale("es")
                      .format("DD MMMM YYYY hh:mm A")
                  : ""}
              </span>
              <br />
              <span className="card-title">con destino a :</span>
              <span className="card-fecha">
                {proximo_viaje ? proximo_viaje.destino : ""}{" "}
              </span>
              <br />
              <span className="card-fecha">
                {proximo_viaje ? proximo_viaje.direccion : ""}{" "}
              </span>
              <br />
            </div>
            <div className="icon-container">
              <ScheduleIcon className="icon" />
            </div>
          </div>
        </div>
        <div className="table">
          <TABLA_VIAJES_CONDUCTOR
            setSelectedItem={setSelectedItem}
            setViajes={setViajes}
          />
        </div>
        <DRAWERPERFILUSUARIO
        visible={visible}
        setVisible={setVisible}
        usuario={usuario}
        closeSlideMenu={closeSlideMenu}
      />
      </div>
    </div>
  );
};

export default Conductor_viajes;
