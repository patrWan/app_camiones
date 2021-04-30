import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Drawer} from 'antd';

const DrawerPerfilUsuario = (props) => {
  const {visible, setVisible, usuario} = props;

  const [newPass, setNewPass] = useState('');

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const changePassword = () => {
    console.log('change pass => ', newPass)
  }

  useEffect(()=>{
      console.log(usuario)
  },[])
    return (
      <>
        <Drawer
          title="MI PERFIL"
          placement={'left'}
          closable={false}
          onClose={onClose}
          visible={visible}
          key={'left'}
          width={400}
        >
            <p>Mi Perfil</p>
            
            <div class="d-grid gap-3">
                <div class="p-2 bg-light border">{usuario ?usuario.rut : ""}</div>
                <div class="p-2 bg-light border">
                   {usuario ? usuario.nombres + " " +usuario.apellidos :""}
                </div>
                
                <div class="p-2 bg-light border">{usuario ? usuario.email : ""}</div>
            </div>
        </Drawer>
      </>
    );
  
}

export default DrawerPerfilUsuario;