import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Select } from "antd";

const { Option } = Select;

function onSelect(val) {
  console.log("select:", val);
}

function SelectUsuario(props) {
  const [usuario, setUsuario] = useState([]);

  useEffect(async () => {
    console.log("RENDER SELECT USUARIO");
    const url = "http://localhost:4000/api/admin/";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    setUsuario(data);
  }, []);

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Seleccione usuario"
        optionFilterProp="children"
        onSelect={onSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        getPopupContainer={node => node.parentNode}
      >
        {usuario.map((x) => {
          return <Option value={x.id} key={x.id}>{x.nombres}</Option>;
        })}
      </Select>
    </div>
  );
}

export default SelectUsuario;
