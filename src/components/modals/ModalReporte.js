import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import * as dayjs from "dayjs";

/** imports de pdf */
import ReactPDF from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

import { Table } from "antd";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  viewer: {
    height: "100%",
  },
}));

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottom: 1,
    marginHorizontal: 10,
    padding: 10,
  },
  row: {
    marginHorizontal: 10,
    borderBottomWidth: 1,
    display: "flex",
    flexDirection: "row",
  },

  cell: {
    width: "20%",
    height: "100%",
    //backgroundColor : "skyblue",
    display: "flex",
    justifyContent: "center",
    padding: 3,
    borderLeft: "1px #ccc solid",
  },

  cell_2: {
    width: "10%",
    height: "100%",
    //backgroundColor : "skyblue",
    display: "flex",
    justifyContent: "center",
    padding: 3,
    borderRight: "1px #ccc solid",
    borderLeft: "1px #ccc solid",
  },

  head_cell: {
    width: "20%",
    height: "100%",
    //backgroundColor : "skyblue",
    display: "flex",
    justifyContent: "center",
    padding: 3,
  },

  text: {
    fontSize: 8,
  },
  head_text: {
    fontSize: 10,
    fontWeight: "600",
  },

  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  section_top : {
    width: "100%",
    display : "flex",
    flexDirection : "row",
    justifyContent : "center"
  },
  text_description: {
    fontSize: 12,
  },
  image: {
    height: 110,
    width: 110,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();

  const { open, setOpen, data } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.section_top}> 
            <Image style={styles.image} src="/logo_v6.jpg" />
          </View>
          <View style={styles.section_top}> 
          <Text style={styles.text_description}>
            {dayjs().locale("es").format("DD MMMM YYYY")}
          </Text>
          </View>

          
        </View>

        <View style={styles.header}>
          <View style={styles.head_cell}>
            <Text style={styles.head_text}>Fecha</Text>
          </View>
          <View style={styles.head_cell}>
            <Text style={styles.head_text}>Nombre</Text>
          </View>
          <View style={styles.head_cell}>
            <Text style={styles.head_text}>Camion</Text>
          </View>
          <View style={styles.head_cell}>
            <Text style={styles.head_text}>Empresa</Text>
          </View>
          <View style={styles.head_cell}>
            <Text style={styles.head_text}>Dirección</Text>
          </View>
        </View>
        {data.map((x) => {
          return (
            <View style={styles.row} key={x.fecha}>
              <View style={styles.cell}>
                <Text style={styles.text}>{x.fecha}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{x.conductor}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{x.camion}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{x.direccion}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.text}>{x.destino}</Text>
              </View>
              <View style={styles.cell_2}>
                <Text style={styles.text}>
                  {x.estado ? "Completado" : "Programado"}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Reporte
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Guardar
            </Button>
          </Toolbar>
        </AppBar>
        <PDFViewer className={classes.viewer}>
          <MyDocument data={data} />
        </PDFViewer>
      </Dialog>
    </div>
  );
}
