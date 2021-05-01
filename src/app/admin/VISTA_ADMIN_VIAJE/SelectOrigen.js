import React, { useEffect, useState } from "react";

//import { db } from "../../../db/firebase";
import "antd/dist/antd.css";
import { Select } from "antd";
import "./estilos_form_admin_viaje.css"
let regiones_data = require("../../regiones.json");

const { Option } = Select;

function SelectOrigen(props) {
  const {selectedItem, setOrigen} = props;

  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const [disabled, setDisable] = useState(true);

  function onSelect(val) {
    console.log("select:", val);
    setSelectedRegion(val);
    setIsSelected(true);
  }

  function onSelectComuna(val) {
    console.log("select:", val);
    setSelectedComuna(val);

    let origen = selectedRegion +", "+val;

    console.log("origen=> ", origen);
    setOrigen(origen);
  }

  function submit (){
    console.log("region => ", selectedRegion);
    console.log("comuna => ", selectedComuna);
  }

  useEffect(() => {
    if(selectedRegion !== ''){
      setComunas(comunas => comunas = []);
        regiones.forEach(x => {
            if(selectedRegion === x.region){
                setSelectedComuna(x.comunas[0]);
                setComunas(x.comunas);
                setDisable(false);
            }
        });
        setIsSelected(false);
    }
    
  }, [isSelected]);

  useEffect(async () => {
    await setRegiones(regiones_data);

    if(selectedItem){
      let split = selectedItem.origen.split(',');

      console.log(split[0] + " " + split[1]);

      setSelectedRegion(split[0]);
      setSelectedComuna(split[1]);

      let origen = split[0]+","+split[1];

      setOrigen(origen);

      regiones.forEach(x => {
        if(selectedRegion === x.region){
            setComunas(x.comunas);
            setDisable(false);
        }
    });
      setDisable(false);
    }
  }, []);

  return (
    <div className="Form-input-select-2">
      
      <div style={{display : "flex",flexDirection : "column", width : "100%"}}>
        <span className="Label">Región Origen</span>
        <Select
          className="Input-select-2"
          showSearch
          placeholder="Seleccione región"
          optionFilterProp="children"
          onSelect={onSelect}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={node => node.parentNode}
          value={selectedRegion ? selectedRegion : null}
        >
          {regiones.map((x) => {
            return <Option value={x.region} key={x.region}>{x.region}</Option>;
          })}
        </Select>
      </div>
      
      <div style={{display : "flex",flexDirection : "column", width : "100%"}}>
        <span className="Label">Comuna Origen</span>
        <Select

          className="Input-select-2"
          disabled={disabled}
          showSearch
          placeholder="Seleccione comuna"
          optionFilterProp="children"
          onSelect={onSelectComuna}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          getPopupContainer={node => node.parentNode}
          value={selectedComuna ? selectedComuna : null}
        >
          {comunas.map((x) => {
            return <Option value={x} key={x}>{x}</Option>;
          })}
        </Select>
      </div>
    </div>
  );
}

export default SelectOrigen;