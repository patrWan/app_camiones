import React, { useState, useEffect } from "react";
import { Table, Typography, Select } from "antd";
import { db } from "../../../db/firebase";
import { makeStyles } from "@material-ui/core/styles";

import {DATATABLE_BG_COLOR, DATATABLE_TEXT_COLOR} from "../../../variables";

import * as dayjs from "dayjs";

var locale_de = require("dayjs/locale/es");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& table": {},
    "& thead > tr > th": {
      backgroundColor: DATATABLE_BG_COLOR,
      color: "black",
      fontSize: "16",
      fontFamily: "Dela Gothic One, cursive",
    },
    "& thead > tr": {
      borderWidth: "2px",
      borderColor: "black",
      borderStyle: "solid",
    },
    "& .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th ":
      {
        background: DATATABLE_BG_COLOR,
        color: DATATABLE_TEXT_COLOR,
      },
    boxShadow: "4px 4px 10px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#ff",
    borderRadius: "16px 16px 0 0",
  },

  filter__container: {
    display: "flex",
    marginTop: 10,
    justifyContent: "center",
    padding: 10,

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  filter: {
    display: "flex",
    flexDirection: "column",
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
      marginRight: 0,
    },
  },

  button__container: {
    display: "flex",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  button: {
    width: "20%",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      width: "80%",
      marginRight: 0,
    },
  },

  buscador: {
    width: "40%",
    padding: 5,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const columns = [
  {
    title: "Correo",
    dataIndex: "email",
    render: (text) => <strong className="">{text}</strong>,
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
    key: "estado",
    render: (estado) =>
      estado === "true" ? (<strong className="text-danger">Inactivo</strong>) : (<strong className="text-success">Activo</strong>),
  },
];

const DataTable_conductor_ant = (props) => {
  const {
    setIsSelected,
    setSelectedUser,
    selectedUser,
    setSelectedItem,

    selectRows,
    setSelectRows,
    openSlideMenu,
    functionBuscar,
  } = props;

  const { Option } = Select;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [filter_estado, setFilterEstado] = useState(null);
  const [filter_correo, setFilterCorreo] = useState(null);
  const [filter_nombres, setFilterNombres] = useState("");

  const query = db.collection("usuario");
  const observerUsuario = query.onSnapshot(
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

  const get__usuario = () => {
    const url = "https://trudistics-admin-server.vercel.app/api/admin";
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setTimeout(function () {
            const filteredEvents = result.sort((a, b) => a.estado.localeCompare(b.estado))

            setData(result);
            setFilterData(filteredEvents);

            setIsLoaded(false);
          }, 1000);
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
  const rowSelection = {
    selectedRowKeys: selectRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys([selectedRows]);
      setSelectRows(selectedRowKeys);
      openSlideMenu();
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
      var formatDate = dayjs(dateString).locale("es").format("DD MMM. YYYY");

      console.log(formatDate);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  useEffect(async () => {
    console.log("<----RENDER TABLA USUARIOS---->");
    await get__usuario();
  }, [size, edit]);

  const { Text, Link } = Typography;
  const classes = useStyles();

  function onSelectEstado(val) {
    console.log("on select estado => ", val);
    setFilterEstado(val);
  }

  function onSelectCorreo(val) {
    console.log("on select correo => ", val);
    setFilterCorreo(val);
  }

  function onChangeNombre(val) {
    console.log("on change nombre => ", val.target.value);

    setFilterNombres(val.target.value);

    const filteredEvents = data.filter(({ nombres, email, rut }) =>
      nombres.toLowerCase().includes(val.target.value.toLowerCase()) ||
      email.toLowerCase().includes(val.target.value.toLowerCase())
    );
    
    setFilterData(filteredEvents);
  }

  function filter_general() {
    console.log("filter general");
    if (filter_estado !== null && filter_correo === null) {
      const filteredEvents = data.filter(
        ({ estado }) => estado === filter_estado
      );
      setFilterData(filteredEvents);
    }

    if (filter_estado === null && filter_correo !== null) {
      const filteredEvents = data.filter(
        ({ email }) => email === filter_correo
      );
      setFilterData(filteredEvents);
    }

    if (filter_estado !== null && filter_correo !== null) {
      const filteredEvents = data.filter(
        ({ estado, email }) =>
          estado === filter_estado && email === filter_correo
      );
      setFilterData(filteredEvents);
    }
  }

  function limpiar_filtros() {
    setFilterData(data);

    setFilterCorreo(null);
    setFilterEstado(null);
    setFilterNombres("");
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
        dataSource={filterData}
        scroll={{ x: "max-content" }}
        size="small"
        pagination={{ position: ["bottom", "left"] }}
        bordered={true}
        className={classes.root}
        loading={isLoaded}
        title={() => (
          <div>
            <input
              type="text"
              placeholder="Busqueda por Nombre o Correo..."
              onChange={(e) => onChangeNombre(e)}
              value={filter_nombres}
              className={classes.buscador}
            />
          </div>
        )}
      />
    </div>
  );
};

export default DataTable_conductor_ant;
