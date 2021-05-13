import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";

import { StatusFilter } from "../../../components/StatusFilter";
import { DateFilter } from "../../../components/DateFilter";
import { StatusTag } from "../../../components/StatusTag";

import MAP_ONLYVIEW from "../../../components/google-maps/Modal-map-onlyView";

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
}));



const DataTable_conductor_viajes_ant = (props) => {
  const { setIsSelected, setSelectedItem, selectedItem, setViajes } = props;

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
    //console.log("Ver empresa", empresa);
    // abrir modal
    //entregar lat y lng

    await setEmpresaCor({lat : lat, lng : lon  });

    console.log(empresa_cor);

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

      console.log(formatDate);
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
    let conductor_list = [];

    let user = localStorage.getItem("user");
    var docRef = db.collection("usuario").doc(user);
    const viajes = [];
    docRef
      .get()
      .then((doc) => {
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
                console.log("aaa => ",item__list);
                data_camiones__list.push(data_camiones);
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });

            /** antes de */
            if (dayjs(x.fecha.toDate()).isBefore(dayjs()) == true) {
              console.log(
                "Viajes Anteriores => ",
                dayjs(x.fecha.toDate())
                  .locale("es")
                  .format("DD MMMM YYYY hh:mm A")
              );
            } else if (
              dayjs(x.fecha.toDate()).isSame(dayjs(), "date") == true
            ) {
              console.log(
                "Posee un viaje hoy => ",
                dayjs(x.fecha.toDate())
                  .locale("es")
                  .format("DD MMMM YYYY hh:mm A")
              );
            } else if (dayjs(x.fecha.toDate()).isAfter(dayjs()) == true) {
              console.log(
                "Proximos viajes => ",
                dayjs(x.fecha.toDate())
                  .locale("es")
                  .format("DD MMMM YYYY hh:mm A")
              );
            }
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

  const handleFilter = (key) => {
    const selected = parseInt(key);
    if (selected === 3) {
      return setFilterData(data);
    }

    if (selected === 1) {
      const filteredEvents = data.filter(({ fechaSorter }) =>
        dayjs(fechaSorter).isBefore(dayjs())
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

  useEffect(() => {
    get__viajes();
  }, [size, edit]);

  useEffect(() => {
    console.log("!! UseEffect selectedItem === null ?");
    if (selectedItem === null) {
      setX([]);
    }
  }, [selectedItem]);

  useEffect(() => {
    //get__viajes();
  }, []);

  return (
    <div className={classes.root}>
      <StatusFilter filterBy={handleFilter} />
      <DateFilter filterBy={handleDateFilter} />
      <MAP_ONLYVIEW openModalMap={openModalMap} setOpenModalMap={setOpenModalMap} empresa_cor={empresa_cor}/>
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
        loading={isLoaded}
      />
    </div>
  );
};

export default DataTable_conductor_viajes_ant;
