import React from "react";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Dropdown from "antd/lib/dropdown";
import "antd/lib/dropdown/style/css";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";

export const DateFilter = ({ filterBy, ...props }) => {
  const onClick = ({ key }) => {
    filterBy(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Enero</Menu.Item>
      <Menu.Item key="2">Febrero</Menu.Item>
      <Menu.Item key="3">Marzo</Menu.Item>
      <Menu.Item key="4">Abril</Menu.Item>
      <Menu.Item key="5">Mayo</Menu.Item>
      <Menu.Item key="6">Junio</Menu.Item>
      <Menu.Item key="7">Julio</Menu.Item>
      <Menu.Item key="8">Agosto</Menu.Item>
      <Menu.Item key="9">Septiembre</Menu.Item>
      <Menu.Item key="10">Octubre</Menu.Item>
      <Menu.Item key="11">Noviembre</Menu.Item>
      <Menu.Item key="12">Diciembre</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="0">Limpiar filtros</Menu.Item>
    </Menu>
  );

  return (
    <div {...props}>
      <Dropdown className="filter" overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          Filtrar por Mes <Icon type="down" />
        </a>
      </Dropdown>
    </div>
  );
};