import React, { useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

/** Components import */
import HEADER from "../../../components/Header";
import MENU_LATERAL from "../../../components/Side_menu";
import DRAWER_SETTINGS from "../../../components/DrawerSettings";

/** imports de tablas*/
import TABLA_EMPRESA from "../data_tables/DataTable_empresa";

import { NavLink, useHistory } from "react-router-dom";

import { MenuTest } from "../../../components/items/Menu_items";
import { cerrar__sesion } from "../../../db/auth";

import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmAlert from "../../../components/ConfirmAlert";

import ModalEmpresa from "../../../components/modals/ModalEmpresa";
import FormEmpresa from "../../../components/forms/FormEmpresa";


import { db } from "../../../db/firebase";

import { useSnackbar } from "notistack";

import "./estilos_admin_empresa.css";
import {INFO_BG_COLOR, INFO_TEXT_COLOR} from "../../../variables";

const Admin_empresas = () => {
   /** hook drawer admin */
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelected, setIsSelected] = useState(true);
  const [openModalEmpresa, setOpenModalEmpresa] = useState(null);
  const [mensaje_accion, setMensajeAccion] = useState([]);

  const[selectRows, setSelectRows]  = useState([]);

  let history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const delete__empresa = async () => {
    const res = await db.collection("empresa").doc(selectedItem.id).delete();
    var men = "Empresa ID: " + selectedItem.id + " ha sido eliminado.";
    enqueueSnackbar(men, {
      variant: "error",
      autoHideDuration: 3000,
    });
    setMensajeAccion({mensaje : men, type : "error"})

  };

  const ADMIN_CONDUCTOR_ITEMS = [
    {
      key: 2,
      text: "Agregar Empresa",
      icon: <AddBoxIcon />,
      onClick: () => {
        setSelectedItem(null);
        setOpenModalEmpresa(true);
      },
    },
    {
      key: 3,
      text: "Modificar Empresa",
      icon: <EditIcon />,
      onClick: () => setOpenModalEmpresa(true),
      isDisabled: selectedItem ? false : true,
    },
    {
      key: 4,
      text: "Eliminar Empresa",
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
        
      <div className="info" style={{backgroundColor : INFO_BG_COLOR}}> <span style={{color : INFO_TEXT_COLOR}}>EMPRESAS</span></div>
        <div className="table">
          {/** Tabla camiones */}
          <TABLA_EMPRESA
            setSelectedItem={setSelectedItem}
            setIsSelected={setIsSelected}
            selectedItem={selectedItem}
            mensaje_accion = {mensaje_accion}
            
            selectRows = {selectRows} /**!!!!!! */
            setSelectRows={setSelectRows}
            openSlideMenu={openSlideMenu}
          />
        </div>
        <DRAWER_SETTINGS visible ={visible} setVisible={setVisible}/>
        <ModalEmpresa
          title={"Empresa"}
          description={"Descripción de la accion a realizar"}
          selectedItem={selectedItem}
          openModalEmpresa={openModalEmpresa}
          setOpenModalEmpresa={setOpenModalEmpresa}
          setSelectedItem={setSelectedItem}
          
        >
          <FormEmpresa
            selectedItem={selectedItem}
            setOpenModalEmpresa={setOpenModalEmpresa}
            setSelectedItem={setSelectedItem}
          />
        </ModalEmpresa>

        <ConfirmAlert
          openAlert={open}
          setOpenAlert={setOpen}
          title={"¿Quieres borrar esta empresa?"}
          description={"Esta acción borrará permanentemente los datos de esta empresa."}
          men={selectedItem ? selectedItem.empresa : null}
          action={delete__empresa}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        ></ConfirmAlert>
      </div>
    </div>
  );
};

export default Admin_empresas;