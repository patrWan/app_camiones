import React, { /*useEffect,*/ useState } from "react";

import { auth } from "../db/firebase";

import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import { Button } from "antd";
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  TextField /**Button*/,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import FlashMessage from "../components/FlashMessage";

import LockRoundedIcon from "@material-ui/icons/LockRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";

//import {useParams,useHistory} from "react-router-dom";

/** !! AUTH */
import {
  //registrar__usuario,
  iniciar__sesion,
  cerrar__sesion,
} from "../db/auth.js";

import {db} from "../db/firebase";

import { useHistory } from "react-router-dom";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#fafafa",
    fontFamily: "Montserrat, sans-serif",
  },

  container: {
    display: "flex",
    height: "100%",
    width: "100%",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  cnt__login: {
    //backgroundColor: "skyblue",

    height: "50%",
    width: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  cnt__logo: {
    //backgroundColor : "green",
    height: "100%",
    width: 485,
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  logo: {
    height: "100%",
    width: "100%",
  },

  cnt_form: {
    backgroundColor: "#ffffff",
    height: "80%",

    border: "1px #dbdbdb solid",
    borderRadius: 5,

    width: 500,
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    //backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },

  title: {
    fontSize: 32,
    marginBottom: 30,
    fontFamily: "Dela Gothic One, cursive",
    [theme.breakpoints.down("sm")]: {
      //width: "100%",
    },
  },

  error: {
    fontSize: 14,
    marginbottom: 5,
    color: "red",
  },

  form__text: {
    width: "100%",
    paddingBottom: 15,
  },

  form__button: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const Index = (props) => {
  const classes = useStyles();
  const [email_recover, setEmailRecover] = useState('');
  const [email_not_exist, setEmailNotExist] = useState(true);
  const [email_exist, setEmailExist] = useState(false);

  const [codeError, setCodeError] = useState("");

  let history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [values, setValues] = useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  async function recover_password(){
    let exist = false;
    console.log("Recover password para => ", email_recover);
    await db.collection("usuario").where("email", "==", email_recover)
    .get()
    .then((querySnapshot) => {
      
        querySnapshot.forEach((doc) => exist = true);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    if(exist === false){
      setEmailNotExist(false);
    }else{
      setEmailNotExist(true);
      setEmailExist(true);
    }
    
  }

  function handleInputEmail(e){
    setEmailRecover(e.target.value);
  }

  const onSubmit = (data) => {
    console.log("onSubmit");
    console.log(data.txtCorreo);
    console.log(data.txtPassword);
    iniciar__sesion(data.txtCorreo, data.txtPassword)
      .then((cred) => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("user");
        // Signed in
        auth.currentUser
          .getIdTokenResult()
          .then((idTokenResult) => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
              // Show admin UI.
              console.log("SOY ADMIN");
              localStorage.setItem("user", cred.user.uid);
              localStorage.setItem("isAdmin", true);
              localStorage.setItem("password", data.txtPassword);
              history.push("/admin/home");
            } else {
              // Show regular user UI.
              console.log("NO SOY ADMIN", cred);
              localStorage.setItem("user", cred.user.uid);
              localStorage.setItem("isAdmin", false);
              localStorage.setItem("password", data.txtPassword);
              history.push("/conductor/viajes");
            }
          })
          .catch((error) => {
            console.log(error);
          });
        console.log("!! Inicio de sesión exitoso -> " + cred.user.email);
      })
      .catch((error) => {
        setCodeError(error.code);

        console.log("!! error code -> " + error.code);
        console.log("!! error code -> " + error.message);
      });

    /*
      auth.signin(data.txtCorreo, data.txtPassword).then().catch((error) => {
        setCodeError(error.code);
      });
      */
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Box className={classes.cnt__login}>
          <Box className={classes.cnt__logo}>
            <img src="/logo_login_2.png" className={classes.logo} />
          </Box>
          <div className={classes.cnt_form}>
            <span className={classes.title}>TRUDISTICS</span>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className={classes.form}
            >
              <div className={classes.form__text}>
                <Input
                  name="txtCorreo"
                  label="Correo"
                  inputRef={register({ required: true })}
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailRoundedIcon />
                    </InputAdornment>
                  }
                  fullWidth
                />
                {errors.txtCorreo && (
                  <span className={classes.error}>Correo requerido</span>
                )}
              </div>

              <div className={classes.form__text}>
                <Input
                  type="password"
                  name="txtPassword"
                  label="Contraseña"
                  fullWidth
                  inputRef={register({ required: true })}
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <LockRoundedIcon />
                    </InputAdornment>
                  }
                />
                {errors.txtPassword && (
                  <span className={classes.error}>Contraseña requerida</span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 15,
                }}
              >
                <button
                  type="primary"
                  htmlType="submit"
                  className="btn btn-primary"
                >
                  Iniciar Sesión
                </button>
                <button
                  className="btn btn-warning"
                  type="button"
                  style={{ marginTop: 10 }}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Recuperar Contraseña
                </button>
              </div>
            </form>
          </div>
        </Box>
        <div>© 2021 - Trudistics</div>
      </div>

      <FlashMessage child={props} codeError={codeError} />
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Recuperación de contraseña
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div style={{display : "flex", flexDirection : "column"}}>
                <input type="email" placeholder="Ingrese email..." onChange={e => handleInputEmail(e)}></input>
                {email_not_exist ? null : <strong className="text-danger" style={{marginLeft : 5}}>Email no se encuentra en nuestros registros.</strong>}
                {email_exist ? <strong className="text-success" style={{marginLeft : 5}}>Su contraseña ha sido enviada a su correo.</strong> : null}
              </div>
              
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="button" class="btn btn-primary" onClick={() => recover_password()}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
