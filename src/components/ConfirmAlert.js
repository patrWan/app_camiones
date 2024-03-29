import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import emailjs from 'emailjs-com';

import { useSnackbar } from "notistack";

import { Alert } from 'antd';

import * as dayjs from "dayjs";
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
    men,
    email_destino,
    closeSlideMenu
  } = props;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  function compare(e){
    console.log(e.target.value)
    if(e.target.value === men){
      setButtonDisabled(false);
    }else{
      setButtonDisabled(true);
    }

  }

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
      <DialogContent style={{display : "flex", flexDirection : "column"}}>
        
        <Alert
          message={<div><strong>{men}</strong> (Esta acción no se puede revertir.)</div>}
          description={<DialogContentText id="alert-dialog-slide-description" color="secondary">{description}</DialogContentText>}
          type="error"
        />
        <div style={{display : "flex", flexDirection : "column", alignItems : "center", marginBottom : 10}}>
          <span style={{fontSize : 16}}>Para confirmar que deseas borrar este dato, escriba lo siguiente: </span>
          <strong style={{marginLeft : 10, fontSize : 16}}>{men}</strong>
        </div>
        
        <input type="text" placeholder="Ingrese el texto..." className="form-control" onChange={e => compare(e)} style={{justifySelf : "center"}}></input>
        
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            setSelectedItem(null);
            setOpenAlert(false);
            closeSlideMenu();
            
          }}
        >
          Cancelar
        </Button>
        <form onSubmit={(e)=>{
          e.preventDefault();
          emailjs.sendForm('service_3t2jqug', 'template_60oxr8w', e.target, 'user_CzJpNEaTEgmDCaNX3wWLO')
          .then((result) => {
            console.log(result.text);
            setSelectedItem(null);
          }, (error) => {
            console.log(error.text);
          })}}>
          <input type="hidden" value={"Viaje Cancelado"}  name="subject" required></input>
          <input type="hidden" value={"Su viaje del día "+ dayjs(selectedItem ? selectedItem.fecha : '').locale("es").format("DD MMMM YYYY HH:mm A")+" ha sido cancelado."} name="fecha"></input>
          <input type="hidden" value={email_destino} name="email" required></input>
          <Button
            type="submit"
            onClick={() => {
              action();
              setOpenAlert(false);
              closeSlideMenu();
              
            }}
            color="secondary"
            variant="contained"
            disabled={buttonDisabled}
          >
            Eliminar
          </Button>
        </form>
      </DialogActions>
    </Dialog>
  );
}
