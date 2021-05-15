import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { DatePicker } from "antd";
import { StatusTag } from "../../../components/StatusTag";

import { Select } from "antd";

import MAP_ONLYVIEW from "../../../components/google-maps/Modal-map-onlyView";
import {DATATABLE_BG_COLOR, DATATABLE_TEXT_COLOR} from "../../../variables";
import * as dayjs from "dayjs";
import { Chip } from "@material-ui/core";
import ModalReporte from "../../../components/modals/ModalReporte";
import locale_ from "antd/es/date-picker/locale/es_ES";

var locale = require("dayjs/locale/es");

const { Option } = Select;
const { RangePicker } = DatePicker;
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
      background: DATATABLE_BG_COLOR,
      color : DATATABLE_TEXT_COLOR,
      
   },
   boxShadow : '4px 4px 10px 10px rgba(0,0,0,0.1)',
   backgroundColor: "#fff",
  },

  filter__section: {
    display: "flex",
    flexDirection: "column",
    height: "20%",
    backgroundColor: "#1D1D34",
    borderRadius: "16px 16px 0 0",
    padding: 5,
  },

  label__container: {},

  filter__container: {
    display: "flex",
    marginTop: 10,
    justifyContent: "center",
    padding: 10,

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
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

  filter: {
    display: "flex",
    flexDirection: "column",
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
      marginRight: 0,
    },
  },

  filter__title: {
    color: "#fff",
    fontSize: 16,
    marginRight: 5,
    fontWeight: "600",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));



