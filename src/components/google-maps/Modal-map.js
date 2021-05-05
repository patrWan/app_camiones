import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Map from "./Map";

import "./estilos_modal_map.css";

export default function ModalMap(props) {

  const {openModalMap, setOpenModalMap, setEmpresaMarker, empresaMarker } = props;
  
  return (
    <div>
      <Dialog
        open={openModalMap}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth={'xl'}
      >
        <DialogTitle id="form-dialog-title" className="Modal-header">
          <span className="Modal-title">Ubicación</span>
        </DialogTitle>
        <DialogContent className="Map-wrapper">
          <DialogContentText>
            Descripción de las acciones
          </DialogContentText>

          <Map setEmpresaMarker={setEmpresaMarker} empresaMarker={empresaMarker}/>

        </DialogContent>
        <DialogActions className="Modal-actions">
          <Button onClick={() => setOpenModalMap(false)} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}