import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Alert } from 'antd';
import * as dayjs from 'dayjs'

var locale_de = require('dayjs/locale/es')

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const columns = [
  {
    title: "Modelo",
    dataIndex: "modelo",
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.modelo.localeCompare(b.modelo),
    defaultSortOrder: 'ascend',
  },
  {
    title: "Marca",
    dataIndex: "marca",
    key: "marca",
    responsive: ['sm'],
  },
  {
    title: "Patente",
    dataIndex: "patente",
    key: "patente",
    responsive: ['sm'],
    
  },
];




const DataTable_select_viaje = (props) => {
  const {setIsSelected, setSelectedItem, selectedItem, setSelectedCamion, dataCamionFecha, date} = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);

  const [rowClassname, setRowClassname] = useState('');

  const query = db.collection("camion");
  const observerCamion = query.onSnapshot(
    (querySnapshot) => {
      setSize(querySnapshot.size);
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'modified') {
          setEdit(!edit)
          
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );

  const [x, setX] = useState([]);

  const rowSelection = {
    selectedRowKeys : x,
    onChange: (selectedRowKeys, selectedRows) => {
      setX(selectedRowKeys)
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows[0]
      );
      //setIsSelected(false)
      setSelectedCamion(selectedRows[0])
      if(selectedItem){
        console.log("holas :)")
        selectedItem.camion = selectedRows[0].modelo + "/"+ selectedRows[0].marca +" / "+selectedRows[0].patente;
      }

     
      //Wed, 31 Mar 2021 02:12:39 GMT
      const dateString = "Wed, 31 Mar 2021 02:12:39 GMT";
      var formatDate = dayjs(dateString).locale('es').format("DD MMM. YYYY")
      
      console.log(formatDate);


    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const get__camion = async () => {
    const camiones = [];
    db.collection('camion')
      .get()
      .then((querySnapshot) => {
        console.log("!!!!!!!!!!!!!");
        let item = {};
        querySnapshot.forEach((doc) => {

            var c = {
              id : doc.id,
              modelo : doc.data().modelo,
              marca : doc.data().marca,
              patente : doc.data().patente,
              disponible : doc.data().disponible ? "Disponible" : "En uso",
            }
            camiones.push(c);
          
        });
      })
  setTimeout(function(){ setData(camiones); setIsLoaded(false)}, 1000);

  }

  

  useEffect(() => {
    get__camion();
  }, []);

  useEffect(() => {
    console.log("CAMION_FECHA  => ",dataCamionFecha)
    var formatDate = dayjs(date)
      .locale("es")
      .format("DD MMMM YYYY");
    console.log("FECHA_SELECCIONADA => ",formatDate)
    if(selectedItem === null){
      setX([]);
    }
    
  }, [selectedItem]);

  
  const { Text, Link } = Typography;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert message="Importante! Solo se muestran los camiones disponibles." type="warning" />
      <Table
        rowKey="id"
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        scroll={{ x: 'max-content' }}
        size="small"

        pagination={{ position: ['bottom', 'left'] }}
        bordered ={true}
        className={classes.root}
        rowClassName={rowClassname}
        loading={isLoaded}
        
      />
    </div>
  );
};

export default DataTable_select_viaje;