import styles from './GridCell.scss';
import React, { CSSProperties } from 'react';
import { Col, Row, Input, Select } from 'antd';
import { InputProps } from 'antd/lib/input';
import { InputState } from 'antd/lib/input/Input';

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
  style?: CSSProperties;
}

// export class CellInput extends React.Component {
//   render() {
//     return (
//       <Input
//         style={{ borderRadius: '0px', border: 'none', boxShadow: 'none', padding: '0px' }}
//       ></Input>
//     );
//   }
// }

// export class CellSelect extends React.Component {
//   render() {
//     return (
//       <Select
//         defaultValue="adddaaaaaaa"
//         style={{ borderRadius: '0px', border: 'none', boxShadow: 'none', padding: '0px' }}
//       ></Select>
//     );
//   }
// }

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
        <Col span={cell.span} key={index}>
          <div className={cell.className} style={cell.style}>
            {cell.text}
          </div>
        </Col>
      );
    }

    if (cell.type === CellType.Custom) {
      if (cell.dataType === DataType.Default || cell.dataType === undefined) {
        return (
          <Col span={cell.span} key={index}>
            <div className={cell.className} style={cell.style}>
              {cell.render === undefined ? '' : cell.render()}
            </div>
          </Col>
        );
      } else {
        return (
          <Row gutter={[1, 1]} key={index}>
            <Col span={cell.span} key={index}>
              <div className={styles.specialDiv} style={cell.style}>
                {cell.render === undefined ? '' : cell.render()}
              </div>
            </Col>
          </Row>
        );
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

    if (cell.dataType === DataType.Default || cell.dataType === undefined) {
      return (
        <Row gutter={[1, 1]} key={index} className={cell.className} style={cell.style}>
          {childContent?.map(ct => {
            return ct;
          })}
        </Row>
      );
    } else {
      return (
        <Col span={cell.span} key={index} style={{ marginBottom: '-1px' }}>
          <div className={styles.specialDiv} style={cell.style}>
            {childContent?.map(ct => {
              return ct;
            })}
          </div>
        </Col>
      );
    }
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
