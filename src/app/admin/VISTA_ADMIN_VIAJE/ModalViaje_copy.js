import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { db } from "../../../db/firebase";
import StepperViaje from "../../../components/Stepper";

// form
import FORM_VIAJES from "./Form_admin_viaje";

import * as dayjs from "dayjs";

var locale_de = require("dayjs/locale/es");

export default function ModalCamionDos(props) {
  const [date, setDate] = useState({});
  const [time, setTime] = useState("");

  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");

  const [regionDestino, setRegionDestino] = useState("");
  const [comunaDestino, setComunaDestino] = useState("");

  const [empresa, setEmpresa] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCamion, setSelectedCamion] = useState(null);

  const {
    //title,
    //description,
    //children,
    openModalViaje,
    setOpenModalViaje,
    selectedItem,
    setSelectedItem,
    user__id,
    conductor,
    setConductor,

    dataCamionFecha,

    itemToDelete,

    direccion,
    setDireccion,
  } = props;

  useEffect(() => {
    let list__empresas = [];
    db.collection("empresa")
      .get()
      .then((querySnapshot) => {
        let e;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          e = {
            id: doc.id,
            empresa: doc.data().empresa,
            region: doc.data().region,
            comuna: doc.data().comuna,
            direccion: doc.data().direccion,
          };

          list__empresas.push(e);
        });
        setEmpresa(list__empresas);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  var formatDate = dayjs(date).locale("es").format("DD MMMM YYYY hh:mm A");

  const ItemContent = () => {
    return <Box style={{ display: "flex", width: "100%" }}></Box>;
  };

  return (
    <div>
      <Dialog
        open={openModalViaje}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"xl"}
        scroll="paper"
      >
        <DialogTitle
          id="form-dialog-title"
          className={selectedItem ? "bg-warning" : "bg-primary"}
        >
          {selectedItem ? (
            <span className="text-dark">Editar Viaje</span>
          ) : (
            <span className="text-white">Agregar Viaje</span>
          )}
        </DialogTitle>
        <DialogContent>
          <ItemContent />
          {/*
          <StepperViaje 
            setDate={setDate} 
            setTime={setTime} 
            setSelectedUser={setSelectedUser} 
            setSelectedCamion={setSelectedCamion}

            setRegion={setRegion}
            setComuna={setComuna}

            setRegionDestino={setRegionDestino}
            setComunaDestino={setComunaDestino}
            setDireccion={setDireccion}
            setConductor={setConductor}

            empresa={empresa}
            setEmpresa={setEmpresa}

            date={date} 
            selectedUser={selectedUser} 
            selectedCamion={selectedCamion}
            region={region}
            comuna={comuna}
            regionDestino={regionDestino}
            comunaDestino={comunaDestino}
            direccion={direccion}
            selectedItem={selectedItem}
            user__id={user__id}
            dataCamionFecha={dataCamionFecha}
            setSelectedItem={setSelectedItem}

            itemToDelete={itemToDelete}

            setOpenModalViaje={setOpenModalViaje}
          />
          */}
          <FORM_VIAJES selectedItem={selectedItem} user__id={user__id} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModalViaje(false);
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
