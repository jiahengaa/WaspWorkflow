import React from 'react';

import styles from './CellDesigner.css';

import { Guid } from 'guid-typescript';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableLocation,
  DropResult,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
  DragStart,
  HookProvided,
} from 'react-beautiful-dnd';
import { Row, Col } from 'antd';
import { Cell, CellType, DataType } from '@/components/GridCell';

class XCell {
  id: Guid = Guid.create();
  cell: Cell = new Cell();
  child: XCell[] = [];
}

const getTextXCell = (): XCell => {
  return {
    id: Guid.create(),
    cell: {
      text: '未定义',
      type: CellType.Text,
      span: 4,
    },
    child: [],
  };
};

const getInnerXCell = (): XCell => {
  return {
    id: Guid.create(),
    cell: {
      text: '子表设计',
      type: CellType.InnerCell,
      span: 4,
      iCell: new Cell(),
    },
    child: [],
  };
};

const getGroupXCell = (): XCell => {
  return {
    id: Guid.create(),
    cell: {
      text: '未定义集合',
      type: CellType.Group,
      dataType: DataType.Default, //横向布局为Default，纵向布局为List
      span: 8, //根据需要调整
    },
    child: [
      {
        id: Guid.create(),
        cell: {
          text: 'some',
          type: CellType.Text,
          dataType: DataType.Default, //横向布局为Default，纵向布局为List
          span: 4, //根据需要调整
        },
        child: [],
      },
    ],
  };
};

const getCustomXCell = (): XCell => {
  return {
    id: Guid.create(),
    cell: {
      text: '自定义纵向排列表格',
      type: CellType.Custom,
      dataType: DataType.List, //横向布局为Default，纵向布局为List
      span: 4,
      render: () => {
        /**自定义html */
        //todo
      },
    },
    child: [],
  };
};

const getItemStyle = (draggableStyle: any, isDragging: boolean): {} => ({
  userSelect: 'none',
  padding: 0,
  margin: 0,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): {} => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: 0,
  minHeight: 400,
  margin: '0.5px',
  position: 'relative',
  height: 'auto',
  zoom: 1,
  display: 'block',
});

export default class CellDesigner extends React.Component {
  state = {
    cell: new XCell(),
    templateCells: [getTextXCell(), getInnerXCell(), getGroupXCell(), getCustomXCell()],
  };

  constructor(props: any) {
    super(props);

    let rootCell = getGroupXCell();
    rootCell.cell.text = '某某表格';
    rootCell.cell.type = CellType.Group;
    rootCell.cell.span = 24;
    rootCell.child = [];
    this.state.cell = rootCell;

    // this.onDragEnd = this.onDragEnd.bind(this);
    // this.getList = this.getList.bind(this);
  }

  public onDragEnd = (result: DropResult, provided: HookProvided): void => {
    const { source, destination } = result;
    console.log(result);
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (destination.droppableId === 'workspace') {
      } else {
      }
    } else {
      if (destination.droppableId === 'workspace') {
        let cur = this.state.templateCells.find(p => p.id.toString() === result.draggableId);
        if (cur !== undefined) {
          // this.state.cell.
        }
      } else if (destination.droppableId === 'droppableTemplate') {
      } else {
        if (destination.droppableId === this.state.cell.id.toString()) {
          let cur = this.state.templateCells.find(p => p.id.toString() === result.draggableId);
          let nodes = this.state.cell.child;
          if (cur !== undefined) {
            nodes.push(this.createXCell(cur));
          }

          this.setState({
            ...this.state,
            cell: {
              ...this.state.cell,
              child: nodes,
            },
          });
        }
      }
    }

