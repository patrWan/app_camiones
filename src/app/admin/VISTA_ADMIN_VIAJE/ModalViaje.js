import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {db} from "../../../db/firebase"
import StepperViaje from "../../../components/Stepper";

import * as dayjs from "dayjs";
import { Box, TextField } from "@material-ui/core";
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

  useEffect(()=> {
    let list__empresas = [];
    db.collection("empresa")
      .get()
      .then((querySnapshot) => {
        let e;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          e = {
            id : doc.id,
            empresa : doc.data().empresa,
            region : doc.data().region,
            comuna : doc.data().comuna,
            direccion : doc.data().direccion,
          }

          list__empresas.push(e);
         
        });
        setEmpresa(list__empresas)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },[]);
  
  var formatDate = dayjs(date).locale("es").format("DD MMMM YYYY hh:mm A");

  const ItemContent = () => {
    return (
      <Box style={{display : 'flex', width : '100%'}}>
        
          {selectedItem ? 
            
            <Box style={{display: 'flex', width : '100%', flexDirection : 'column',}}>
              <DialogContentText style={{fontSize : 14}}>
                  
                  <br/>
                  <TextField id="filled-basic" label="FECHA" variant="filled" value={dayjs(selectedItem.fecha).locale("es").format("DD MMMM YYYY hh:mm A")} contentEditable={false} disabled style={{marginRight : 10, width : "15%"}}/>
                  
                  
                  <TextField id="filled-basic" label="CONDUCTOR" variant="filled" value={conductor} contentEditable={false} disabled style={{marginRight : 10, width : "10%"}}/>
                  
                  <TextField id="filled-basic" label="CAMIÓN" variant="filled" value={selectedItem.camion} contentEditable={false} disabled style={{marginRight : 10, width : "15%"}}/>
                  
                  
                  <TextField id="filled-basic" label="ORIGEN" variant="filled" value={selectedItem.origen} contentEditable={false} disabled style={{marginRight : 10, width : "15%"}}/>
                    
                  
                  <TextField id="filled-basic" label="DESTINO" variant="filled" value={direccion} contentEditable={false} disabled style={{ width : "40%"}}/>
                  
              </DialogContentText>
          </Box>
          :""
          }
          {!selectedItem ? 
            <Box style={{display: 'flex', width : '50%'}}>
            <DialogContentText style={{fontSize : 14}}>
              <Box style={{display: 'flex', flexDirection: 'column'}}>
                  
                  <span>Fecha:</span>
                  <span>Conductor:</span>
                  <span>Camión:</span>
                  <span>Origen:</span>
                  <span>Destino:</span>
              </Box>
            </DialogContentText>
              <DialogContentText style={{fontSize : 14,  fontWeight : "bold"}}>
                  {formatDate}
                  <br/>
                  {selectedUser ? selectedUser.nombres : "No se ha seleccionado conductor."}
                  <br/>
                  {selectedCamion ? selectedCamion.marca +", "+selectedCamion.modelo : "No se ha seleccionado conductor."}
                  <br/>
                    {region ? region +", ": "No ha seleccionado region. "} {comuna ? comuna +", ": ", No ha seleccionado comuna."}
                  <br/>
                  {regionDestino ? regionDestino +", ": "No ha seleccionado region. "} {comunaDestino ? comunaDestino +", ": ", No ha seleccionado comuna."}
              </DialogContentText>
          </Box>
          : ""}
          
          
          
      </Box>
    )
  }
              
  return (
    <div>
      <Dialog open={openModalViaje} aria-labelledby="form-dialog-title" fullWidth={true}
        maxWidth={"xl"}>
        <DialogTitle id="form-dialog-title" className={selectedItem ? "bg-warning" : "bg-primary"}>
          {selectedItem ? <span className="text-dark">Editar Viaje</span> : <span className="text-white">Agregar Viaje</span>}
        </DialogTitle>
        <DialogContent>
          <ItemContent/>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setOpenModalViaje(false); setSelectedItem(null)}} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
