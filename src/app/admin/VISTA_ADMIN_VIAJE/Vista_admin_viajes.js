import React, { useRef, useState } from "react";

/** Components import */
import HEADER from "../../../components/Header";
import MENU_LATERAL from "../../../components/Side_menu";
import DRAWER_SETTINGS from "../../../components/DrawerSettings";

/** imports de tablas*/
import TABLA_VIAJE_ANT from "../data_tables/DataTable_viajes_ant";

import { NavLink, useHistory } from "react-router-dom";

import { MenuTest } from "../../../components/items/Menu_items";
import { cerrar__sesion } from "../../../db/auth";

import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmAlert from "../../../components/ConfirmAlert";

import ModalViaje from "./ModalViaje";
import ModalViaje_copy from "./ModalViaje_copy";

import { db, fire } from "../../../db/firebase";

import { useSnackbar } from "notistack";

import "./estilos_admin_viaje.css";
import {INFO_BG_COLOR, INFO_TEXT_COLOR} from "../../../variables";

const Admin_viajes = () => {

  /** hook drawer admin */
  const [visible, setVisible] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelected, setIsSelected] = useState(true);
  const [user__id, setUser__id] = useState("");

  const [camion__id, setCamion__id] = useState("");
  const [fecha_camion, setFechaCamion] = useState("");
  const [itemToDelete, setItemToDelete] = useState(null);

  const [direccion, setDireccion] = useState("Dirección no asignada.");

  /**  */
  const [openModalViaje, setOpenModalViaje] = useState(null);

  const [dataCamionFecha, setDataCamionFecha] = useState(null);

  const [mensaje_accion, setMensajeAccion] = useState(null);

  const [conductor, setConductor] = useState("");
  const [email_destino, setEmailDestino] = useState("");

  const[selectRows, setSelectRows]  = useState([]);

  let history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const delete__viaje = () => {
    console.log(" => ",user__id);
    console.log("=> ",fecha_camion);
  
    var cityRef = db.collection("usuario").doc(user__id);
    
    cityRef.update({
      viajes: fire.firestore.FieldValue.arrayRemove(selectedItem)
    });

    var camionRef = db.collection("camion").doc(camion__id);
    console.log(selectedItem.id)
    console.log(selectedItem.fecha_camion)
    var disp = {
      id : selectedItem.id,
      fecha : fecha_camion,
    }

    camionRef.update({
      disp : fire.firestore.FieldValue.arrayRemove(disp)
    })

    var men = "VIAJE ID: => "+selectedItem.id+" ELIMINADO.";
      enqueueSnackbar(men, {
        variant: "error",
        preventDuplicate: true,
        autoHideDuration: 3000,
      });
  };

  const ADMIN_CONDUCTOR_ITEMS = [
    {
      key: 2,
      text: "Crear Viaje",
      icon: <AddBoxIcon />,
      onClick: () => {
        setSelectedItem(null);
        setOpenModalViaje(true);
      },
    },
    {
      key: 3,
      text: "Modificar Viaje",
      icon: <EditIcon />,
      onClick: () => setOpenModalViaje(true),
      isDisabled: selectedItem ? false : true,
    },
    {
      key: 4,
      text: "Eliminar Viaje",
      icon: <DeleteIcon />,
      onClick: () => setOpen(true),
      isDisabled: selectedItem ? false : true,
    },
  ];

  const ADMIN_SETTINGS = [
    {
      key: 2,
      text: "Ajustes",
      icon: <SettingsIcon />,
      onClick : () => {setVisible(true)}
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

    setSelectRows([]);
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

      <div className="menu_lateral" ref={menu_lateral}>
        <MENU_LATERAL
          closeSlideMenu={closeSlideMenu}
          itemList={
            <MenuTest
              admin_items={ADMIN_CONDUCTOR_ITEMS}
              admin_settings={ADMIN_SETTINGS}
              selectedUser={selectedItem}
            />
          }
        />
      </div>
      

      <div className="content" ref={content}>
      <div className="info" style={{backgroundColor : INFO_BG_COLOR}}> <span style={{color : INFO_TEXT_COLOR}}>VIAJES</span></div>
      <div className="table">

          <TABLA_VIAJE_ANT
            setSelectedItem={setSelectedItem}
            setIsSelected={setIsSelected}
            selectedItem={selectedItem}
            setUser__id = {setUser__id}
            user__id = {user__id}
            setCamion__id = {setCamion__id}
            setDataCamionFecha = {setDataCamionFecha}
            setFechaCamion={setFechaCamion}
            setItemToDelete={setItemToDelete}
            mensaje_accion={mensaje_accion}

            setConductor={setConductor}
            setDireccion={setDireccion}

            selectRows = {selectRows} /**!!!!!! */
            setSelectRows={setSelectRows}
            openSlideMenu={openSlideMenu}
            setEmailDestino={setEmailDestino}
          />
        </div>
        <DRAWER_SETTINGS visible ={visible} setVisible={setVisible} closeSlideMenu={closeSlideMenu}/>
        <ModalViaje_copy
          title={"Viaje"}
          description={"Descripción de la accion a realizar"}
          openModalViaje={openModalViaje}
          setOpenModalViaje={setOpenModalViaje}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
          user__id={user__id}
          dataCamionFecha={dataCamionFecha}
          itemToDelete={itemToDelete}
          conductor={conductor}
          setConductor={setConductor}

          direccion={direccion}
          setDireccion={setDireccion}
          closeSlideMenu={closeSlideMenu}
          user__id={user__id}

          
          
        >
        </ModalViaje_copy>
        <ConfirmAlert
          openAlert={open}
          setOpenAlert={setOpen}
          title={"¿Quieres borrar este viaje?"}
          description={"Esta acción borrará permanentemente los datos de este viaje."}
          action={delete__viaje}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          men={selectedItem ? selectedItem.direccion : null}
          email_destino={email_destino}
          closeSlideMenu={closeSlideMenu}
        />
      </div>
    </div>
  );
};

export default Admin_viajes;
