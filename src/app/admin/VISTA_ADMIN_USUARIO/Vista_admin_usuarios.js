import React, { useRef, useState } from "react";

/** Components import */
import HEADER from "../../../components/Header";
import MENU_LATERAL from "../../../components/Side_menu";
import DRAWER_SETTINGS from "../../../components/DrawerSettings";
import Alert_cerrar from "../../../components/Alert";
import ModalConductor from "../../../components/modals/ModalConductor";
import FormConductor from "../../../components/forms/FormConductor";
import { MenuTest } from "../../../components/items/Menu_items";

/** imports de tablas*/
import TABLA_CONDUCTOR_ANT from "../data_tables/DataTable_conductor_ant";

import { NavLink, useHistory } from "react-router-dom";


import { cerrar__sesion } from "../../../db/auth";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import "./estilos_admin_usuario.css"

const Admin_conductores = () => {
 /** hook drawer admin */
 const [visible, setVisible] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isSelected, setIsSelected] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);

  /**  */
  const [openModalConductor, setOpenModalConductor] = useState(null);

  let history = useHistory();

  const ADMIN_CONDUCTOR_ITEMS = [
    {
      key : 2,
      text: "Crear Cuenta",
      icon: <AddBoxIcon />,
      onClick: () => {setSelectedUser(null); setOpenModalConductor(true); setSelectedItem(null)},
    },
    {
      key : 3,
      text: "Modificar Cuenta",
      icon: <EditIcon />,
      onClick: () => setOpenModalConductor(true),
      isDisabled: selectedUser ? false : true,
    },
    {
      key : 4,
      text: "Eliminar Cuenta",
      icon: <DeleteIcon />,
      //onClick: () => delete__user(idUser),
      //onClick: () => handleClickOpen(),
      onClick: () => setOpen(true),
      isDisabled: selectedUser ? false : true,
    },
  ];

  const ADMIN_SETTINGS = [
    {
      key : 2,
      text: "Ajustes",
      icon: <SettingsIcon />,
      onClick : () => {setVisible(true)}
    },
    {
      key : 3,
      text: "Cerrar Sesión",
      icon: <ExitToAppIcon />,
      onClick: () => {
        cerrar__sesion();
        history.push("/");
      },
    },
  ];

  const fun = (user) => {
    console.log("FROM PARENT !!!!!" + user);
    setSelectedUser(user);
  };

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
              selectedUser = {selectedUser}
            />
          }
        />
      </div>

      <div className="content" ref={content}>
      <div className="info">CAMIONES</div>
        <div className="table">
          {/*<TABLA_CONDUCTOR fun={fun} setIsSelected={setIsSelected} />*/}
          <TABLA_CONDUCTOR_ANT 
            setSelectedUser={setSelectedUser} 
            setIsSelected={setIsSelected} 
            selectedUser={selectedUser}
            setSelectedItem={setSelectedItem}
          />
        </div>
      </div>
      <DRAWER_SETTINGS visible ={visible} setVisible={setVisible}/>
      <Alert_cerrar
        openAlert={open}
        setOpenAlert={setOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      ></Alert_cerrar>

      <ModalConductor
        openModalConductor={openModalConductor}
        setOpenModalConductor={setOpenModalConductor}
        selectedUser={selectedUser}
        selectedItem={selectedItem}
      >
        <FormConductor selectedUser={selectedUser} setOpenModalConductor={setOpenModalConductor}/>
      </ModalConductor>
    </div>
  );
};

export default Admin_conductores;
