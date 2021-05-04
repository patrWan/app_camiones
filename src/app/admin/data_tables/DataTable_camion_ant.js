import React, { useState, useEffect } from "react";
import { Table, Typography, Button } from "antd";
import { db } from "../../../db/firebase";

import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "antd";
import * as dayjs from "dayjs";

var locale_de = require("dayjs/locale/es");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& table": {},
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
    "& .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr > th ": {
      background: "#282640",
      color: "white",
    },
    boxShadow: "4px 4px 10px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#ff",
    borderRadius: "16px 16px 0 0",
  },
}));

const columns = [
  {
    title: "Modelo",
    dataIndex: "modelo",
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.modelo.localeCompare(b.modelo),
    defaultSortOrder: "ascend",
  },
  {
    title: "Marca",
    dataIndex: "marca",
    key: "marca",
  },
  {
    title: "Patente",
    dataIndex: "patente",
    key: "patente",
  },
];

const DataTable_camion_ant = (props) => {
  const {
    setIsSelected,
    setSelectedItem,
    selectedItem,
    mensaje_accion,

    selectRows,
    setSelectRows,
    openSlideMenu,
  } = props;

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

  const [data, setData] = useState([]);

  const [rowClassname, setRowClassname] = useState("");

  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };

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

  const [x, setX] = useState([]);

  const rowSelection = {
    selectedRowKeys: selectRows,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectRows(selectedRowKeys);
      openSlideMenu();
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

  const get__camion = async () => {
    const camionRef = db.collection("camion");
    const snapshot = await camionRef.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    const camiones = [];
    snapshot.forEach((doc) => {
      var c = {
        id: doc.id,
        modelo: doc.data().modelo,
        marca: doc.data().marca,
        patente: doc.data().patente,
        disponible: doc.data().disponible ? "Disponible" : "En uso",
      };
      camiones.push(c);
    });
    setTimeout(function () {
      setData(camiones);
      setIsLoaded(false);
    }, 1000);
  };

  useEffect(() => {
    get__camion();
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
      <Table
        rowKey="id"
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
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

export default DataTable_camion_ant;
