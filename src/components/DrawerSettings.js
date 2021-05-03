import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Drawer} from 'antd';

import {auth} from "./../db/firebase";

const DrawerSettings = (props) => {
  const {visible, setVisible} = props;

  const [disabled, setDisabled] = useState(true);
  const [actualPass, setActualPass] = useState('');
  const [newPass, setNewPass] = useState('');


  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onChangeNewPass = async (e) => {
    console.log(e.target.value);

    await setNewPass(e.target.value);

    if(newPass.length > 6){
      setDisabled(false);
    }else{
      setDisabled(true);
    }

    
  }
  
  const changePassword = () => {
    console.log('actual pass => ', actualPass);
    console.log('new pass => ', newPass);

    var user = auth.currentUser;
    var newPassword = newPass;
    console.log(user);

    user.updatePassword(newPassword).then(function() {
      console.log("ok");
    }).catch(function(error) {
      console.log("error => ",error);
    });
    
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
          <p>Contraseña actual:</p>
          <div class="input-group mb-3 mx-auto">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input type="text" class="form-control" placeholder="Contraseña actual" aria-label="Contraseña" aria-describedby="basic-addon1" onKeyUp={(e) => setActualPass(e.target.value)}/>
            
          </div>
          <p>Contraseña nueva:</p>
          <div class="input-group mb-3 mx-auto">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input type="text" class="form-control" placeholder="Contraseña nueva" aria-label="Contraseña" aria-describedby="basic-addon1" onKeyUp={(e) => onChangeNewPass(e)} minLength="6"/>
            
          </div>
          <p>{disabled ? "La contraseña debe ser mayor de 8 caracteres." : "Contraseña Valida :)"}</p>
            <button class="btn btn-danger mt-3" onClick={changePassword} disabled={disabled}>Cambiar Contraseña</button>
        </Drawer>
      </>
    );
  
}

export default DrawerSettings;