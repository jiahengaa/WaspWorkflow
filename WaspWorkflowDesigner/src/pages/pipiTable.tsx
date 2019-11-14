import React from 'react';

import styles from './pipiTable.css';
import { CellX, Cell, CellType } from '../components/CellX';
import { Button, Col, Modal, Input, Row, Table, Tooltip, Upload, Select, DatePicker } from 'antd';

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
  };

  componentDidMount() {
    this.state.cell.child.push({
      value: 'firsline',
      type: CellType.Group,
      rowStart: 0,
      colStart: 0,
      colSpan: 24,
      render: () => {},
      child: [
        {
          value: '姓名',
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'name',
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
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'department',
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
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'createTime',
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
      value: 'ljh2',
      type: CellType.Group,
      rowStart: 0,
      colStart: 1,
      colSpan: 4,
      render: () => {},
      child: [
        {
          value: 'ljh2',
          type: CellType.Text,
          rowStart: 0,
          colStart: 1,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'jjj',
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
      value: 'ljh3',
      type: CellType.Text,
      rowStart: 0,
      colStart: 2,
      colSpan: 4,
      render: () => {},
      child: [],
    });
    this.state.cell.child.push({
      value: 'ljh3',
      type: CellType.Custom,
      rowStart: 0,
      colStart: 2,
      colSpan: 4,
      render: () => {
        return (
          <Button
            onClick={e => {
              this.setState({
                dog: {
                  name: 'xiaoming',
                },
              });
            }}
          >
            {this.state.dog.name}
          </Button>
        );
      },
      child: [],
    });

    this.state.cell.child.push({
      value: '圈圈',
      type: CellType.Group,
      rowStart: 0,
      colStart: 4,
      colSpan: 4,
      render: () => {},
      child: [
        {
          value: 'abc',
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
        {
          value: 'def',
          type: CellType.Text,
          rowStart: 0,
          colStart: 0,
          colSpan: 4,
          render: () => {},
          child: [],
        },
      ],
    });
  }

  render() {
    return <CellX cell={this.state.cell} />;
  }
}
