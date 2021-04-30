import { auth, db } from "./firebase";



export const usuarioActual = () => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      console.log("OBSERVADOR|||| !! SESION ACTIVA !! EMAIL --> " + user.email);
      
    } else {
      console.log("OBSERVADOR|||| !! SESION INACTIVA !! ");
    }
  });
};

export const registrar__usuario = (email, password) => {
  // -> objeto con los datos del usuario.
  //ej : rut, nombres, apellidos, telefono, email, pass
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("usuario").doc(cred.user.uid).set({
        rut: "11-1",
        nombres: "Angelica Victoria",
        apellidos: "Camilo Arriagada",
        telefono: "9 72117744",
      });
    })
    .then(() => {
      console.log("<---- registrar__usuario OK ------>");
      console.log("!! Limpiar formulario o algo");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("!!! ERROR CODE : !!!" + errorCode);
      console.log("!!! ERRORMESSAGE :  !!!" + errorMessage);
      // ..
    });
};

export const iniciar__sesion = (email, password) => auth.signInWithEmailAndPassword(email, password);

export const cerrar__sesion = () => {
  auth
    .signOut()
    .then(() => {
      console.log("!!! Sesión Cerrada");
      localStorage.removeItem('user')
      localStorage.removeItem("isAdmin")
    })
    .catch((error) => {
      console.log(error);
    });
};
