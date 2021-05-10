import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";

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
    const url = "http://localhost:4000/api/admin/";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setUsuario(data);

    if(selectedItem){
      setConductor(user__id);
    }
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
          return <Option value={x.id} key={x.id} email={x.email}>{x.nombres}</Option>;
        })}
      </Select>
  );
}

export default SelectUsuario;
