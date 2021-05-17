import React, { useRef, useState } from "react";
import {
  TextField,
  Box,
  Button,
  Avatar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { storage } from "../../db/firebase";

import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import FormErrorMessage from "../FormErrorMessage";

import emailjs from "emailjs-com";

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

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  estado_input: {
    height: 30,
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 10,
    },
  },
}));

const FormConductor = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar /*closeSnackbar*/ } = useSnackbar();

  const { selectedUser, setOpenModalConductor, closeSlideMenu } = props;

  const [loading, setLoading] = useState(false);

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

    if (file_img) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      await reader.readAsDataURL(file_img);
    }
  };

  const edit__user = async (edit_user) => {
    console.log("!!! API -> EDITARUSUARIO !!!");
    const url = "https://trudistics-admin-server.vercel.app/api/admin/edit/";

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
        closeSlideMenu();
        setOpenModalConductor(false);
        console.log("Success:", response);
        var men = "Usuario editado exitosamente.";
        enqueueSnackbar(men, {
          variant: "info",
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      });
  };

  const register__user = async (new_user) => {
    console.log("!!! API -> REGISTRAR USUARIO !!!");
    const url = "https://trudistics-admin-server.vercel.app/api/admin/";

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
          autoHideDuration: 1500,
        });
      })
      .then((response) => {
        /** !!!!! ESTA SEGURO DE CREAR EL SIGUIENTE USUARIO? -> DTOS DEL USUARIO */
        closeSlideMenu();
        setOpenModalConductor(false);
        console.log("res => ", response);
        var men = "Usuario " + response.email + " creado exitosamente.";
        var variant = "";
        if (response.code) {
          switch (response.code) {
            case "auth/email-already-exists":
              men = "Correo ya se encuentra registrado";
              variant = "warning";
              break;
            default:
              break;
          }
          enqueueSnackbar(men, {
            variant: variant,
            preventDuplicate: true,
            autoHideDuration: 2000,
          });
        } else {
          var men = "Usuario " + response.email + " creado exitosamente.";
          enqueueSnackbar(men, {
            variant: "success",
            autoHideDuration: 2000,
          });
        }
      });
  };

  const [random_pass, setRandomPass] = useState("");
  const onSubmit = (data, e) => {
    setLoading(true);
    if (selectedUser) {
      console.log("!!! MODIFICAR USUARIO !!! ", data);

      var metadata = {
        contentType: "image/jpeg",
      };
      var storageRef = storage.ref();
      var pathName = "avatars/" + data.email + ".profilePhoto";
      var avatarRef = storageRef.child(pathName);

      avatarRef.put(file.current.files[0], metadata).then(function (snapshot) {
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
            estado: data.estado,
            //domicilio : data.domicilio
          };

          edit__user(new_user);
        });
        console.log("Uploaded a blob or file!");
      });
      //setLoading(false);
    } else {
      console.log("!!! REGISTRAR USUARIO NUEVO !!! ", data);

      let email_split = data.email.split("@");
      console.log(email_split[0]);
      let random_pass = email_split[0] + data.rut.slice(-5);
      console.log("password ====> ", random_pass);
      setRandomPass(random_pass);

      var new_user = {
        email: data.email,
        nombres: data.nombres,
        apellidos: data.apellidos,
        rut: data.rut,
        telefono: data.telefono,
        photoUrl: "https://firebasestorage.googleapis.com/v0/b/trudistics.appspot.com/o/avatars%2Fdefault_avatar.png?alt=media&token=9d64a85a-06ae-4fdc-b14b-a873665a9de5",
        password: random_pass,
        estado: data.estado,
        //domicilio : data.domicilio
      };

      //console.log(new_user);

      register__user(new_user);
      
          emailjs.sendForm("service_3t2jqug","template_cdbcycc",e.target,"user_CzJpNEaTEgmDCaNX3wWLO")
            .then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
            
    }
  };

  return (
    <div className={classes.root}>
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box className={classes.container_wrap}>
          <Box>
            <Box className={classes.container__avatar}>
              {selectedUser ? (
                <Box className={classes.avatar}>
                  <Avatar
                    alt="user_avatar"
                    src={
                      photoUrl
                        ? photoUrl
                        : selectedUser
                        ? selectedUser.photoURL
                        : ""
                    }
                    variant="square"
                    className={classes.avatar}
                  />
                </Box>
              ) : null}
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
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
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
              {selectedUser ? (
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
              ) : null}

              <select
                name="estado"
                ref={register({ required: true })}
                defaultValue={selectedUser ? selectedUser.estado : null}
                className={classes.estado_input}
              >
                <option value="false">Activo</option>
                <option value="true">Inactivo</option>
              </select>
            </Box>

            <Box className={classes.container__inputFile}>
              <input type="hidden" value={random_pass} name="password"></input>
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
