import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import { useSnackbar } from "notistack";

import { Alert } from 'antd';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const {
    children,
    openAlert,
    setOpenAlert,
    selectedUser,
    setSelectedUser,
    closeSlideMenu,
  } = props;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const delete__user = async (uid) => {
    const url = "https://trudistics-admin-server.vercel.app/api/admin/delete";
    var data = {
      id: uid,
    };
    fetch(url, {
      method: "DELETE", // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        var men = "Usuario " + selectedUser.email + "ha sido eliminado.";
        enqueueSnackbar(men, {
          variant: "error",
        });
      });
  };

  function compare(e){
    console.log(e.target.value)
    if(e.target.value === selectedUser.email){
      setButtonDisabled(false);
    }else{
      setButtonDisabled(true);
    }

  }

  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      onClose={() => setSelectedUser(null)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {"¿Quieres borrar esta cuenta?"}
      </DialogTitle>
      <DialogContent>
        <Alert
          message="Esta acción no se puede revertir"
          description={<DialogContentText id="alert-dialog-slide-description" color="secondary">Cuenta de usuario:{selectedUser ? " "+selectedUser.email : " No hay un usuario seleccionado"}</DialogContentText>}
          type="error"
        />
        <DialogContentText>
        <span>Para confirmar que deseas borrar esta colección, escribe su Correo</span>
        <input type="text" placeholder="Ingrese correo" onChange={e => compare(e)}></input>
        </DialogContentText>
        
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            setOpenAlert(false);
            setSelectedUser(null);
            closeSlideMenu();
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            if (selectedUser) {
              delete__user(selectedUser.id);
            }

            setOpenAlert(false);
            setSelectedUser(null);
            closeSlideMenu();
          }}
          color="secondary"
          variant="contained"
          disabled={buttonDisabled}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
