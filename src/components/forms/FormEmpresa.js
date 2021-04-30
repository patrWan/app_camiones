import React, {  useState } from "react";
import { TextField} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { db } from "../../db/firebase";

import { Select } from "antd";
const { Option } = Select;

let regiones = require("../../app/regiones.json");

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
}));

const FormEmpresa = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar /*closeSnackbar*/ } = useSnackbar();

  const [ comunas , setComunas ] = useState(["Comunas..."]);

  const [nombreRegion, setNombreRegion] = useState('');
  const [nombreComuna, setNombreComuna] = useState('');
  const { selectedItem, setSelectedItem, setOpenModalEmpresa } = props;

  const classes = useStyles();

  const register__empresa = async (new_empresa) => {
    const res = await db.collection("empresa").add({
      region: nombreRegion,
      comuna: nombreComuna,
      direccion: new_empresa.direccion,
      empresa: new_empresa.empresa,
    });

    console.log("Added document with ID: ", res.id);
  };

  const edit__empresa = async (data) => {
    const camionRef = db.collection("empresa").doc(selectedItem.id);

    // Set the 'capital' field of the city
    const res = await camionRef.update({
      region: data.region,
      comuna: data.comuna,
      direccion: data.direccion,
      empresa: data.empresa,
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
    console.log(data);
    
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

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
        <Select
            className={classes.inputs}
          showSearch
          style={{ width: 200 }}
          placeholder="Seleccione Región"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={node => node.parentNode}
        >
            {regiones.map(x => {
                return <Option  value={x.numero} key={x.region}>{x.region}</Option>
            })}
        </Select>

        <Select
            className={classes.inputs}
          showSearch
          style={{ width: 200 }}
          placeholder="Seleccione Comuna"
          optionFilterProp="children"
          onChange={onChangeComuna}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={node => node.parentNode}
        >
            {comunas.map(x => {
                return <Option value={x} key={x}>{x}</Option>
            })}
        </Select>
        
        <TextField
          id="standard-basic"
          name="direccion"
          label="Direccion"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.direccion : ""}
        />
        <TextField
          id="standard-basic"
          name="empresa"
          label="Empresa"
          inputRef={register({ required: true })}
          className={classes.inputs}
          defaultValue={selectedItem ? selectedItem.empresa : ""}
        />
        <button type="submit" className={selectedItem ? "btn btn-outline-warning" : "btn btn-outline-primary"}>
          <span>{selectedItem ? "Editar Empresa" : "Registrar Empresa"}</span>
        </button>
      </form>
    </div>
  );
};

export default FormEmpresa;
