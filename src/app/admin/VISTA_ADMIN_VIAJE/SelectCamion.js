import React, { useEffect, useState } from "react";

import { db } from "../../../db/firebase";

import "antd/dist/antd.css";
import { Select } from "antd";

const { Option } = Select;

function onSelect(val) {
  console.log("select:", val);
}

function SelectCamion(props) {
  const [camion, setCamion] = useState([]);

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
        }
        camiones.push(c);
    });
    setCamion(camiones);
  }, []);

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Seleccione camion"
        optionFilterProp="children"
        onSelect={onSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={node => node.parentNode}
      >
        {camion.map((x) => {
          return <Option value={x.id} key={x.id}>{x.patente}</Option>;
        })}
      </Select>
    </div>
  );
}

export default SelectCamion;