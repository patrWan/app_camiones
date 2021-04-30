import React, { useState, useEffect } from "react";

import { Paper } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

import { makeStyles } from "@material-ui/core/styles";

import { db } from "../../../db/firebase";

const columns = [
  { field: "email", headerName: "Correo", width: 350 },
  { field: "nombres", headerName: "Nombres", width: 200 },
  { field: "apellidos", headerName: "Apellidos", width: 200 },
  {
    /*
    field: "telefono",
    headerName: "Telefono",
    width: 170,
    */
  },
  {
    field: "id",
    headerName: "ID",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 450,
  },
];

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

export default function DataTable(props) {
  //const selectitems = []
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [size, setSize] = useState(null);
  const [edit, setEdit] = useState(false);

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

  const unsub = db.collection("usuario").onSnapshot(() => {});

  

  const get__usuario = () => {
    const url = "http://localhost:4000/api/admin/";
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Nota: es importante manejar errores aquí y no en
        // un bloque catch() para que no interceptemos errores
        // de errores reales en los componentes.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }

  /** ejecuto todas las funciones adentro al rendereziar la pagina. */
  useEffect(() => {
    /** obtengo todos los usuarios. */
    get__usuario();
    
    /** cierro la conexion. */
    return function cleanup() {
      unsub();
    };

  }, [size, edit]);

  

  const rows = items;

  return (
    <Paper className={classes.root}>
      
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        pageSize={5}
        disableMultipleSelection
        onRowSelected={(x) => {
          console.log(x.data);
          props.fun(x.data)
          props.setIsSelected(false)
          
        }}
      />
    </Paper>
  );
}
