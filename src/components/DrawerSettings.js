import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Drawer} from 'antd';

const DrawerSettings = (props) => {
  const {visible, setVisible} = props;

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

    return (
      <>
        <Drawer
          title="Administrador"
          placement={'left'}
          closable={false}
          onClose={onClose}
          visible={visible}
          key={'left'}
        >
          <p>Cambiar contraseña...</p>
          <div class="input-group mb-3 mx-auto">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input type="text" class="form-control" placeholder="contraseña" aria-label="Contraseña" aria-describedby="basic-addon1" onChange={(e) => setNewPass(e.target.value)}/>
            <button class="btn btn-danger mt-3" onClick={changePassword}>Cambiar Contraseña</button>
          </div>
        </Drawer>
      </>
    );
  
}

export default DrawerSettings;