    //调整
  };

  createXCell = (cell: XCell): XCell => {
    let cur = JSON.parse(JSON.stringify(cell));
    cur.id = Guid.create();
    return cur;
  };

  onDragStart = (initial: DragStart, provided: HookProvided): void => {};

  buildCell = (cell: XCell, index: number): JSX.Element => {
    if (cell.cell.type === CellType.Text || cell.cell.type === undefined) {
      return (
        <Draggable key={cell.id.toString()} draggableId={cell.id.toString()} index={index}>
          {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
            <Col span={cell.cell.span} key={cell.id.toString()}>
              <div
                ref={providedDraggable.innerRef}
                {...providedDraggable.draggableProps}
                {...providedDraggable.dragHandleProps}
                style={getItemStyle(
                  providedDraggable.draggableProps.style,
                  snapshotDraggable.isDragging,
                )}
              >
                {cell.cell.text}
              </div>
              {providedDraggable.placeholder}
            </Col>
          )}
        </Draggable>
      );
    }

    if (cell.cell.type === CellType.Custom) {
      return (
        <Draggable key={cell.id.toString()} draggableId={cell.id.toString()} index={index}>
          {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
            <Row gutter={[1, 1]} key={cell.id.toString()}>
              <Col span={cell.cell.span} key={cell.id.toString()}>
                <div
                  ref={providedDraggable.innerRef}
                  {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  style={getItemStyle(
                    providedDraggable.draggableProps.style,
                    snapshotDraggable.isDragging,
                  )}
                >
                  {/* {cell.cell.render === undefined ? '' : cell.cell.render()} */}
                  {cell.cell.text}
                </div>
                {providedDraggable.placeholder}
              </Col>
            </Row>
          )}
        </Draggable>
      );
    }

    if (cell.cell.type === CellType.InnerCell) {
      return (
        <Draggable key={cell.id.toString()} draggableId={cell.id.toString()} index={index}>
          {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
            <Col span={cell.cell.span}>
              <Row gutter={[1, 1]} key={cell.id.toString()}>
                <div
                  ref={providedDraggable.innerRef}
                  {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  style={getItemStyle(
                    providedDraggable.draggableProps.style,
                    snapshotDraggable.isDragging,
                  )}
                >
                  内部表格，后期可以考虑根据cell.cell的定义构建内容
                </div>
                {providedDraggable.placeholder}
              </Row>
            </Col>
          )}
        </Draggable>
      );
    }

    if (cell.cell.type === CellType.Group) {
      if (cell.cell.dataType === DataType.List) {
        return (
          <Draggable key={cell.id.toString()} draggableId={cell.id.toString()} index={index}>
            {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
              <Col span={cell.cell.span} key={cell.id.toString()}>
                <div
                  ref={providedDraggable.innerRef}
                  {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  style={getItemStyle(
                    providedDraggable.draggableProps.style,
                    snapshotDraggable.isDragging,
                  )}
                >
                  <Droppable key={cell.id.toString()} droppableId={cell.id.toString()}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                      <Row gutter={[1, 1]} key={cell.id.toString()}>
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {this.buildGroup(cell)}
                        </div>
                        {provided.placeholder}
                      </Row>
                    )}
                  </Droppable>
                </div>
                {providedDraggable.placeholder}
              </Col>
            )}
          </Draggable>
        );
      } else {
        return (
          <Draggable key={cell.id.toString()} draggableId={cell.id.toString()} index={index}>
            {(providedDraggable: DraggableProvided, snapshotDraggable: DraggableStateSnapshot) => (
              <Col span={cell.cell.span} key={cell.id.toString()}>
                <div
                  ref={providedDraggable.innerRef}
                  {...providedDraggable.draggableProps}
                  {...providedDraggable.dragHandleProps}
                  style={getItemStyle(
                    providedDraggable.draggableProps.style,
                    snapshotDraggable.isDragging,
                  )}
                >
                  {cell.child.length === 0 ? (
                    <Droppable key={cell.id.toString()} droppableId={cell.id.toString()}>
                      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <Row
                          gutter={[1, 1]}
                          key={cell.id.toString()}
                          style={{ border: '1px dashed brown' }}
                        >
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            <Col span={cell.cell.span}>{cell.cell.text}</Col>
                          </div>
                          {provided.placeholder}
                        </Row>
                      )}
                    </Droppable>
                  ) : (
                    <Droppable key={cell.id.toString()} droppableId={cell.id.toString()}>
                      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                        <Row gutter={[1, 1]} key={cell.id.toString()}>
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={getListStyle(snapshot.isDraggingOver)}
                          >
                            {this.buildGroup(cell)}
                          </div>
                          {provided.placeholder}
                        </Row>
                      )}
                    </Droppable>
                  )}
                </div>
                {providedDraggable.placeholder}
              </Col>
            )}
          </Draggable>
        );
      }
    }

    return <div></div>;
  };

  buildGroup = (cell: XCell): JSX.Element[] => {
    let content: JSX.Element[] = [];
    if (cell.child !== undefined) {
      cell.child.forEach((c, index) => {
        content.push(this.buildCell(c, index));
      });
    }
    return content;
  };

  public render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
        <Row gutter={[1, 1]}>
          <Col span={4}>
            <Droppable droppableId="droppableTemplate">
              {(
                providedDroppable2: DroppableProvided,
                snapshotDroppable2: DroppableStateSnapshot,
              ) => (
                <div
                  ref={providedDroppable2.innerRef}
                  style={getListStyle(snapshotDroppable2.isDraggingOver)}
                >
                  {this.state.templateCells.map((item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(
                        providedDraggable2: DraggableProvided,
                        snapshotDraggable2: DraggableStateSnapshot,
                      ) => (
                        <div>
                          <div
                            ref={providedDraggable2.innerRef}
                            {...providedDraggable2.draggableProps}
                            {...providedDraggable2.dragHandleProps}
                            style={getItemStyle(
                              providedDraggable2.draggableProps.style,
                              snapshotDraggable2.isDragging,
                            )}
                          >
                            <div>{item.cell.text}</div>
                          </div>
                          {providedDraggable2.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {providedDroppable2.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
          <Col span={20}>
            <Droppable droppableId="workspace">
              {(
                providedDroppable2: DroppableProvided,
                snapshotDroppable2: DroppableStateSnapshot,
              ) => (
                <div
                  ref={providedDroppable2.innerRef}
                  style={getListStyle(snapshotDroppable2.isDraggingOver)}
                >
                  {this.buildCell(this.state.cell, 0)}
                  {providedDroppable2.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
        </Row>
      </DragDropContext>
    );
  }
}
