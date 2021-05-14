import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import { Drawer } from "antd";

import { auth, db } from "./../db/firebase";
import { cerrar__sesion } from "./../db/auth";

import { useHistory } from "react-router-dom";

import "./estilos_drawer_usuario.css";

const DrawerPerfilUsuario = (props) => {
  const { visible, setVisible, usuario, closeSlideMenu } = props;

  const [newPass, setNewPass] = useState("");
  const [actualPass, setActualPass] = useState("");
  const [disabled, setDisabled] = useState(true);

  const [errorPass, setErrorPass] = useState(false);
  const [succefulPass, setSuccesfulPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let history = useHistory();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    closeSlideMenu();

    setNewPass("");
    setActualPass("");
  };

  const passActual = async (e) => {
    await setActualPass(e.target.value);
    console.log("change pass => ", actualPass);
  };

  const passListener = (e) => {
    let verify = e.target.value;

    setNewPass(verify);

    console.log("change new pass => ", verify);

    console.log(verify.length);

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
    console.log("CAMBIAR BUTTON => ", actualPass);
    let pass_actual = localStorage.getItem("password");
    console.log("pass acutal --> ", pass_actual);

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
            history.push("/");
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

  const file = useRef();
  const [photoUrl, setPhotoUrl] = useState("");
  const [foto_error, setFotoError] = useState(false);

  const uploadPhoto = async () => {
    console.log("ON CHANGE FOTO");
    const file_img = file.current.files[0];
    //setPhotoUrl(file_name);

    if (file_img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      await reader.readAsDataURL(file_img);
    }
  };

  const cambiar_foto = () => {
    console.log("Cambiar foto");
    var userRef = db.collection("usuario").doc(usuario.id);

    // Set the "capital" field of the city 'DC'
    return userRef
      .update({
        photoURL: photoUrl,
      })
      .then(() => {
        console.log("Document successfully updated!");
        setFotoError(true);
        setTimeout(() => {
          setFotoError(false);
        }, 1500);
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  };

  useEffect(() => {
    console.log(usuario);
  }, []);

  return (
    <>
      <Drawer
        title="MI PERFIL"
        placement={"left"}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={"left"}
        width={300}
      >
        <p className="Title">Mis Datos</p>

        <div className="d-grid gap-3">
          <div className="border Wrapper-image-perfil">
            <img
              src={photoUrl ? photoUrl : usuario ? usuario.photoURL : ""}
              className="Image-perfil"
            ></img>
          </div>
          {foto_error ? <strong className="text-success">Foto actualizada</strong> : null}
          <input
            name="photoUrl"
            id="id_photoUrl"
            type="file"
            ref={file}
            onChange={(e) => {
              uploadPhoto();
            }}
          />
          <button onClick={() => cambiar_foto()}>Cambiar foto</button>
          <div className="p-2 bg-light border">
            {usuario ? usuario.rut : ""}
          </div>
          <div className="p-2 bg-light border">
            {usuario ? usuario.nombres + " " + usuario.apellidos : ""}
          </div>

          <div className="p-2 bg-light border">
            {usuario ? usuario.email : ""}
          </div>
          <div className="p-2 bg-light border">
            {usuario ? usuario.telefono : ""}
          </div>
          <span className="Title">Ajustes</span>
          {errorPass ? (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <strong>Error: </strong> Contraseñas no coinciden.
            </div>
          ) : (
            ""
          )}
          {succefulPass ? (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <strong>Exito: </strong> Redirigiendo....
            </div>
          ) : (
            ""
          )}
          <span id="passwordHelpInline" class="form-text">
            Contraseña actual:
          </span>
          <div className="input-group mb-1 mx-auto">
            <span className="input-group-text" id="basic-addon1">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña actual"
              aria-label="Contraseña1"
              aria-describedby="basic-addon1"
              onChange={(e) => passActual(e)}
              minLength="6"
              autocomplete="new-password"
            />
          </div>
          <span id="passwordHelpInline" className="form-text">
            Nueva contraseña: (debe ser mayor a 7 caracteres y con una mayuscula
            al menos)
          </span>
          <div className="input-group mb-1 mx-auto">
            <span className="input-group-text" id="basic-addon1">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña nueva"
              aria-label="Contraseña2"
              aria-describedby="basic-addon2"
              onKeyUp={(e) => passListener(e)}
              minLength="6"
              autocomplete="new-password"
            />
          </div>
          <button
            className="btn btn-danger mt-3"
            onClick={changePassword}
            disabled={disabled}
          >
            Cambiar Contraseña
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerPerfilUsuario;
