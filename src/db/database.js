import { db } from "./firebase";

//export const iniciar__sesion = (email, password) => auth.signInWithEmailAndPassword(email, password);

export const delete__user = async (uid) => {
  const res = await db.collection('usuario').doc(uid).delete();
}

