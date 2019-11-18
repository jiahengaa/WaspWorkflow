import styles from './GridCell.scss';
import React from 'react';
import { Col, Row } from 'antd';

export enum CellType {
  Text,
  Group,
  Custom,
  InnerCell,
}

export enum DataType {
  Default,
  List,
}

export class Cell {
  text?: string = '';
  dataType?: DataType = DataType.Default;
  type?: CellType = CellType.Text;
  rowStart?: number = 0;
  colStart?: number = 0;
  span?: number = 1;
  render?: Function;
  child?: Cell[] = [];
  className?: string = '';
}

export class GridCell extends React.Component<{ cell: Cell; inner?: boolean }> {
  constructor(props: { cell: Cell; inner?: boolean }) {
    super(props);
  }

  private preLevel: number = 0;
  private level: number = 0;

  private buildGrid = (): JSX.Element => {
    this.preLevel = 0;
    this.level = 0;
    return this.buildCell(this.props.cell, 0);
  };

  buildCell = (cell: Cell, index: number): JSX.Element => {
    if (cell.type === CellType.Text || cell.type === undefined) {
      return (
        <Col span={cell.span} key={index} className={cell.className}>
          <div>{cell.text}</div>
        </Col>
      );
    }

    if (cell.type === CellType.Custom) {
      if (cell.dataType === DataType.Default || cell.dataType === undefined) {
        return (
          <Col span={cell.span} key={index} className={cell.className}>
            <div>{cell.render === undefined ? '' : cell.render()}</div>
          </Col>
        );
      } else {
        return cell.render === undefined ? '' : cell.render();
      }
    }

    if (cell.type === CellType.InnerCell) {
      return (
        <Row gutter={[1, 1]} key={index}>
          <div className={cell.className}>{cell.render === undefined ? '' : cell.render()}</div>
        </Row>
      );
    }

    let childContent;
    if (cell.type === CellType.Group) {
      if (cell.child !== null && cell.child !== undefined) {
        childContent = this.buildGroup(cell);
      }
    }

    return (
      <Row gutter={[1, 1]} key={index} className={cell.className}>
        {childContent?.map(ct => {
          return ct;
        })}
      </Row>
    );
  };

  buildGroup = (cell: Cell): JSX.Element[] => {
    let content: JSX.Element[] = [];
    if (cell.child !== undefined) {
      cell.child = cell.child
        .sort((a, b) => {
          return (
            (a.rowStart === undefined ? 0 : a.rowStart) -
            (b.rowStart === undefined ? 0 : b.rowStart)
          );
        })
        .sort((c, d) => {
          return (
            (c.colStart === undefined ? 0 : c.colStart) -
            (d.colStart === undefined ? 0 : d.colStart)
          );
        });
      this.preLevel = this.level;
      cell.child.forEach((c, index) => {
        let curContent = this.buildCell(c, index);

        if (!(curContent instanceof String)) {
          if (this.preLevel === this.level) {
            if (cell.dataType === DataType.List) {
              content.push(curContent);
            } else {
              content.push(curContent);
            }
          } else {
            content.push(curContent);
          }
        }
      });

      this.level++;
    }

    return content;
  };

  render() {
    let tableStyle;

    if (this.props.inner === undefined) {
      tableStyle = styles.defaultGrid;
    }
    if (this.props.inner === true) {
      tableStyle = styles.innerGrid;
    } else {
      tableStyle = styles.defaultGrid;
    }
    return <div className={tableStyle}>{this.buildGrid()}</div>;
  }
}
