import React, { useRef, useState } from "react";
import { TextField, Box, Button, Avatar } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { storage } from "../../db/firebase";

import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import FormErrorMessage from "../FormErrorMessage";

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundColor: "#fff",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    //minHeight: '100vh',
  },

  container_wrap: {
    //backgroundColor: "#a4c7c2",
    width: "65vw",
    padding: 10,

    display: "flex",
  },

  container: {
    //backgroundColor: "#a4c7c2",
    width: "60vw",
    padding: 10,
  },

  input__email: {
    marginBottom: 10,
  },

  container__nombres: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    columnGap: 20,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  container__rut_telefono_domicilio: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    columnGap: 20,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  container__inputFile: {
    marginTop: 15,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    columnGap: 20,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  container__avatar: {
    //backgroundColor: "#a4bac7",
    width: "15vw",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  avatar: {
    //backgroundColor: "#3f276c",
    width: "100%",
    height: 200,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  input__nombres: {
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  input__rut_telefono: {
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  input__domicilio: {
    width: "100%",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },

  input__file: {
    width: "50%",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const FormConductor = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar, /*closeSnackbar*/ } = useSnackbar();

  const { selectedUser, setOpenModalConductor } = props;

  const classes = useStyles();

  //const [fileName, setFileName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  //const [newUser, setNewUser] = useState(null);

  //const [snackBar, setSnackBar] = useState("");

  const file = useRef();

  const uploadPhoto = async () => {
    console.log("ON CHANGE FOTO");
    const file_img = file.current.files[0];
    //setPhotoUrl(file_name);

    if(file_img){
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      }
      await reader.readAsDataURL(file_img);
      
    }
  };

  const edit__user = async (edit_user) => {
    console.log("!!! API -> EDITARUSUARIO !!!");
    const url = "http://localhost:4000/api/admin/edit/";

    fetch(url, {
      method: "PUT", // or 'PUT'
      body: JSON.stringify(edit_user), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        /** !!!!! ESTA SEGURO DE LOS CAMBIOS REALIZADOS? -> DTOS DEL USUARIO */

        setOpenModalConductor(false)
        console.log("Success:", response)
        var men = "Usuario editado exitosamente.";
        enqueueSnackbar(men, {
          variant: "info",
          preventDuplicate: true,
        });
      });
  };

  const register__user = async (new_user) => {
    console.log("!!! API -> REGISTRAR USUARIO !!!");
    const url = "http://localhost:4000/api/admin/";

    fetch(url, {
      method: "POST", // or 'PUT'
      body: JSON.stringify(new_user), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .catch((error) => {
        //var men = "Usuario " + response.email + " creado exitosamente.";
        enqueueSnackbar(error, {
          variant: "success",
        });
      })
      .then((response) => {
        /** !!!!! ESTA SEGURO DE CREAR EL SIGUIENTE USUARIO? -> DTOS DEL USUARIO */
        setOpenModalConductor(false)

        var men = "Usuario " + response.email + " creado exitosamente.";
        var variant = "";
        if (response.code) {
          switch (response.code) {
            case "auth/email-already-exists":
              men = "Correo ya se encuentra registrado";
              variant = "warning";
              break;
          default :
            break;
          }
          enqueueSnackbar(men, {
            variant: variant,
            preventDuplicate: true,
          });
        } else {
          var men = "Usuario " + response.email + " creado exitosamente.";
          enqueueSnackbar(men, {
            variant: "success",
          });
        }
      });
  };

  const onSubmit = (data) => {
    if (selectedUser) {
      console.log("!!! MODIFICAR USUARIO !!!");

      var metadata = {
        contentType: "image/jpeg",
      };
      var storageRef = storage.ref();
      var pathName = "avatars/" + data.email + ".profilePhoto";
      var avatarRef = storageRef.child(pathName);

      avatarRef
        .put(file.current.files[0], metadata)
        .then(function (snapshot) {
          avatarRef.getDownloadURL().then((x) => {
            //setPhotoUrl(x);
            var new_user = {
              id: selectedUser.id,
              email: data.email,
              nombres: data.nombres,
              apellidos: data.apellidos,
              rut: data.rut,
              telefono: data.telefono,
              photoUrl: photoUrl ? x : selectedUser.photoURL,
              //domicilio : data.domicilio
            };

            edit__user(new_user);
          });
          console.log("Uploaded a blob or file!");
        });
    } else {
      console.log("!!! REGISTRAR USUARIO NUEVO !!!");

      var metadata = {
        contentType: "image/jpeg",
      };
      var storageRef = storage.ref();
      var pathName = "avatars/" + data.email + ".profilePhoto";
      var avatarRef = storageRef.child(pathName);

      avatarRef
        .put(file.current.files[0], metadata)
        .then(function (snapshot) {
          avatarRef.getDownloadURL().then((x) => {
            setPhotoUrl(x);

            var new_user = {
              email: data.email,
              nombres: data.nombres,
              apellidos: data.apellidos,
              rut: data.rut,
              telefono: data.telefono,
              photoUrl: x,
              //domicilio : data.domicilio
            };

            //console.log(new_user);

            register__user(new_user);
          });
          console.log("Uploaded a blob or file!");
        });
    }
  };

  return (
    <div className={classes.root}>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className={classes.container_wrap}>
          <Box>
            <Box className={classes.container__avatar}>
              <Box className={classes.avatar}>
                <Avatar
                  alt="user_avatar"
                  src={photoUrl ? photoUrl : selectedUser.photoURL}
                  variant="square"
                  className={classes.avatar}
                />
              </Box>
            </Box>
          </Box>

          <Box className={classes.container}>
            <Box className={classes.input__email}>
              <TextField
                name="email"
                id="id_email"
                label="Email"
                fullWidth
                inputRef={register({
                  required: true,
                  pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                })}
                defaultValue={selectedUser ? selectedUser.email : ""}
              />
              {errors.email && errors.email.type === "required" && (
                <FormErrorMessage>'Email' es Requerido.</FormErrorMessage>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <FormErrorMessage>Formato de correo invalido.</FormErrorMessage>
              )}
            </Box>

            <Box className={classes.container__nombres}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <TextField
                  name="nombres"
                  id="id_nombres"
                  label="Nombres"
                  className={classes.input__nombres}
                  inputRef={register({ required: true })}
                  defaultValue={selectedUser ? selectedUser.nombres : ""}
                />
                {errors.nombres && errors.nombres.type === "required" && (
                  <FormErrorMessage>'Nombre' es requerido.</FormErrorMessage>
                )}
              </Box>

              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <TextField
                  name="apellidos"
                  id="id_apellidos"
                  label="Apellidos"
                  className={classes.input__nombres}
                  inputRef={register({ required: true })}
                  defaultValue={selectedUser ? selectedUser.apellidos : ""}
                />
                {errors.apellidos && errors.apellidos.type === "required" && (
                  <FormErrorMessage>'Apellido' es requerido.</FormErrorMessage>
                )}
              </Box>
            </Box>

            <Box className={classes.container__rut_telefono_domicilio}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <TextField
                  name="rut"
                  id="id_rut"
                  label="Rut"
                  className={classes.input__rut_telefono}
                  inputRef={register({ required: true })}
                  defaultValue={selectedUser ? selectedUser.rut : ""}
                />

                {errors.rut && errors.rut.type === "required" && (
                  <FormErrorMessage>'Rut' es requerido.</FormErrorMessage>
                )}
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <TextField
                  name="telefono"
                  id="id_telefono"
                  label="Telefono"
                  className={classes.input__rut_telefono}
                  inputRef={register({ required: true })}
                  defaultValue={selectedUser ? selectedUser.telefono : ""}
                />
                {errors.telefono && errors.telefono.type === "required" && (
                  <FormErrorMessage>'Telefono' es requerido.</FormErrorMessage>
                )}
              </Box>
            </Box>
            <Box className={classes.container__inputFile}>
              <input
                name="photoUrl"
                id="id_photoUrl"
                type="file"
                className={classes.input__file}
                ref={file}
                onChange={(e) => {
                  uploadPhoto();
                }}
              />
            </Box>

            <Box className={classes.container__inputFile}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {}} //uploadPhoto()}
                type="submit"
              >
                {selectedUser ? "Modificar Usuario" : "Registrar Usuario"}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default FormConductor;
