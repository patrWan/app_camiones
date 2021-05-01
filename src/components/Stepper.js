import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import "dayjs";
import Grid from "@material-ui/core/Grid";
import DatedayjsUtils from "@date-io/dayjs";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

//import { Select } from "antd";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import  {Select as Select_Ant} from "antd";

import DataTable_select_conductor from "../app/admin/data_tables/DataTable_select_conductor";
import DataTable_select_viajer from "../app/admin/data_tables/DataTable_select_viaje";

import { db, fire } from "../db/firebase";

import * as dayjs from "dayjs";
import { Select} from "@material-ui/core";
import { useSnackbar } from "notistack";

import { Alert } from "antd";

let regiones = require("../app/regiones.json");
var locale_de = require("dayjs/locale/es");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  container: {
    //backgroundColor: "skyblue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  select: {
    //backgroundColor: "blue",
    marginRight: 50,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DatePicker = (props) => {
  const { setDate, selectedItem, setSelectedItem } = props;
  const [selectedDate, setSelectedDate] = React.useState(null);

  const [selectedViaje, setSelectedViaje] = React.useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log(selectedDate);
    setDate(date);

    if (selectedItem) {
      console.log("!! SELECTED ITEM !!");
      selectedItem.fecha = fire.firestore.Timestamp.fromDate(
        new Date(date)
      ).toDate();
      console.log(selectedItem);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DatedayjsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Fecha"
          format="DD/MM/YYYY"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label="Hora"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};
const { Option } = Select_Ant;

const SelectDestino = (props) => {
  const {
    setRegion,
    setComuna,
    //setRegionDestino,
    //setComunaDestino,
    //setDireccion,

    empresa,
    //setEmpresa,
  } = props;

  const [age, setAge] = React.useState("");
  const [nameComuna, setNameComuna] = React.useState("");
  const [comunas, setComunas] = React.useState([]);

  const handleChange = (event) => {
    setAge(event.target.value);
    setComunas(event.target.value.comunas);
    setRegion(event.target.value.region);
  };

  const handleChange2 = (event) => {
    setNameComuna(event.target.value);
    setComuna(event.target.value);
  };

  const handleDireccion = (event) => {
    console.log(event.target.value);
    //setDireccion(event.target.value);
  };

  const classes = useStyles();

  useEffect(() => {
    console.log("Listado de empresas => ", empresa)
  }, []);

  const  onSelect = (val) => {
    console.log(val)

    setRegion(val);
  }

  return (
    <div className={classes.container}>

      <FormControl className={classes.formControl}>
        <Select_Ant
          showSearch
          style={{ width: 200 }}
          placeholder="Seleccione una empresa"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={node => node.parentNode}
          
          onSelect={onSelect}
        >
          {empresa.map((x) => {
            return <Option value={x.id}>{x.empresa}</Option>;
          })}

        </Select_Ant>
      </FormControl>
    </div>
  );
};

const SelectOrigen = (props) => {
  const {
    setRegion,
    setComuna,
    //setRegionDestino,
    //setComunaDestino,
    //setDireccion,

    empresa,
    //setEmpresa,
  } = props;

  const [age, setAge] = React.useState("");
  const [nameComuna, setNameComuna] = React.useState("");
  const [comunas, setComunas] = React.useState([]);

  const handleChange = (event) => {
    setAge(event.target.value);
    setComunas(event.target.value.comunas);
    setRegion(event.target.value.region);
  };

  const handleChange2 = (event) => {
    setNameComuna(event.target.value);
    setComuna(event.target.value);
  };

  const handleDireccion = (event) => {
    console.log(event.target.value);
    //setDireccion(event.target.value);
  };

  const classes = useStyles();

  useEffect(() => {
    console.log("Listado de empresas => ", empresa)
  }, []);

  const  onSelect = (val) => {
    console.log(val)

    setRegion(val);
  }

  return (
    <div className={classes.container}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Región</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          {regiones.map((x) => {
            return (
              <MenuItem value={x} key={x.numero}>
                {x.region}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label1">Comuna</InputLabel>
        <Select
          labelId="demo-simple-select-label1"
          id="demo-simple-select1"
          value={nameComuna}
          onChange={handleChange2}
        >
          {comunas.map((x) => {
            return (
              <MenuItem value={x} key={x.numero}>
                {x}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};


function getSteps() {
  return [
    "Seleccione fecha",
    "Seleccione Conductor",
    "Seleccione Camión",
    "Seleccione Origen",
    "Seleccione Destino",
    "Confirmar Datos",
  ];
}

export default function HorizontalLabelPositionBelowStepper(props) {
  const {
    setDate,
    setTime,
    setSelectedUser,
    setSelectedCamion,
    setRegion,
    setComuna,
    setRegionDestino,
    setComunaDestino,
    setDireccion,
    setConductor,
    setEmpresa,

    date,
    selectedUser,
    selectedCamion,
    region,
    comuna,
    regionDestino,
    //comunaDestino,
    //direccion,
    empresa,

    selectedItem,
    setSelectedItem,
    user__id,

    dataCamionFecha,
    itemToDelete,

    setOpenModalViaje
  } = props;

  const classes = useStyles();
  const { enqueueSnackbar /*closeSnackbar*/ } = useSnackbar();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    //setActiveStep(0);

    /**REGISTRAR VIAJE */

    if (selectedItem) {
      var cityRef = db.collection("usuario").doc(user__id);
      cityRef
        .update({
          viajes: fire.firestore.FieldValue.arrayRemove(selectedItem),
        })
        .then(() => {

          if (selectedUser) {
            var cityRef = db
              .collection("usuario")
              .doc(selectedUser.id); /** cambiar */
          } else {
            var cityRef = db.collection("usuario").doc(user__id);
          }
          
          cityRef.update({
            viajes: fire.firestore.FieldValue.arrayUnion(selectedItem),
          });

          console.log("VIAJE Modificado => ", new__viaje);

          setSelectedUser(null);

          var men = "VIAJE EDITADO EXITOSAMENTE.";
          //setOpenModalCamion(false);
          enqueueSnackbar(men, {
            variant: "warning",
            preventDuplicate: true,
          });
        });

        setOpenModalViaje(false);
    } else {
      console.log("REGISTRAR VIAJE !!");

      var identifier = selectedUser.rut.slice(-4);
      var formatDate = dayjs()
        .locale("es")
        .format("DDMMYYYYhhmmss-" + identifier);

      var new__viaje = {
        id: formatDate,
        fecha: fire.firestore.Timestamp.fromDate(new Date(date)),
        camion:
          selectedCamion.modelo +
          " / " +
          selectedCamion.marca +
          " / " +
          selectedCamion.patente,
        origen: region + ", " + comuna,
        destino: regionDestino,
        id_camion: selectedCamion.id,
      };

      var cityRef = db.collection("usuario").doc(selectedUser.id);

      cityRef
        .update({
          viajes: fire.firestore.FieldValue.arrayUnion(new__viaje),
        })
        .then(() => {
          var camionRef = db.collection("camion").doc(selectedCamion.id);

          camionRef
            .update({
              disponible: false,
            })
            .then(() => {
              console.log("Document successfully updated!");
            })
            .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });
        });

      var fechaDisp = dayjs(date).locale("es").format("DD MMMM YYYY");

      let disp = {
        id: formatDate,
        fecha: fechaDisp,
      };

      var camionRef = db.collection("camion").doc(selectedCamion.id);

      camionRef.update({
        disp: fire.firestore.FieldValue.arrayUnion(disp),
      });

      console.log("VIAJE GENERADO => ", new__viaje);

      /** limpiar campos */
      setSelectedUser(null);

      var men = "Viaje agregado exitosamente.";
      //setOpenModalCamion(false);
      enqueueSnackbar(men, {
        variant: "success",
        preventDuplicate: true,
      });

      setOpenModalViaje(false);
    }
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <DatePicker
            setDate={setDate}
            setTime={setTime}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        );
      case 1:
        return (
          <DataTable_select_conductor
            setSelectedUser={setSelectedUser}
            selectedItem={selectedItem}
            setConductor={setConductor}
          />
        );
      case 2:
        return (
          <DataTable_select_viajer
            setSelectedCamion={setSelectedCamion}
            dataCamionFecha={dataCamionFecha}
            date={date}
            selectedItem={selectedItem}
          />
        );
      case 3:
        return (
          <SelectOrigen
            setRegion={setRegion}
            setComuna={setComuna}
            selectedItem={selectedItem}
            empresa={empresa}
            setEmpresa={setEmpresa}
          />
        );
      case 4:
        return (
          <SelectDestino
            setRegion={setRegionDestino}
            setComuna={setComunaDestino}
            selectedItem={selectedItem}
            setDireccion={setDireccion}
            empresa={empresa}
            setEmpresa={setEmpresa}
          />
        );
      default:
        return "Unknown stepIndex";
    }
  }

  return (
    <div className={classes.root}>
      {selectedItem ? (
        <Alert
          message="Dirigase al paso que desea editar e ingrese los datos nuevos."
          type="info"
        />
      ) : (
        ""
      )}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Asegurese de que todos los datos son correctos antes de completar
              el registro.
            </Typography>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              className={classes.backButton}
            >
              Atras
            </Button>
             {
               /**
                * date,
                  selectedUser,
                  selectedCamion,
                  region,
                  comuna,
                  regionDestino,
                  comunaDestino,
                  direccion,
                  empresa,
                */
             }
             {selectedItem ? 
              <Button variant="contained" color="secondary" onClick={handleReset}>
                Modificar Viaje
              </Button>
             : 

             <Button variant="contained" color="secondary" onClick={handleReset} 
              disabled={ 
                Object.entries(date).length === 0 || 
                selectedUser === null || 
                selectedCamion === null || 
                region === "" || 
                comuna === "" || 
                regionDestino === "" ? true : false }>

              Registrar Viaje
             </Button>

             }


            <Button variant="contained" color="inherit" onClick={() => console.log("==> ", regionDestino)}>
              Comprobar Datos
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Atras
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
