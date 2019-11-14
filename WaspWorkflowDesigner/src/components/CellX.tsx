import styles from './CellX.scss';
import React from 'react';
import { Button, Col, Modal, Input, Row, Table, Tooltip, Upload } from 'antd';

export enum CellType {
  Text,
  Group,
  Custom,
}

export class Cell {
  value: string = '';
  type: CellType = CellType.Text;
  rowStart: number = 0;
  colStart: number = 0;
  colSpan: number = 1;
  render: Function = () => {};
  child: Cell[] = [];
}

export class CellX extends React.Component<{ cell: Cell }, { data: any }> {
  constructor(props: { cell: Cell }) {
    super(props);
  }
  updateBillTable = (): JSX.Element => {
    return this.buildCell(this.props.cell, 0);
  };

  buildCell = (cell: Cell, index: number): JSX.Element => {
    let content;
    if (cell.type === CellType.Text) {
      content = (
        <Col className={styles.Cell} span={cell.colSpan} key={index}>
          {cell.value.toString()}
        </Col>
      );
      return content;
    }

    if (cell.type === CellType.Custom) {
      return (
        <Col className={styles.Cell} span={cell.colSpan} key={index}>
          {cell.render()}
        </Col>
      );
    }

    let childContent;
    if (cell.type === CellType.Group) {
      if (cell.child !== null && cell.child !== undefined) {
        childContent = this.buildGroup(cell);
      }
    }
    return (
      <Col span={cell.colSpan} key={index}>
        {childContent?.map(ct => {
          return ct;
        })}
      </Col>
    );
  };

  buildGroup = (cell: Cell): JSX.Element[] => {
    let content: JSX.Element[] = [];
    cell.child = cell.child
      .sort((a, b) => {
        return a.rowStart - b.rowStart;
      })
      .sort((c, d) => {
        return c.colStart - d.colStart;
      });

    cell.child.forEach((c, index) => {
      let curContent = this.buildCell(c, index);

      if (!(curContent instanceof String)) {
        content.push(curContent as JSX.Element);
      }
    });

    return content;
  };

  render() {
    return this.updateBillTable();
  }
}
