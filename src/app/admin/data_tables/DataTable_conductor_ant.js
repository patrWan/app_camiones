import React, { useState, useEffect } from "react";
import { Table, Radio, Divider, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";

import * as dayjs from 'dayjs'

var locale_de = require('dayjs/locale/es')

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& table": {
      
    },
    "& thead > tr > th": {
      background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
      color: "black",
      fontSize: "16",
      fontFamily: "Dela Gothic One, cursive",
      
    },
    "& thead > tr": {
      borderWidth: "2px",
      borderColor: "black",
      borderStyle: "solid",
    },
    "& .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th " : {
      background: "#282640",
      color : "white",
      
   },
   boxShadow : '4px 4px 10px 10px rgba(0,0,0,0.1)',
   backgroundColor: "#ff",
   borderRadius : '16px 16px 0 0',
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
  },
  {
    title: "Apellidos",
    dataIndex: "apellidos",
    key: "id",
    
  },
  {
    title: "Estado",
    dataIndex: "estado",
    key: "id",
  },
];




const DataTable_conductor_ant = (props) => {
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
          setTimeout(function(){ setData(result); setIsLoaded(false)}, 1000);
          
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
        selectedRows[0]
      );
      
      //setIsSelected(false)
      setSelectedUser(selectedRows[0]);
      setSelectedItem(selectedRows[0]);

     
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

  const {setIsSelected, setSelectedUser, selectedUser, setSelectedItem} = props;
  const { Text, Link } = Typography;
  const classes = useStyles();
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

        pagination={{ position: ['bottom', 'left'] }}
        bordered ={true}
        className={classes.root}
        loading={isLoaded}
      />
    </div>
  );
};

export default DataTable_conductor_ant;
