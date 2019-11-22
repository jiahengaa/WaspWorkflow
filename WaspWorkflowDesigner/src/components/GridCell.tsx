import styles from './GridCell.scss';
import React, { CSSProperties } from 'react';
import { Col, Row, Input, Select } from 'antd';
import { InputProps } from 'antd/lib/input';
import { InputState } from 'antd/lib/input/Input';

export enum CellType {
  /**
   * 文本cell，不能作为容器
   */
  Text,
  /**
   * 容器cell，渲染其child
   */
  Group,
  /**
   * 自定义cell，渲染render
   */
  Custom,
  /**
   * 内部cell，渲染内部表格
   */
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
  span?: number = 1;
  render?: Function;
  child?: Cell[] = [];
  className?: string = '';
  style?: CSSProperties;
  iCell?: Cell;
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

  private buildGrid = (): JSX.Element => {
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
          <div className={cell.className}>
            <GridCell cell={cell.iCell as Cell} inner={true} />
          </div>
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
      cell.child.forEach((c, index) => {
        let curContent = this.buildCell(c, index);

        if (!(curContent instanceof String)) {
          content.push(curContent);
        }
      });
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
