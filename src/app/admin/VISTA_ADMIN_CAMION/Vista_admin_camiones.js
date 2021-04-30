import React, { useRef, useState } from "react";

/** Components import */
import HEADER from "../../../components/Header";
import MENU_LATERAL from "../../../components/Side_menu";
import DRAWER_SETTINGS from "../../../components/DrawerSettings";

/** imports de tablas*/
import TABLA_CAMION_ANT from "../data_tables/DataTable_camion_ant";

import { NavLink, useHistory } from "react-router-dom";

import { MenuTest } from "../../../components/items/Menu_items";
import { cerrar__sesion } from "../../../db/auth";

import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmAlert from "../../../components/ConfirmAlert";

import ModalCamion from "../../../components/modals/ModalCamion";
import FormCamion from "../../../components/forms/FormCamion";

import { db } from "../../../db/firebase";

import { useSnackbar } from "notistack";

import "./estilos_admin_camion.css";

const Admin_conductores = () => {
   /** hook drawer admin */
   const [visible, setVisible] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [isSelected, setIsSelected] = useState(true);

  /**  */
  const [openModalCamion, setOpenModalCamion] = useState(null);

  const [mensaje_accion, setMensajeAccion] = useState([]);

  let history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const delete__camion = async () => {
    const res = await db.collection("camion").doc(selectedItem.id).delete();
    var men = "Camion ID: " + selectedItem.id + " ha sido eliminado.";
    enqueueSnackbar(men, {
      variant: "error",
      autoHideDuration: 3000,
    });
    setMensajeAccion({ mensaje: men, type: "error" });
  };

  const ADMIN_CONDUCTOR_ITEMS = [
    {
      key: 2,
      text: "Agregar Camion",
      icon: <AddBoxIcon />,
      onClick: () => {
        setSelectedItem(null);
        setOpenModalCamion(true);
      },
    },
    {
      key: 3,
      text: "Modificar Camion",
      icon: <EditIcon />,
      onClick: () => setOpenModalCamion(true),
      isDisabled: selectedItem ? false : true,
    },
    {
      key: 4,
      text: "Eliminar Camion",
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
        <div className="info">CAMIONES</div>

        <div className="table">
          {/** Tabla camiones */}
          <TABLA_CAMION_ANT
            setSelectedItem={setSelectedItem}
            setIsSelected={setIsSelected}
            selectedItem={selectedItem}
            mensaje_accion={mensaje_accion}
          />
        </div>
        <DRAWER_SETTINGS visible ={visible} setVisible={setVisible}/>
        <ModalCamion
          title={"Camion"}
          description={"Descripción de la accion a realizar"}
          openModalCamion={openModalCamion}
          setOpenModalCamion={setOpenModalCamion}
          setSelectedItem={setSelectedItem}
          selectedItem={selectedItem}
        >
          <FormCamion
            selectedItem={selectedItem}
            setOpenModalCamion={setOpenModalCamion}
            setSelectedItem={setSelectedItem}
          />
        </ModalCamion>
        <ConfirmAlert
          openAlert={open}
          setOpenAlert={setOpen}
          title={"¿Quieres borrar este camión?"}
          description={
            "Esta acción borrará permanentemente los datos del camion."
          }
          action={delete__camion}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        ></ConfirmAlert>
      </div>
    </div>
  );
};

export default Admin_conductores;
