import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import MAP_ONLYVIEW from "../../../components/google-maps/Modal-map-onlyView";

import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "antd";
import * as dayjs from "dayjs";

var locale_de = require("dayjs/locale/es");

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
   backgroundColor: "#fff",
  },

  row: {},
}));

const DataTable_empresa = (props) => {

  const {
    setIsSelected,
    setSelectedItem,
    selectedItem,
    mensaje_accion,

    selectRows,
    setSelectRows,
    openSlideMenu
  } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);

  const [rowClassname, setRowClassname] = useState("");

  const [visible, setVisible] = useState(false);

  const [empresa_cor, setEmpresaCor] = useState({});
  const [openModalMap, setOpenModalMap] = useState(false);

  

  const columns = [
    {
      title: "Empresa",
      dataIndex: "empresa",
      key : "empresa",
      render: (text, empresa) => <strong  onClick={() => ver_empresa_map(empresa)}>{text}</strong>,
      sorter: (a, b) => a.empresa.localeCompare(b.empresa),
    },
    {
      title: "Direccion",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) =>
      estado === "true" ? (<strong style={{ color: "red" }}>Inactivo</strong>) : (<strong className="text-primary">Activo</strong>),
    },
    {
      title: "Acción",
      dataIndex: "accion",
      key: "accion",
      render: (text, empresa) => <button className="btn btn-primary" onClick={() => ver_empresa_map(empresa)}>Ver en el Mapa</button>,
    },
  ];

  async function ver_empresa_map(empresa){
    console.log("Ver empresa", empresa);
    // abrir modal
    //entregar lat y lng

    await setEmpresaCor({lat : empresa.latitud, lng :empresa.longitud });

    console.log(empresa_cor);

    setOpenModalMap(true);
  }
  
  const handleClose = () => {
    setVisible(false);
  };

  const query = db.collection("empresa");
  const observerEmpresa = query.onSnapshot(
    (querySnapshot) => {
      setSize(querySnapshot.size);
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          setEdit(!edit);
        }
      });
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );

  const [x, setX] = useState([]);

  const rowSelection = {
    selectedRowKeys: selectRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectRows(selectedRowKeys);
      openSlideMenu();

      //setIsSelected(false)
      setSelectedItem(selectedRows[0]);

      //Wed, 31 Mar 2021 02:12:39 GMT
      const dateString = "Wed, 31 Mar 2021 02:12:39 GMT";
      var formatDate = dayjs(dateString).locale("es").format("DD MMM. YYYY");

      console.log(selectedRows[0].direccion);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const get__empresa = async () => {
    const camionRef = db.collection("empresa");
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const empresas = [];
    snapshot.forEach((doc) => {
      var e = {
        id: doc.id,
        direccion: doc.data().direccion,
        empresa: doc.data().empresa,
        telefono : doc.data().telefono,
        latitud : doc.data().latitud ? doc.data().latitud : "",
        longitud : doc.data().longitud ?doc.data().longitud : "" ,
        estado : doc.data().estado,
      };
      empresas.push(e);
    });
    setTimeout(function () {
      const filteredEvents = empresas.sort((a, b) => a.estado.localeCompare(b.estado) || a.empresa.localeCompare(b.empresa)) 
      setData(filteredEvents);
      setIsLoaded(false);
    }, 1000);
  };

  

  useEffect(() => {
    get__empresa();
  }, [size, edit]);

  useEffect(() => {
    console.log("!! UseEffect selectedItem === null ?");
    if (selectedItem === null) {
      setX([]);
    }
  }, [selectedItem]);

  const { Text, Link } = Typography;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MAP_ONLYVIEW openModalMap={openModalMap} setOpenModalMap={setOpenModalMap} empresa_cor={empresa_cor}/>
      <Table
        rowKey="id"
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        size="middle"
        pagination={{ position: ["bottomCenter"] }}
        bordered={true}
        className={classes.root}
        rowClassName={classes.row}
        loading={isLoaded}
        onHeaderRow={(record, index) => {
          return {
            onClick: (e) => {
              let tr = e.target.parentNode;
              console.log("event", tr);
            }

          };
        }}
        
      />
    </div>
  );
};

export default DataTable_empresa;
