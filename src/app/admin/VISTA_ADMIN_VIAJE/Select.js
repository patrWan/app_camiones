import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";

import {db} from "../../../db/firebase";

const { Option } = Select;



function SelectUsuario(props) {
  const {conductor, setConductor, user__id, selectedItem, setEmailName, setEmailCorreo} = props;
  const [usuario, setUsuario] = useState([]);

  function onSelect(val, child) {
    console.log("select:", child.email);
    setConductor(val);
    setEmailName(child.children);
    setEmailCorreo(child.email);
  }

  useEffect(async () => {
    console.log("RENDER SELECT USUARIO");
    let lista =[];
    /*
    const url = "http://localhost:4000/api/admin/";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setUsuario(data);
    */
    await db.collection("usuario")
      .where("email", "!=", "administrador@trudistic.cl")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(x => {
          lista.push(x.data());
        })
        const filteredEvents = lista.filter(({ disabled }) => disabled !== "true");
        
        setUsuario(filteredEvents);

      });

  }, []);

  return (
      <Select
        className="Input-select"
        showSearch
        placeholder="Seleccione usuario"
        optionFilterProp="children"
        onSelect={onSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={node => node.parentNode}
        value={conductor ? conductor : null}
      >
        {usuario.map((x) => {
          return <Option value={x.id} key={x.email} email={x.email}>{x.nombres}</Option>;
        })}
      </Select>
  );
}

export default SelectUsuario;
