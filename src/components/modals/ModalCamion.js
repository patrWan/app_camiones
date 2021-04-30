import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ModalCamionDos(props) {

  const { title, description, children, openModalCamion, setOpenModalCamion,setSelectedItem, selectedItem } = props;
  
  return (
    <div>
      <Dialog
        open={openModalCamion}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"className={selectedItem ? "bg-warning" : "bg-primary"}>
        {selectedItem ? <span className="text-dark">Editar Camión</span> : <span className="text-white">Agregar Camión</span>}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {description}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpenModalCamion(false); setSelectedItem(null) }} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}