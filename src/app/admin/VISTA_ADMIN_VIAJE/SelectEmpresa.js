import React, { useEffect, useState } from "react";

import { db } from "../../../db/firebase";

import "antd/dist/antd.css";
import { Select } from "antd";

const { Option } = Select;

function onSelect(val) {
  console.log("select:", val);
}

function SelectEmpresa(props) {
  const {selectedItem, destino, setDestino} = props;

  const [empresa, setEmpresa] = useState([]);

  function onSelect(val) {
    console.log("select:", val);
    setDestino(val);
  }

  useEffect(async () => {
    console.log("RENDER SELECT EMPRESA");
    const camionRef = db.collection('empresa');
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    const empresas = [];
    snapshot.forEach(doc => {
        var e = {
            id : doc.id,
            empresa : doc.data().empresa,
            region : doc.data().region,
            comuna : doc.data().comuna,
            direccion : doc.data().direccion,
          }
          empresas.push(e);
    });
    setEmpresa(empresas);

    if(selectedItem){
      setDestino(selectedItem.destino);
    }
  }, []);

  return (
      <Select
        className="Input-select"
        showSearch
        placeholder="Seleccione empresa"
        optionFilterProp="children"
        onSelect={onSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={node => node.parentNode}
        value={destino ? destino : null}
      >
        {empresa.map((x) => {
          return <Option value={x.id} key={x.id}>{x.empresa}</Option>;
        })}
      </Select>
  );
}

export default SelectEmpresa;