import React from "react";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Dropdown from "antd/lib/dropdown";
import "antd/lib/dropdown/style/css";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

export const StatusFilter = ({ filterBy, ...props }) => {
  const onClick = ({ key }) => {
    filterBy(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Status: Completados</Menu.Item>
      <Menu.Item key="2">Status: Programados</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Limpiar filtros</Menu.Item>
    </Menu>
  );

  return (
    <div {...props}>
      <Dropdown className="filter" overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          Filtrar por Estado <Icon type="down" />
        </a>
      </Dropdown>
    </div>
  );
};