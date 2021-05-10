import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ModalCamionDos(props) {
  const {
    title,
    description,
    children,
    openModalEmpresa,
    setOpenModalEmpresa,
    selectedItem,
    setSelectedItem,
  } = props;

  return (
    <div>
      <Dialog
        open={openModalEmpresa}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogTitle
          id="form-dialog-title"
          className={selectedItem ? "bg-warning" : "bg-primary"}
        >
          {selectedItem ? (
            <span className="text-dark">Editar Empresa</span>
          ) : (
            <span className="text-white">Agregar Empresa</span>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModalEmpresa(false);

              setTimeout(() => {
                setSelectedItem(null);
              }, 500);
            }}
            color="secondary"
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
