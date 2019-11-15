import React from 'react';

import styles from './pipiTable.css';
import { CellX, Cell, CellType, DataType } from '../components/CellX';
import cellStyles from '../components/CellX.scss';
import {
  Button,
  Col,
  Modal,
  Input,
  Row,
  Table,
  Tooltip,
  Upload,
  Select,
  DatePicker,
  Card,
} from 'antd';

const root = {
  margin: '50px',
};

export default class PipiTable extends React.Component {
  constructor(props: any) {
    super(props);
    this.state.cell = new Cell();
    this.state.cell.type = CellType.Group;
    this.state.cell.colSpan = 24;
    this.state.cell.child = [];
  }

  state = {
    cell: new Cell(),
    dog: {
      name: 'xiaohua',
    },
    dogFoods: [
      {
        name: '骨头',
        type: '固体',
        amount: 50,
        address: '湖北',
        tel: '1507133561',
        desc: '美味狗骨头',
        bak: '每天1根，不能过量',
      },
      {
        name: '鸡肉',
        type: '固体',
        amount: 510,
        address: '湖北',
        tel: '1507133561',
        desc: '美味鸡肉',
        bak: '每天1斤，美滋滋',
      },
    ],
    foodsAmout: 0,
  };

  componentDidMount() {
    this.state.cell.child.push({
      value: '第一栏',
      type: CellType.Group,
      dataType: DataType.Normal,
      rowStart: 0,
      colStart: 0,
      colSpan: 24,
      render: () => {},
      child: [
        {
          value: '姓名',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'name',
          dataType: DataType.Normal,
          type: CellType.Custom,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {
            return <Input></Input>;
          },
          child: [],
        },
        {
          value: '部门',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'department',
          dataType: DataType.Normal,
          type: CellType.Custom,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {
            return <Select defaultValue="aaa" />;
          },
          child: [],
        },
        {
          value: '制表时间',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'createTime',
          dataType: DataType.Normal,
          type: CellType.Custom,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {
            return <DatePicker />;
          },
          child: [],
        },
      ],
    });
    this.state.cell.child.push({
      value: 'tableHead',
      dataType: DataType.Normal,
      type: CellType.Group,
      rowStart: 0,
      colStart: 1,
      colSpan: 24,
      render: () => {},
      child: [
        {
          value: '物料名称',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 2,
          render: () => {},
          child: [],
        },
        {
          value: '类型',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: '数量',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: '产地',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: '联系方式',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 2,
          render: () => {},
          child: [],
        },
        {
          value: '描述',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: '备注',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
      ],
    });
    this.state.cell.child.push({
      value: 'dataList',
      dataType: DataType.List,
      type: CellType.Custom,
      rowStart: 0,
      colStart: 2,
      colSpan: 24,
      render: () => {
        return this.state.dogFoods.map((f, index) => {
          return (
            <Row key={index}>
              <Col className={cellStyles.Cell} span={2}>
                {f.name}
              </Col>
              <Col className={cellStyles.Cell} span={4}>
                {f.type}
              </Col>
              <Col className={cellStyles.Cell} span={4}>
                {f.amount}
              </Col>
              <Col className={cellStyles.Cell} span={4}>
                {f.address}
              </Col>
              <Col className={cellStyles.Cell} span={2}>
                {f.tel}
              </Col>
              <Col className={cellStyles.Cell} span={4}>
                <Input defaultValue={f.desc}></Input>
              </Col>
              <Col className={cellStyles.Cell} span={4}>
                {f.bak}
              </Col>
            </Row>
          );
        });
      },
      child: [],
    });
    this.state.cell.child.push({
      value: '合计栏',
      dataType: DataType.Normal,
      type: CellType.Group,
      rowStart: 0,
      colStart: 2,
      colSpan: 24,
      render: () => {},
      child: [
        {
          value: '合计',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 2,
          colSpan: 6,
          render: () => {},
          child: [],
        },
        {
          value: '',
          dataType: DataType.Normal,
          type: CellType.Custom,
          rowStart: 0,
          colStart: 2,
          colSpan: 4,
          render: () => {
            return <div>{this.state.foodsAmout}</div>;
          },
          child: [],
        },
        {
          value: '',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 2,
          colSpan: 14,
          render: () => {},
          child: [],
        },
      ],
    });
    this.state.cell.child.push({
      value: '审批意见栏',
      dataType: DataType.Normal,
      type: CellType.Group,
      rowStart: 0,
      colStart: 2,
      colSpan: 24,
      render: () => {},
      child: [
        {
          value: '直属领导意见：',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 2,
          colSpan: 8,
          render: () => {},
          child: [],
        },
        {
          value: '部门领导意见：',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 2,
          colSpan: 8,
          render: () => {},
          child: [],
        },
        {
          value: '总经理意见：',
          dataType: DataType.Normal,
          type: CellType.Text,
          rowStart: 0,
          colStart: 2,
          colSpan: 8,
          render: () => {},
          child: [],
        },
      ],
    });
  }

  render() {
    return (
      <div style={root}>
        <CellX cell={this.state.cell} />
      </div>
    );
  }
}
