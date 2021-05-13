import React, { useEffect, useRef, useState } from "react";

/**import de componentes */
import HEADER from "../../../components/Header";
import MENU_LATERAL from "../../../components/Side_menu";
import DRAWER_SETTINGS from "../../../components/DrawerSettings";
import { MenuTest } from "../../../components/items/Menu_items";

import { NavLink, useHistory } from "react-router-dom";

/** import de iconos */
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

/** import de funciones base de datos */
import { db } from "../../../db/firebase";
import { cerrar__sesion } from "../../../db/auth";

/** Estilos */
import "./estilos_admin_home.css";
import {CARDS_ADMIN_BG_COLOR, CARDS_ADMIN_TEXT_COLOR } from "../../../variables";

/** Libreria para manipulación de fechas */
import * as dayjs from "dayjs";
var weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

const Admin_home = (props) => {
  /** hook drawer admin */
  const [visible, setVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);

  let history = useHistory();

  const ADMIN_HOME_ITEMS = [
    {
      text: "Dashboard",
      icon: <HomeIcon />,
    },
  ];

  const ADMIN_SETTINGS = [
    {
      text: "Ajustes",
      icon: <SettingsIcon />,
      onClick: () => {
        setVisible(true);
      },
    },
    {
      text: "Cerrar Sesión",
      icon: <ExitToAppIcon />,
      onClick: () => {
        cerrar__sesion();
        history.push("/");
      },
    },
  ];

  const [data, setData] = useState([]);
  const [dataViajes, setDataViajes] = useState([]);
  const [dataUsuarios, setDataUsuarios] = useState([]);
  const [dataEmpresas, setDataEmpresas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const get__usuario = () => {
    const url = "http://localhost:4000/api/admin/";
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(function () {
            setDataUsuarios(result);
            setIsLoaded(true);
          }, 1000);
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          //console.log(error);
        }
      );
  };

  const get__camion = async () => {
    const camionRef = db.collection("camion");
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const camiones = [];
    snapshot.forEach((doc) => {
      var c = {
        id: doc.id,
        modelo: doc.data().modelo,
        marca: doc.data().marca,
        patente: doc.data().patente,
        disponible: doc.data().disponible ? "Disponible" : "En uso",
      };
      camiones.push(c);
    });
    setTimeout(function () {
      setData(camiones);
      setIsLoaded(true);
    }, 1000);
  };

  const get__viajes = async () => {
    let item__list = [];
    let data_camiones__list = [];
    await db
      .collection("usuario")
      .get()
      .then((querySnapshot) => {
        let item = {};
        let data_camiones = {};
        querySnapshot.forEach((doc) => {
          doc.data().viajes.forEach((x) => {
            var formatDate = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY HH:MM A");
            var formatDate2 = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY");

            item = {
              id: x.id,
              fechaSorter: x.fecha.toDate(),
              fecha: formatDate,
              conductor: doc.data().nombres,
              camion: x.camion,
              origen: x.origen,
              destino: x.destino,
              estado: x.estado ? "True" : "false",
              id_user: doc.id,
              id_camion: x.id_camion,
              fecha_camion: formatDate2,
            };

            data_camiones = {
              id_camion: x.id_camion,
              fecha: formatDate2,
            };

            item__list.push(item);
          });
        });
        setDataViajes(item__list);
      });
  };

  const get__empresas = async () => {
    const camionRef = db.collection("empresa");
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const empresas = [];
    snapshot.forEach((doc) => {
      var e = {
        id: doc.id,
        modelo: doc.data().modelo,
        marca: doc.data().marca,
        patente: doc.data().patente,
        disponible: doc.data().disponible ? "Disponible" : "En uso",
      };
      empresas.push(e);
    });
    setTimeout(function () {
      setDataEmpresas(empresas);
      setIsLoaded(true);
    }, 1000);
  };
  

  useEffect(() => {
    get__camion();
    get__viajes();
    get__usuario();
    get__empresas();
  }, []);

  useEffect(() => {
    let user = localStorage.getItem("user");
    console.log("usuario => ", user);
    var docRef = db.collection("usuario").doc(user);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setUsuario(doc.data());
        } else {
          // doc.data() will be undefined in this case
          //console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, []);

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
        <HEADER openSlideMenu={openSlideMenu} openNavigationMobileMenu={openNavigationMobileMenu}/>
      </div>
      
      <div className="navigation_mobile" ref={navigation_mobile}>
        <div style={{backgroundColor : "#1E1F1F", width : "100%", display : "flex", justifyContent : "center", opacity : "1"}}>
          <span>
            <a href="#" className="nav_link" onClick={closeNavigationMobileMenu}>  
              <i class="bi bi-x" style={{ fontSize: 42, marginLeft: 5, marginRight: 5 }}></i>
            </a>
          </span>
        </div>
          
            <NavLink to={"/admin/home"} className="nav_link">
              <span>INICIO</span>
            </NavLink>
             <NavLink to={"/admin/conductores"} className="nav_link">
              <span>USUARIOS</span>
            </NavLink>
            <NavLink to={"/admin/camiones"} className="nav_link">
              <span>CAMIONES</span>
            </NavLink>  
            <NavLink to={"/admin/viajes"} className="nav_link">
              <span>VIAJES</span>
            </NavLink> 
            <NavLink to={"/admin/empresa"} className="nav_link">
              <span>EMPRESAS</span>
            </NavLink> 
        
      </div>

      <div className={"menu_lateral"} ref={menu_lateral}>
        <MENU_LATERAL
          closeSlideMenu={closeSlideMenu}
          itemList={
            <MenuTest
              admin_items={ADMIN_HOME_ITEMS}
              admin_settings={ADMIN_SETTINGS}
            />
          }
        />
      </div>

      <div className="content" ref={content}>
        <div className="card_container">
          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
            <div className="card_info">
              {isLoaded ? (
                <span className={"card_title"}>{dataUsuarios.length}</span>
              ) : (
                "cargando..."
              )}
              <span className="card_text">usuarios registrados</span>
            </div>

            <div className="icon_container">
              <i class="bi bi-person icon"></i>
            </div>
          </div>

          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
            <div className="card_info">
              {isLoaded ? (
                <span className="card_title">{dataViajes.length}</span>
              ) : (
                "cargando..."
              )}
              <span className="card_text">viajes registrados</span>
            </div>

            <div className="icon_container">
              <i class="bi bi-calendar icon"></i>
            </div>
          </div>
        </div>
        <div className="card_container">
          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
            <div className="card_info">
              {isLoaded ? (
                <span className="card_title">{data.length}</span>
              ) : (
                "cargando..."
              )}

              <span className="card_text">camiones registrados</span>
            </div>

            <div className="icon_container">
              <i class="bi bi-truck icon"></i>
            </div>
          </div>

          <div className="card" style={{backgroundColor : CARDS_ADMIN_BG_COLOR}}>
            <div className="card_info">
              {isLoaded ? (
                <span className="card_title">{dataEmpresas.length}</span>
              ) : (
                "cargando..."
              )}
              <span className="card_text">empresas registradas</span>
            </div>

            <div className="icon_container">
              <i class="bi bi-building icon"></i>
            </div>
          </div>
        </div>
        <div className="grafico_container">INFO ADICIONAL.</div>
        <DRAWER_SETTINGS visible={visible} setVisible={setVisible} />
      </div>
    </div>
  );
};

export default Admin_home;
