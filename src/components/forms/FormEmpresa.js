import React, {  useEffect, useState } from "react";
import { TextField} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { db } from "../../db/firebase";

import ModalMap from "../google-maps/Modal-map";

import { Select } from "antd";
const { Option } = Select;

let regiones = require("../../app/regiones.json");

const useStyles = makeStyles((theme) => ({
  root: {
    //backgroundColor: "#c7bfa4",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width : "100%",
  },

  inputs: {
    marginBottom: 15,
  },
}));

const FormEmpresa = (props) => {
  const { selectedItem, setSelectedItem, setOpenModalEmpresa } = props;

  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar /*closeSnackbar*/ } = useSnackbar();

  const [ comunas , setComunas ] = useState(["Comunas..."]);

  const [nombreRegion, setNombreRegion] = useState('');
  const [nombreComuna, setNombreComuna] = useState('');
  
  const [openModalMap, setOpenModalMap] = useState(false);

  const [empresaMarker, setEmpresaMarker] = useState(null);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');

  const [direccion, setDireccion] = useState('');

  const classes = useStyles();

  const register__empresa = async (new_empresa) => {
    console.log(empresaMarker);
    const res = await db.collection("empresa").add({
      direccion: new_empresa.direccion,
      empresa: new_empresa.empresa,
      telefono : new_empresa.telefono,
      latitud : empresaMarker ? empresaMarker.lat : "",
      longitud : empresaMarker ? empresaMarker.lng : "",
    });

    console.log("Added document with ID: ", res.id);
  };

  const edit__empresa = async (data) => {
    const camionRef = db.collection("empresa").doc(selectedItem.id);

    // Set the 'capital' field of the city
    const res = await camionRef.update({
      direccion: data.direccion,
      empresa: data.empresa,
      telefono : data.telefono,
      latitud : empresaMarker ? empresaMarker.lat : selectedItem.latitud,
      longitud : empresaMarker ? empresaMarker.lng : selectedItem.longitud,
    });
  };

  function onChange(value) {
    regiones.map(x => {
        if(x.numero === value){
            console.log("region => "+x.region)
            setNombreRegion(x.region);
            setComunas(x.comunas);
        }
    })
    //setComunas(key.key);
  }

  function onChangeComuna(value) {
    console.log(`comuna  ${value}`);
    setNombreComuna(value);
  }

  const onSubmit = (data) => {
    console.log(empresaMarker);
    
    if (selectedItem) {
      var men = "Empresa ID: " + selectedItem.id + " editado exitosamente.";
      edit__empresa(data);
      setOpenModalEmpresa(false);
      setSelectedItem(null);

      enqueueSnackbar(men, {
        variant: "info",
        preventDuplicate: true,
      });
    } else {
      register__empresa(data);
      var men = "Empresa NOMBRE: " + data.empresa + " creado exitosamente.";
      setOpenModalEmpresa(false);
      enqueueSnackbar(men, {
        variant: "success",
        preventDuplicate: true,
      });
    }
    
  };

  const handleMap = () => {
    setOpenModalMap(true);
  }

  useEffect(async () => {

    if(selectedItem){
      await setDireccion(selectedItem.direccion);
      setSelectedRegion(selectedItem.region);
      setSelectedComuna(selectedItem.comuna);

      regiones.forEach(x => {
        if(selectedRegion === x.region){
            setComunas(x.comunas);
        }
    });
    }
  }, []);

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
        <button type="button" onClick={handleMap}>Mapa</button>
        <TextField
          id="direccion"
          name="direccion"
          label="Dirección"
          inputRef={register({ required: true })}
          className={classes.inputs}
          value={direccion}
          disabled
          onClick = {handleMap }
          fullWidth
        />
        <TextField
          id="empresa"
          name="empresa"
          label="Empresa"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.empresa : ""}
          fullWidth
        />
        <TextField
          id="telefono"
          name="telefono"
          label="Telefono"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.telefono : ""}
          fullWidth
        />
        <button type="submit" className={selectedItem ? "btn btn-outline-warning" : "btn btn-outline-primary"}>
          <span>{selectedItem ? "Editar Empresa" : "Registrar Empresa"}</span>
        </button>
      </form>
      <ModalMap openModalMap={openModalMap} setOpenModalMap={setOpenModalMap} setEmpresaMarker={setEmpresaMarker} empresaMarker={empresaMarker} setDireccion={setDireccion}/>
    </div>
  );
};

export default FormEmpresa;
