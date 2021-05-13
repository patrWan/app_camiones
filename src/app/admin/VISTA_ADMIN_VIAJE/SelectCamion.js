import React, { useEffect, useState } from "react";

import { db } from "../../../db/firebase";

import "antd/dist/antd.css";
import { Select } from "antd";

const { Option } = Select;



function SelectCamion(props) {
  const {selectedItem, camionId, setCamionId} = props;
  const [camion, setCamion] = useState([]);

  function onSelect(val) {
    console.log("select:", val);
    setCamionId(val);
  }

  useEffect(async () => {
    console.log("RENDER SELECT CAMION");
    const camionRef = db.collection('camion');
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    const camiones = [];
    snapshot.forEach(doc => {
        var c = {
          id : doc.id,
          modelo : doc.data().modelo,
          marca : doc.data().marca,
          patente : doc.data().patente,
          disponible : doc.data().disponible ? "Disponible" : "En uso",
          estado : doc.data().estado
        }
        camiones.push(c);
    });
    setCamion(camiones);
    if(selectedItem){
      setCamionId(selectedItem.id_camion);
    }
    
  }, []);

  return (
      <Select
        className="Input-select"
        showSearch
        placeholder="Seleccione camion"
        optionFilterProp="children"
        onSelect={onSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={node => node.parentNode}
        value={camionId ? camionId : null}
      >
        {camion.map((x) => {
          return <Option value={x.id} key={x.id} hidden={x.estado === "true" ?true:false}>{x.patente}</Option>;
        })}
      </Select>
  );
}

export default SelectCamion;