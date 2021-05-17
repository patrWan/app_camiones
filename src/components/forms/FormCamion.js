import React from "react";
import { TextField, Box, Button, Avatar } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { db } from "../../db/firebase";
const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundColor: "#c7bfa4",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  inputs: {
    marginBottom: 15,
  },

  input_estado : {
    fontSize : 16,
    width : "100%",
    height : 30,
    marginBottom: 15,
  },
}));

const FormConductor = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar /*closeSnackbar*/ } = useSnackbar();

  const { selectedItem, setSelectedItem, setOpenModalCamion, closeSlideMenu } = props;

  const classes = useStyles();

  const register__camion = async (new_camion) => {
    const res = await db.collection("camion").add({
      modelo: new_camion.modelo,
      marca: new_camion.marca,
      patente: new_camion.patente,
      estado : new_camion.estado,
    });

    console.log("Added document with ID: ", res.id);
    closeSlideMenu();
  };

  const edit__camion = async (data) => {
    const camionRef = db.collection("camion").doc(selectedItem.id);

    // Set the 'capital' field of the city
    const res = await camionRef.update({
      modelo: data.modelo,
      marca: data.marca,
      patente: data.patente,
      estado : data.estado,
    });

    closeSlideMenu();
  };

  const onSubmit = (data) => {
    console.log(data);
    if (selectedItem) {
      var men = "Camion PATENTE: " + selectedItem.patente + " editado exitosamente.";
      edit__camion(data);
      setOpenModalCamion(false);
      setSelectedItem(null);

      enqueueSnackbar(men, {
        variant: "info",
        preventDuplicate: true,
        autoHideDuration: 2000,
      });
    } else {
      register__camion(data);
      var men = "Camion PATENTE: " + data.patente + " creado exitosamente.";
      setOpenModalCamion(false);
      enqueueSnackbar(men, {
        variant: "success",
        preventDuplicate: true,
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
        <TextField
          id="standard-basic"
          name="modelo"
          label="Modelo"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.modelo : ""}
        />
        <TextField
          id="standard-basic"
          name="marca"
          label="Marca"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.marca : ""}
        />
        <TextField
          id="standard-basic"
          name="patente"
          label="Patente"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.patente : ""}
        />
        <select
          name="estado"
          ref={register({ required: true })}
          defaultValue={selectedItem ? selectedItem.estado : null}
          className={classes.input_estado}

        >
          <option value="false" className={classes.option_text}>Activo</option>
          <option value="true" className={classes.option_text}>Inactivo</option>
        </select>
        <button type="submit" className={selectedItem ? "btn btn-outline-warning" : "btn btn-outline-primary"}>
          {selectedItem ? "Editar Camión" : "Registrar Camión"}
        </button>
      </form>
    </div>
  );
};

export default FormConductor;
