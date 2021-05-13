import React, { useState } from "react";
import "antd/dist/antd.css";
import { Drawer } from "antd";

import { auth } from "./../db/firebase";
import {cerrar__sesion} from "./../db/auth";

import { useHistory } from "react-router-dom";

const DrawerSettings = (props) => {
  const { visible, setVisible } = props;

  const [disabled, setDisabled] = useState(true);
  const [actualPass, setActualPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [errorPass, setErrorPass] = useState(false);
  const [succefulPass, setSuccesfulPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  let history = useHistory();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onChangeNewPass = async (e) => {
    let verify = e.target.value;
    console.log(verify);

    await setNewPass(verify);

    if (verify.length > 7) {
      if (/[A-Z]/.test(verify) && /[a-z]/.test(verify)) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  };

  const changePassword = () => {
    let pass_actual = localStorage.getItem("password");
    console.log("actual pass => ", actualPass);
    console.log("new pass => ", newPass);

    var user = auth.currentUser;
    var newPassword = newPass;
    console.log(user);

    if (pass_actual === actualPass) {
      console.log("CONTRASEÑAS COINCIDEN");
      var user = auth.currentUser;
      var newPassword = newPass;

      user
        .updatePassword(newPassword)
        .then(function () {
          setSuccesfulPass(true);
          setTimeout(() => {
            setSuccesfulPass(false);
            //redirigir al login.
            cerrar__sesion();
            history.push('/');
          }, 5000);
        })
        .catch(function (error) {
          console.log("error => ", error);
          setErrorMessage("Para realizar esta acción inicie sesión de nuevo.");
          setErrorPass(true);
          setTimeout(() => {
            setErrorPass(false);
          }, 5000);
        });
    } else {
      console.log("CONTRASEÑAS NO COINCIDEN");
      setErrorMessage("Contraseña acutal no coincide con nuestros registros.");
      setErrorPass(true);
      setTimeout(() => {
        setErrorPass(false);
      }, 5000);
    }
  };

  return (
    <>
      <Drawer
        title="Administrador"
        placement={"left"}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={"left"}
      >
        {errorPass ? 
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error: </strong> Contraseñas no coinciden.
          </div>
          :
          ""
          }
          {succefulPass ? 
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Exito: </strong> Redirigiendo....
          </div>
          :
          ""
          }
        <p>Contraseña actual:</p>
        <div class="input-group mb-3 mx-auto">
          <span class="input-group-text" id="basic-addon1">
            @
          </span>
          <input
            type="password"
            class="form-control"
            placeholder="Contraseña actual"
            aria-label="Contraseña"
            aria-describedby="basic-addon1"
            onKeyUp={(e) => setActualPass(e.target.value)}
          />
        </div>
        <p>Contraseña nueva:</p>
        <div class="input-group mb-3 mx-auto">
          <span class="input-group-text" id="basic-addon1">
            @
          </span>
          <input
            type="password"
            class="form-control"
            placeholder="Contraseña nueva"
            aria-label="Contraseña"
            aria-describedby="basic-addon1"
            onKeyUp={(e) => onChangeNewPass(e)}
            minLength="6"
          />
        </div>
        <p>
          {disabled
            ? "La contraseña debe ser mayor de 8 caracteres."
            : "Contraseña Valida :)"}
        </p>
        <button
          class="btn btn-danger mt-3"
          onClick={changePassword}
          disabled={disabled}
        >
          Cambiar Contraseña
        </button>
      </Drawer>
    </>
  );
};

export default DrawerSettings;
