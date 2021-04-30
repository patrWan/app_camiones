import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css";

const statusMap = {
  true: <Tag color="green">Completado</Tag>,
  false: <Tag color="orange">Programado</Tag>
};

export const StatusTag = ({ status }) => statusMap[status];