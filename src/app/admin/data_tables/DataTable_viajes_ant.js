import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db, fire } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "antd";
import { DatePicker, Select } from "antd";

import Chip from "@material-ui/core/Chip";

import moment from "moment";

import ModalReporte from "../../../components/modals/ModalReporte";

import * as dayjs from "dayjs";
import { StatusTag } from "../../../components/StatusTag";
import { StatusFilter } from "../../../components/StatusFilter";
import { DateFilter } from "../../../components/DateFilter";

import "moment/locale/es";
import locale from "antd/es/date-picker/locale/es_ES";

var locale_de = require("dayjs/locale/es");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

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

  filter__section: {
    display: "flex",
    flexDirection: "column",
    height: "20%",
    backgroundColor : "#1D1D34",
    borderRadius : '16px 16px 0 0',
    padding : 5,
  },

  label__container: {},

  filter__container: {
    
    display: "flex",
    marginTop: 10,
    justifyContent : "center",
    padding : 10,

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  button__container: {
    display: "flex",
    marginTop: 10,
    marginBottom: 10,
    justifyContent : "center",

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems : "center",
    },
  },

  button : {
    width : "20%",
    marginRight : 10,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems : "center",
      width : "80%",
      marginRight : 0,
    },
  },

  filter: {
    display: "flex",
    flexDirection : "column",
    marginRight : 20,
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
      marginRight : 0,
    },
  },

  filter__title: {
    color : '#fff',
    fontSize : 16,
    marginRight: 5,
    fontWeight : "600",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const columns = [
  {
    title: "Fecha",
    dataIndex: "fecha",
    render: (text) => <a>{text}</a>,

    sorter: (a, b) =>
      dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? 1 : -1,
      defaultSortOrder: "descend",
  },

  {
    title: "Conductor",
    dataIndex: "conductor",
    key: "conductor",
  },
  {
    title: "Camion",
    dataIndex: "camion",
    key: "camion",
  },
  /*
  {
    title: "Origen",
    dataIndex: "origen",
    key: "origen",
    responsive: ["sm"],
    sorter: (a, b) => a.origen.localeCompare(b.origen),
    defaultSortOrder: "ascend",
  },
  */
 /*
  {
    title: "Destino",
    dataIndex: "destino",
    key: "destino",
    responsive: ["sm"],
  },
  */
  {
    title: "Empresa",
    dataIndex: "direccion",
    key: "direccion",
  },
  {
    title: "Estado",
    key: "estado",
    render: (text, record) => <StatusTag status={record.estado} />,
  },
];

const DataTable_viajes_ant = (props) => {
  const {
    setIsSelected,
    setSelectedItem,
    selectedItem,
    user__id,
    setUser__id,
    setCamion__id,
    setDataCamionFecha,
    setFechaCamion,
    setItemToDelete,
    setConductor,
    setDireccion,

    selectRows,
    setSelectRows,
    openSlideMenu
  } = props;

  const { RangePicker } = DatePicker;
  const { Option } = Select;

  const [open, setOpen] = React.useState(false);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);

  const [rowClassname, setRowClassname] = useState("");

  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
  };

  const [x, setX] = useState([]);

  const [stateName, setStateName] = useState("");

  /** filtros */
  const [filterData, setFilterData] = useState([]);

  const [filterState, setFilterState] = useState([]);

  const [conductor_id, setConductorId] = useState(null);
  const [rango_fechas, setRangoFechas] = useState(null);
  const [fecha, setFecha] = useState(null);

  const [filter_empresa, setFilterEmpresa] = useState(null);
  const [filter_estado, setFilterEstado] = useState(null);

  const [empresaList, setEmpresaList] = useState([]);

  const [conductores_list, setConductoresList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [empresa, setEmpresa] = useState("");
  /** LABELS STATE */

  const [conductorLabel, setConductorLabel] = useState(false);
  const [rangoLabel, setRangoLabel] = useState(false);
  const [empresaLabel, setEmpresaLabel] = useState(false);
  const [estadoLabel, setEstadoLabel] = useState(false);

  function filter_general() {
    setFilterData(data);
    console.log("filtered data => ", filterData);

    if (conductor_id !== null && rango_fechas === null && filter_empresa === null && filter_estado === null) {
      console.log("FILTRO POR CONDCUTOR");

      const filteredEvents = data.filter(
        ({ id_user }) => id_user === conductor_id
      );

      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);

      setConductorLabel(true);
    }

    if (rango_fechas !== null && conductor_id === null && filter_empresa === null && filter_estado === null) {
      console.log("FILTRO POR RANGO DE FECHAS");
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBetween(
          rango_fechas[0],
          rango_fechas[1],
          "month",
          "[]"
        )
      );
      setRangoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (filter_empresa !== null & rango_fechas === null && conductor_id === null && filter_estado === null) {

      console.log("FILTRO EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id }) => empresa_id === filter_empresa
      );

      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setEmpresaLabel(true);

      setFilterData(finalFilter);
    }

    if (filter_estado !== null  & rango_fechas === null && conductor_id === null && filter_empresa === null) {

      console.log("FILTRO ESTADO");
      const filteredEvents = data.filter(
        ({ estado }) => estado === filter_estado
      );

      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setEstadoLabel(true);
      
      setFilterData(finalFilter);
    }

    if (conductor_id !== null && filter_estado !== null && rango_fechas === null && filter_empresa === null) {
      console.log("FILTRO CONDUCTOR Y ESTADO");

      const filteredEvents = data.filter(
        ({ estado, id_user }) =>
          estado === filter_estado &&
          id_user === conductor_id
      );

      setConductorLabel(true);
      //setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    

    if (rango_fechas !== null && conductor_id !== null && filter_empresa === null && filter_estado === null) {
      console.log("FILTRO POR CONDCUTOR Y RANGO DE FECHAS");
      const filteredEvents = data.filter(
        ({ id_user, fechaSorter }) =>
          id_user === conductor_id &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );
            
      setRangoLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    

    if (conductor_id !== null && filter_empresa !== null && rango_fechas === null &&   filter_estado === null) {
      console.log("FILTRO CONDUCTOR Y EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id, id_user }) =>
          empresa_id === filter_empresa && id_user === conductor_id
      );
      setEmpresaLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (rango_fechas !== null && filter_empresa !== null && conductor_id === null && filter_estado === null ) {
      console.log("RANGO DE FECHAS Y FILTRO EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter }) =>
          empresa_id === filter_empresa &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (rango_fechas !== null && filter_estado !== null &&  filter_empresa === null && conductor_id === null  ) {
      console.log("RANGO DE FECHAS Y ESTADO");
      const filteredEvents = data.filter(
        ({ fechaSorter, estado }) =>
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (rango_fechas !== null && conductor_id === null && filter_empresa !== null && filter_estado !== null
    ) {
      console.log("RANGO DE FECHAS Y FILTRO EMPRESA  Y ESTADO");
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter, estado }) =>
          empresa_id === filter_empresa &&
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (rango_fechas !== null && conductor_id !== null && filter_empresa !== null && filter_estado === null) {
      console.log("CONDUCTOR Y , RANGO DE FECHAS Y FILTRO EMPRESA ");
      console.log(dayjs("30 Abril 2021 21:04 PM").isBetween(
        rango_fechas[0],
        rango_fechas[1],
        "month",
        "[]"
      ));
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter, id_user }) =>
          id_user === conductor_id &&
          empresa_id === filter_empresa &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (rango_fechas !== null && conductor_id !== null && filter_empresa === null && filter_estado !== null) {
      console.log("CONDUCTOR Y , RANGO DE FECHAS Y FILTRO ESTADO ");
      const filteredEvents = data.filter(
        ({ estado, fechaSorter, id_user }) =>
          id_user === conductor_id &&
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEstadoLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      conductor_id !== null &&
      filter_empresa !== null &&
      filter_estado !== null
    ) {
      console.log("FILTRO EMPRESA Y RANGO DE FECHAS Y ESTADO Y CONDUCTOR");
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter, estado, id_user }) =>
          empresa_id === filter_empresa &&
          estado === filter_estado &&
          id_user === conductor_id &&
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "month",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setConductorLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
      setFilterData(finalFilter);
    }

    /**
     * Filtro por region y comuna
     * Filtro por empresa
     */

    //console.log(filteredEvents);
  }

  function clear_filter() {
    setConductorId(null);
    setRangoFechas(null);
    setFecha(null);
    setFilterEmpresa(null);
    setFilterEstado(null);

    setConductorLabel(false);
    setRangoLabel(false);
    setEmpresaLabel(false);
    setEstadoLabel(false);

    setFilterData(data);
  }

  const handleFilter = (key) => {
    const selected = parseInt(key);
    if (selected === 3) {
      return setFilterData(data);
    }

    if (selected === 1) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBefore(dayjs())
      );
      //console.log("DATA FILTER => ",filteredEvents)
      setStateName("Completados");
      return setFilterData(filteredEvents);
    }

    if (selected === 2) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isAfter(dayjs())
      );
      //console.log("DATA FILTER => ",filteredEvents)
      setStateName("Programados");
      return setFilterData(filteredEvents);
    }
  };

  const handleDateFilter = (key) => {
    const selected = parseInt(key);
    if (selected === 0) {
      return setFilterData(data);
    }

    if (selected === 1) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isSame("2021-10-01", "month")
      );
      console.log("DATA FILTER => ", filteredEvents);
      return setFilterData(filteredEvents);
    }

    if (selected === 2) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isAfter(dayjs())
      );
      console.log("DATA FILTER => ", filteredEvents);
      return setFilterData(filteredEvents);
    }
  };

  function onChangeMonth(date, dateString) {
    setFecha(date);
  }

  function rangeOnChange(date, dateString) {
    setRangoFechas(date);
  }

  const query2 = db.collection("usuario");
  const observerUsuario = query2.onSnapshot(
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

  const rowSelection = {
    selectedRowKeys: selectRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectRows(selectedRowKeys);
      openSlideMenu();

      var selected__viaje = {
        id: selectedRows[0].id,
        fecha: selectedRows[0].fechaSorter,
        camion: selectedRows[0].id_camion,
        origen: selectedRows[0].origen,
        destino: selectedRows[0].empresa_id,
        id_camion: selectedRows[0].id_camion,
      };

      var delete__viaje = {
        id: selectedRows[0].id,
        fecha: selectedRows[0].fechaSorter,
        camion: selectedRows[0].id_camion,
        origen: selectedRows[0].origen,
        destino: selectedRows[0].empresa_id,
        id_camion: selectedRows[0].id_camion,
      };

      console.log("Data => ", selectedRows[0]);

      console.log("Viaje seleccionado => ", selected__viaje);
      console.log("Viaje a borrar => ", delete__viaje);
      console.log("Usuario seleccionado => ", selectedRows[0].id_user);

      setConductor(selectedRows[0].conductor);
      setSelectedItem(selected__viaje);
      setItemToDelete(delete__viaje);

      setUser__id(selectedRows[0].id_user);

      setFechaCamion(selectedRows[0].fecha_camion);
      setCamion__id(selectedRows[0].id_camion);
      setDireccion(selectedRows[0].destino + ", " + selectedRows[0].direccion);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };



  const get__viajes = async () => {
    let item__list = [];
    let data_camiones__list = [];
    let conductor_list = [];

    db.collection("usuario")
      .where("email", "!=", "administrador@trudistic.cl")
      .get()
      .then((querySnapshot) => {
        let item = {};
        let data_camiones = {};
        let conductor_item = {};

        querySnapshot.forEach((doc) => {
          item = {};
          /** OBTENGO A LOS USUARIOS REGISTRADOS */
          conductor_item = {
            id: doc.id,
            nombres: doc.data().nombres,
          };
          conductor_list.push(conductor_item);

          doc.data().viajes.forEach(async (x) => {
            //console.log("!! 1");
            var formatDate = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY HH:m A");
            var formatDate2 = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY");

            let estado;
            if (dayjs(x.fecha.toDate()).isBefore(dayjs())) {
              estado = true;
            } else {
              estado = false;
            }

            var empresaRef = db.collection("empresa").doc(x.destino);
            var camionRef =  db.collection("camion").doc(x.id_camion);
            let camion_info = '';

            await camionRef.get().then((doc) => {
              if (doc.exists) {
                  camion_info = doc.data().modelo+" "+doc.data().patente;
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
            });

            let empresa_info = '';
            let destino = '';
            let idEmpresa = '';
            await empresaRef.get().then((doc) => {
              if (doc.exists) {
                  idEmpresa = doc.id;
                  empresa_info = doc.data().empresa;
                  destino =
                  doc.data().region +
                  ", " +
                  doc.data().comuna +
                  ", " +
                  doc.data().direccion;
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
            });

                item = {};
                //console.log("!! 3");

                

                item = {
                  id: x.id,
                  fechaSorter: x.fecha.toDate(),
                  fecha: formatDate,
                  conductor: doc.data().nombres,
                  camion: camion_info ? camion_info : x.id_camion,
                  origen: x.origen,
                  destino: destino,
                  empresa_id: idEmpresa ? idEmpresa : x.destino,
                  estado: estado,
                  id_user: doc.id,
                  id_camion: x.id_camion,
                  fecha_camion: formatDate2,
                  direccion: empresa_info ? empresa_info : "Empresa eliminada...",
                };

                data_camiones = {
                  id_camion: x.id_camion,
                  fecha: formatDate2,
                };

                //setFilterData([...filterData , item]);

                item__list.push(item);
                data_camiones__list.push(data_camiones);

            //console.log(doc.data().viajes.length);
          });
        });
        setTimeout(function () {
          //console.log("!! 4");
          setDataCamionFecha(data_camiones__list);
          setData(item__list);
          const finalFilter = item__list.sort((a, b) => dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1);
          setFilterData(finalFilter);
          setFilterState(item__list);
          setConductoresList(conductor_list);
        }, 500);
      });
    //console.log("conductores list =>",conductores_list)
  };

  const handleDelete = () => {
    console.log("Quitar filtro");
    setFilterState(data);
  };

  /** Select Section */
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  function onSelect(val) {
    setConductorId(val);
  }

  function onSelectEmpresa(val) {
    setFilterEmpresa(val);
  }

  function onSelectEstado(val) {
    console.log("oin select estado => ", val);
    setFilterEstado(val);
  }

  function create_pdf() {
    console.log("CREAR PDF");
    setOpen(true);
  }

  useEffect(() => {
    //console.log("EFFECT");
    get__viajes();
    let list__empresas = [];
    db.collection("empresa")
      .get()
      .then((querySnapshot) => {
        let e;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          e = {
            id: doc.id,
            empresa: doc.data().empresa,
            region: doc.data().region,
            comuna: doc.data().comuna,
            direccion: doc.data().direccion,
          };

          list__empresas.push(e);
        });
        //console.log(list__empresas);

        setEmpresaList(list__empresas);

        //console.log(empresaList);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, [size, edit]);

  useEffect(() => {
    //console.log("!! UseEffect selectedItem === null ?");
    if (selectedItem === null) {
      setX([]);
    }
  }, [selectedItem]);

  useEffect(() => {}, []);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.filter__section}>
        <div className={classes.label__container}>
          <span className={classes.filter__title}>Filtrando por : </span>
          {conductorLabel || rangoLabel || empresaLabel ? (
            ""
          ) : (
            <Chip
              label="No hay filtros activos"
              color="primary"
              size="medium"
              onDelete={handleDelete}
              clickable
            />
          )}
          {conductorLabel ? (
            <Chip
              label="conductor"
              color="secondary"
              size="medium"
              onDelete={handleDelete}
              clickable
            />
          ) : (
            ""
          )}
          {rangoLabel ? (
            <Chip
              label="rango de fechas"
              color="secondary"
              size="medium"
              onDelete={handleDelete}
              clickable
            />
          ) : (
            ""
          )}
          {empresaLabel ? (
            <Chip
              label="empresa"
              color="secondary"
              size="medium"
              onDelete={handleDelete}
              clickable
            />
          ) : (
            ""
          )}
          {estadoLabel ? (
            <Chip
              label="estado"
              color="secondary"
              size="medium"
              onDelete={handleDelete}
            />
          ) : (
            ""
          )}
        </div>
        <div className={classes.filter__container}>
          <div className={classes.filter}>
            <span className={classes.filter__title}>Por conductor :</span>
            <Select
              showSearch
              placeholder="Seleccione Conductor"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              onSelect={onSelect}
              value={conductor_id}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {conductores_list.map((x) => {
                return <Option value={x.id}>{x.nombres}</Option>;
              })}
            </Select>
          </div>

          <div className={classes.filter}>
            <span className={classes.filter__title}>Por rango de fechas :</span>
            <RangePicker
              onChange={rangeOnChange}
              picker="month"
              locale={locale}
              value={rango_fechas}
            />
          </div>
          <div className={classes.filter}>
                <span className={classes.filter__title}>Por Empresa :</span>
                <Select
                  showSearch
                  placeholder="Seleccione Empresa"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  onSelect={onSelectEmpresa}
                  value={filter_empresa}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {empresaList.map((x) => {
                    return <Option value={x.id}>{x.empresa}</Option>;
                  })}
                </Select>
          </div>
          <div className={classes.filter}>
                <span className={classes.filter__title}>Por Estado :</span>
                <Select
                  showSearch
                  placeholder="Seleccione Estado"
                  optionFilterProp="children"
                  onSelect={onSelectEstado}
                  value={filter_estado}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                    <Option value={true}>Completado</Option>
                    <Option value={false}>Programado</Option>
                </Select>
          </div>
          
        </div>
        <div className={classes.button__container}>
            <button onClick={filter_general} className={classes.button}><i class="bi bi-filter"></i> Filtrar</button>
            <button onClick={clear_filter} className={classes.button}>Limpiar Filtros</button>
            <button onClick={create_pdf} className={classes.button}><i class="bi bi-file-earmark-plus-fill"></i> Generar PDF</button>
        </div>
      </div>

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
        rowClassName={rowClassname}
        loading={false}
      />

      <ModalReporte open={open} setOpen={setOpen} data={filterData}/>
    </div>
  );
};

export default DataTable_viajes_ant;
