import React, { useState, useEffect } from "react";
import { Table, Radio, Divider, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";

import * as dayjs from 'dayjs'

var locale_de = require('dayjs/locale/es')

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const columns = [
  {
    title: "Correo",
    dataIndex: "email",
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Nombres",
    dataIndex: "nombres",
    key: "id",
    responsive: ['sm'],
  },
  {
    title: "Apellidos",
    dataIndex: "apellidos",
    key: "id",
    responsive: ['sm'],
    
  },
  {
    title: "Rut",
    dataIndex: "rut",
    key: "rut",
    responsive: ['xl'],
  },
];




const DataTable_select_conductor = (props) => {
  const {setIsSelected, setSelectedUser, selectedUser, selectedItem, setConductor} = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);

  const query = db.collection("usuario");
  const observerUsuario = query.onSnapshot(
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

  const get__usuario = () => {
    const url = "http://localhost:4000/api/admin/";
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTimeout(function(){ setData(result);; setIsLoaded(false)}, 1000);
          
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          setError(error);
        }
      );
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [x, setX] = useState([]);
  const rowSelection = {
    selectedRowKeys : x,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys([selectedRows])
      setX(selectedRowKeys)
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows[0].nombres
      );
      
      //setIsSelected(false)
      setSelectedUser(selectedRows[0])
      if(selectedItem){
        selectedItem.conductor = selectedRows[0].nombres;
        setConductor(selectedRows[0].nombres);
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

  useEffect(() => {
    get__usuario();
  }, [size, edit]);

 
  const { Text, Link } = Typography;
  const classes = useStyles();
  const Usuario = () => {
    return(
      <span>Usuario seleccionado: {selectedUser
        ? <Text strong> {selectedUser.email}</Text>
        : " Pinche en una fila para seleccionar usuario."} <Button onClick={() => setX([])}>X</Button></span>
    )
  }
  return (
    <div className={classes.root}>
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
        title={() => <Usuario/>}

        pagination={{ position: ['bottom', 'left'] , defaultPageSize: 5}}
        bordered ={true}
        className={classes.root}
        loading={isLoaded}

        
      />
    </div>
  );
};

export default DataTable_select_conductor;