const DataTable_conductor_viajes_ant = (props) => {
  const { setIsSelected, setSelectedItem, selectedItem, setViajes } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [x, setX] = useState([]);

  const [rowClassname, setRowClassname] = useState("");

  const [isLoaded, setIsLoaded] = useState(true);

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [empresa_cor, setEmpresaCor] = useState({});
  const [openModalMap, setOpenModalMap] = useState(false);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [conductor_id, setConductorId] = useState(null);
  const [rango_fechas, setRangoFechas] = useState(null);
  //const [fecha, setFecha] = useState(null);

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
  const [removeFilter, setRemoveFilter] = useState(false);
  const [fecha, setFecha] = useState(null);
  const [filterState, setFilterState] = useState([]);

  //const [empresa_cor, setEmpresaCor] = useState({});
  //const [openModalMap, setOpenModalMap] = useState(false);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? 1 : -1,
      defaultSortOrder: "descend",
    },
    {
      title: "Region/Comuna",
      dataIndex: "destino",
      key: "marca",
    },
    {
      title: "Empresa",
      dataIndex: "direccion",
      key: "marca",
      render: (text, empresa) => <a className="text-primary" onClick={() => ver_empresa_map(empresa.empresa_latitud, empresa.empresa_longitud)}><strong>{text}</strong></a>,
    },
    {
      title: "Camion",
      dataIndex: "camion",
      key: "patente",
    },
    {
      title: "Estado",
      key: "disponible",
      render: (text, record) => <StatusTag status={record.estado} />,
    },
  ];

  async function ver_empresa_map(lat, lon){
    await setEmpresaCor({lat : lat, lng : lon  });

    setOpenModalMap(true);
  }

  const query = db.collection("camion");
  const observerCamion = query.onSnapshot(
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
    selectedRowKeys: x,
    onChange: (selectedRowKeys, selectedRows) => {
      setX(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows[0]
      );
      //setIsSelected(false)
      setSelectedItem(selectedRows[0]);

      //Wed, 31 Mar 2021 02:12:39 GMT
      const dateString = "Wed, 31 Mar 2021 02:12:39 GMT";
      var formatDate = dayjs(dateString).locale("es").format("DD MMM. YYYY");

    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const get__viajes = async () => {
    let item = {};
    let data_camiones = {};
    let conductor_item = {};

    let item__list = [];
    let data_camiones__list = [];

    let user = localStorage.getItem("user");
    var docRef = db.collection("usuario").doc(user);
    const viajes = [];
    await docRef.get().then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());

          doc.data().viajes.forEach(async (x) => {
            let viaje = {};

            var formatDate = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY HH:MM A");
            var formatDate2 = dayjs(x.fecha.toDate())
              .locale("es")
              .format("DD MMMM YYYY");

            let estado;
            if (dayjs(x.fecha.toDate()).isBefore(dayjs())) {
              estado = true;
            } else {
              estado = false;
            }

            var camionRef = db.collection("camion").doc(x.id_camion);
            let camion_info = "";

            await camionRef.get().then((doc) => {
              if (doc.exists) {
                camion_info = doc.data().modelo + " " + doc.data().patente;
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });

            let empresa_latitud;
            let empresa_longitud;
            var empresaRef = db.collection("empresa").doc(x.destino);

            empresaRef.get().then((empresa) => {
              if (empresa.exists) {
                item = {};
                //console.log("!! 3");

                let destino = empresa.data().direccion;
                let empresa_name = empresa.data().empresa;

                empresa_latitud = empresa.data().latitud;
                empresa_longitud = empresa.data().longitud;

                item = {
                  id: x.id,
                  fechaSorter: x.fecha.toDate(),
                  fecha: formatDate,
                  conductor: doc.data().nombres,
                  camion: camion_info,
                  origen: x.origen,
                  destino: destino,
                  empresa_id: empresa.id,
                  estado: estado,
                  id_user: doc.id,
                  id_camion: x.id_camion,
                  fecha_camion: formatDate2,
                  direccion: empresa_name,

                  empresa_latitud : empresa_latitud,
                  empresa_longitud : empresa_longitud,
                };

                data_camiones = {
                  id_camion: x.id_camion,
                  fecha: formatDate2,
                };

                //setFilterData([...filterData , item]);

                item__list.push(item);
                data_camiones__list.push(data_camiones);
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    setTimeout(function () {
      setData(item__list);
      setFilterData(item__list);
      setIsLoaded(false);
      setViajes(item__list)
    }, 1000);
  };

  const handleDateFilter = (key) => {
    const selected = parseInt(key);
    if (selected === 3) {
      return setFilterData(data);
    }

    if (selected === 1) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBefore(dayjs())
      );
      return setFilterData(filteredEvents);
    }

    if (selected === 2) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isAfter(dayjs())
      );
      return setFilterData(filteredEvents);
    }
  };

  const handleFilter = (key) => {
    const selected = parseInt(key);
    if (selected === 3) {
      return setFilterData(data);
    }

    if (selected === 1) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBefore(dayjs())
      );
      return setFilterData(filteredEvents);
    }

    if (selected === 2) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isAfter(dayjs())
      );
      return setFilterData(filteredEvents);
    }
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
    setFilterEstado(val);
  }

  function onDeleteRango() {
    setRangoFechas(null);
    setRangoLabel(null);
    setRemoveFilter(true);
  }

  function onDeleteEmpresa() {
    setFilterEmpresa(null);
    setEmpresaLabel(null);
    setRemoveFilter(true);
  }

  function onDeleteEstado() {
    setFilterEstado(null);
    setEstadoLabel(null);
    setRemoveFilter(true);
  }

  function filter_general() {
    console.log("APLICANDO FILTRO ...");
    setFilterData(data);

    if (
      conductor_id !== null &&
      rango_fechas === null &&
      filter_empresa === null &&
      filter_estado === null
    ) {
      console.log("FILTRO POR CONDCUTOR");

      const filteredEvents = data.filter(
        ({ id_user }) => id_user === conductor_id
      );

      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);

      setConductorLabel(true);
    }

    if (
      rango_fechas !== null &&
      conductor_id === null &&
      filter_empresa === null &&
      filter_estado === null
    ) {
      console.log("FILTRO POR RANGO DE FECHAS");
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBetween(
          rango_fechas[0],
          rango_fechas[1],
          "date",
          "[]"
        )
      );
      setRangoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      (filter_empresa !== null) & (rango_fechas === null) &&
      conductor_id === null &&
      filter_estado === null
    ) {
      console.log("FILTRO EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id }) => empresa_id === filter_empresa
      );

      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setEmpresaLabel(true);

      setFilterData(finalFilter);
    }

    if (
      (filter_estado !== null) & (rango_fechas === null) &&
      conductor_id === null &&
      filter_empresa === null
    ) {
      console.log("FILTRO ESTADO");
      const filteredEvents = data.filter(
        ({ estado }) => estado === filter_estado
      );

      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setEstadoLabel(true);

      setFilterData(finalFilter);
    }

    if (
      conductor_id !== null &&
      filter_estado !== null &&
      rango_fechas === null &&
      filter_empresa === null
    ) {
      console.log("FILTRO CONDUCTOR Y ESTADO");

      const filteredEvents = data.filter(
        ({ estado, id_user }) =>
          estado === filter_estado && id_user === conductor_id
      );

      setConductorLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      conductor_id !== null &&
      filter_empresa === null &&
      filter_estado === null
    ) {
      console.log("FILTRO POR CONDCUTOR Y RANGO DE FECHAS");
      const filteredEvents = data.filter(
        ({ id_user, fechaSorter }) =>
          id_user === conductor_id &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      conductor_id === null &&
      filter_empresa !== null &&
      rango_fechas === null &&
      filter_estado !== null
    ) {
      console.log("FILTRO ESTADO Y EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id, estado }) =>
          empresa_id === filter_empresa && estado === filter_estado
      );
      setEmpresaLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      conductor_id !== null &&
      filter_empresa !== null &&
      rango_fechas === null &&
      filter_estado === null
    ) {
      console.log("FILTRO CONDUCTOR Y EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id, id_user }) =>
          empresa_id === filter_empresa && id_user === conductor_id
      );
      setEmpresaLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      filter_empresa !== null &&
      conductor_id === null &&
      filter_estado === null
    ) {
      console.log("RANGO DE FECHAS Y FILTRO EMPRESA");
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter }) =>
          empresa_id === filter_empresa &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      filter_estado !== null &&
      filter_empresa === null &&
      conductor_id === null
    ) {
      console.log("RANGO DE FECHAS Y ESTADO");
      const filteredEvents = data.filter(
        ({ fechaSorter, estado }) =>
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      conductor_id === null &&
      filter_empresa !== null &&
      filter_estado !== null
    ) {
      console.log("RANGO DE FECHAS Y FILTRO EMPRESA  Y ESTADO");
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter, estado }) =>
          empresa_id === filter_empresa &&
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      conductor_id !== null &&
      filter_empresa !== null &&
      filter_estado === null
    ) {
      console.log("CONDUCTOR Y , RANGO DE FECHAS Y FILTRO EMPRESA ");
      console.log(
        dayjs("30 Abril 2021 21:04 PM").isBetween(
          rango_fechas[0],
          rango_fechas[1],
          "date",
          "[]"
        )
      );
      const filteredEvents = data.filter(
        ({ empresa_id, fechaSorter, id_user }) =>
          id_user === conductor_id &&
          empresa_id === filter_empresa &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas !== null &&
      conductor_id !== null &&
      filter_empresa === null &&
      filter_estado !== null
    ) {
      console.log("CONDUCTOR Y , RANGO DE FECHAS Y FILTRO ESTADO ");
      const filteredEvents = data.filter(
        ({ estado, fechaSorter, id_user }) =>
          id_user === conductor_id &&
          estado === filter_estado &&
          dayjs(fechaSorter).isBetween(
            rango_fechas[0],
            rango_fechas[1],
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEstadoLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }

    if (
      rango_fechas === null &&
      conductor_id !== null &&
      filter_empresa !== null &&
      filter_estado !== null
    ) {
      console.log("CONDUCTOR Y , EMPRESA Y FILTRO ESTADO ");
      const filteredEvents = data.filter(
        ({ empresa_id, estado, id_user }) =>
          id_user === conductor_id &&
          estado === filter_estado &&
          empresa_id === filter_empresa
      );

      setEmpresaLabel(true);
      setEstadoLabel(true);
      setConductorLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
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
            "date",
            "[]"
          )
      );

      setRangoLabel(true);
      setEmpresaLabel(true);
      setConductorLabel(true);
      setEstadoLabel(true);
      const finalFilter = filteredEvents.sort((a, b) =>
        dayjs(a.fechaSorter).isAfter(dayjs(b.fechaSorter)) ? -1 : 1
      );
      setFilterData(finalFilter);
    }
  }

  function rangeOnChange(date, dateString) {
    setRangoFechas(date);
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

  function create_pdf() {
    setOpen(true);
  }

  useEffect(async() => {
    await get__viajes();
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

        setEmpresaList(list__empresas);

      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

      let conductor_list = [];
      db.collection("usuario")
      .get()
      .then((querySnapshot) => {
        let conductor_item;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          conductor_item = {
            id: doc.id,
            nombres: doc.data().nombres,
            apellidos: doc.data().apellidos,
            disabled: doc.data().disabled,
          };
          conductor_list.push(conductor_list);
        });

        setConductoresList(conductor_list);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

      
  }, [size, edit]);

  useEffect(() => {
    console.log("!! UseEffect selectedItem === null ?");
    if (selectedItem === null) {
      setX([]);
    }
  }, [selectedItem]);

  useEffect(async () => {
    if (removeFilter === true) {
      console.log("USE EFFECT REMOVE");

      filter_general();
    }
    setRemoveFilter(false);

    console.log(removeFilter);
  }, [removeFilter]);

  return (
    <div className={classes.root}>
      <ModalReporte open={open} setOpen={setOpen} data={filterData} />
      <div className={classes.filter__section}>
        <div className={classes.label__container}>
          <span className={classes.filter__title}>Filtrando por : </span>
          {conductorLabel || rangoLabel || estadoLabel || empresaLabel ? (
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
          {rangoLabel ? (
            <Chip
              label="rango de fechas"
              color="secondary"
              size="medium"
              onDelete={onDeleteRango}
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
              onDelete={onDeleteEmpresa}
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
              onDelete={onDeleteEstado}
            />
          ) : (
            ""
          )}
        </div>
        <div className={classes.filter__container}>

          <div className={classes.filter}>
            <span className={classes.filter__title}>Por rango de fechas :</span>
            <RangePicker
              onChange={rangeOnChange}
              locale={locale_}
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
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {empresaList.map((x) => {
                return <Option value={x.id} key={x.id}>{x.empresa}</Option>;
              })}
            </Select>
          </div>
          <div className={classes.filter}>
            <span className={classes.filter__title}>Por Estado :</span>
            <Select
              id="state"
              showSearch
              placeholder="Seleccione Estado"
              optionFilterProp="children"
              onSelect={onSelectEstado}
              value={filter_estado}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={true} key="1">Completado</Option>
              <Option value={false} key="2">Programado</Option>
            </Select>
          </div>
        </div>
        <div className={classes.button__container}>
          <button onClick={filter_general} className={classes.button}>
            <i className="bi bi-filter"></i> Filtrar
          </button>
          <button onClick={clear_filter} className={classes.button}>
            Limpiar Filtros
          </button>
          <button onClick={create_pdf} className={classes.button}>
            <i className="bi bi-file-earmark-plus-fill"></i> Generar PDF
          </button>
        </div>
      </div>
      <MAP_ONLYVIEW openModalMap={openModalMap} setOpenModalMap={setOpenModalMap} empresa_cor={empresa_cor}/>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filterData}
        scroll={{ x: "max-content" }}
        size="small"
        pagination={{ position: ["bottom", "left"] }}
        bordered={true}
        className={classes.root}
        rowClassName={rowClassname}
        loading={isLoaded}
      />
    </div>
  );
};

export default DataTable_conductor_viajes_ant;
