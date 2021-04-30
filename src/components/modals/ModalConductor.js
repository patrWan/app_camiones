import React from "react";
//import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
//import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
/*
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
*/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  //const classes = useStyles();

  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState('lg');

  const {
    children,
    openModalConductor,
    setOpenModalConductor,
    selectedUser,
    selectedItem,
    //setSelectedUser,
    //title
  } = props;

  return (
    <div>
      <Dialog
        open={openModalConductor}
        TransitionComponent={Transition}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title" className={selectedItem ? "bg-warning" : "bg-primary"}>
          {selectedUser ? "Modificar Cuenta" : "Crear Cuenta"}
        </DialogTitle>

        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalConductor(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
