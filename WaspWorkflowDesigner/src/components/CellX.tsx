import styles from './CellX.scss';
import React from 'react';
import { Button, Col, Modal, Input, Row, Table, Tooltip, Upload } from 'antd';

export enum CellType {
  Text,
  Group,
  Custom,
}

export enum DataType{
  Normal,
  List
}

export class Cell {
  value: string = '';
  dataType:DataType=DataType.Normal;
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

  preLevel: number = 0;
  level: number = 0;

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
      if(cell.dataType === DataType.Normal){
        return (
          <Col className={styles.Cell} span={cell.colSpan} key={index}>
            {cell.render()}
          </Col>
        );
      }else{
        return (
          cell.render()
        )
      }
      
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

    this.preLevel = this.level;
    cell.child.forEach((c, index) => {
      let curContent = this.buildCell(c, index);

      if (!(curContent instanceof String)) {
        if (this.preLevel === this.level) {
          if(cell.dataType === DataType.List){
            content.push(<Row key={index}>{curContent as JSX.Element}</Row>);  
          }
          else{
            content.push(curContent as JSX.Element);
          }
          
        } else {
          content.push(<Row key={index}>{curContent as JSX.Element}</Row>);
        }
      }
    });

    this.level++;

    return content;
  };

  render() {
    return this.updateBillTable();
  }
}
