import React from "react";
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

export default function ConfirmAlert(props) {
  const {
    title,
    description,
    action,

    children,
    openAlert,
    setOpenAlert,
    selectedItem,
    setSelectedItem,
  } = props;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      onClose={() => setSelectedItem(null)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {title}
      </DialogTitle>
      <DialogContent>
        
        <Alert
          message="ID : "
          description={<DialogContentText id="alert-dialog-slide-description" color="secondary">{description}</DialogContentText>}
          type="error"
        />
        
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            setSelectedItem(null);
            setOpenAlert(false);
            
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            action();
            setOpenAlert(false);
            setSelectedItem(null);
          }}
          color="secondary"
          variant="contained"
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
