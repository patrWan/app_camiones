import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Map from "./MapOnlyView";

import "./estilos_modal_map.css";

export default function ModalMap_onlyView(props) {

  const {empresa_cor, openModalMap, setOpenModalMap} = props;
  
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

          <Map empresaMarker={empresa_cor}/>

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