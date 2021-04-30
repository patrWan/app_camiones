import React , {useEffect, useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FlashMessage(props) {
  const [open, setOpen] = useState(false);

  const [menCode, setMenCode] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const [severity, setSeverity] = useState('');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  var state = props.child.location.state;

  useEffect(() => {
    console.log("Flash Message montado !!");
    
    if(state){
      if(state.code !== menCode){
          console.log(state.code);
        switch(state.code){
            case '100':
                setMensaje("")
                setMensaje("Error "+state.code+": Acceso no autorizado.")
                setSeverity("error")
                break;
            default:
                setMensaje("Error 1000: Error desconocido. ->"+state.code)
                break;
        }
        setMenCode(state.code);
        console.log("codigo seteado paso 1 !! -> CODE = "+menCode);
        handleClick()
      }
      
      /** borra el historial, del codigo */
      window.history.replaceState({}, document.title);
      
    }

    if (props.codeError) {
      switch(props.codeError){
        case "auth/invalid-email":
          setMensaje("Formato de correo invalido.")
          break;
        case "auth/user-not-found":
          setMensaje("No hay ningún registro de usuario correspondiente a este correo.")
          break;
        case "auth/wrong-password":
          setMensaje("La contraseña no es válida.")
          break;
        case "auth/too-many-requests":
          setMensaje(" El acceso a esta cuenta se ha desactivado temporalmente debido a los numerosos intentos fallidos de inicio de sesión. Contacte con administrador")
          break;
        default:
          setMensaje("Error desconocido.")
          break;
      }
      setSeverity("warning")
      handleClick()
    }
  },[props.codeError])

  return (

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top',
      horizontal: 'center',}}
      >
        <Alert onClose={handleClose} severity={severity}>
          {mensaje}
        </Alert>
      </Snackbar>
  );
}