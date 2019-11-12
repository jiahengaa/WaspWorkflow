import { Arrow, Circle, Label, Layer, Stage, Tag, Text } from 'react-konva';
import { Guid } from 'guid-typescript';
import { WFNode, WFArrowLine, WFTip, NodeType, NodeState, WFCheckBox } from '@/types/WorkFlow';
import React from 'react';
import baseUrl from '@/types/ServerConfig';
import { Button, message, Col, Input, Modal, Row, Table, Tooltip, Upload } from 'antd';

import styles from './wfback.css';
import { ClickParam } from 'antd/lib/menu';
import { KonvaEventObject } from 'konva/types/Node';

export class WFBack extends React.Component<{
  sendBackCallBack: (backNodes: string[]) => void;
  currentNodeId: string;
  curWorkflowId: string;
}> {
  stageConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  };

  state: BackState = {
    nodes: [],
    nodeDescriptors: [],
    lines: [],
    backChecks: [],
  };

  constructor(props: any) {
    super(props);
  }

  btnOk = (e: any) => {
    var checkedBKNodes = this.state.backChecks.filter(p => p.checked === true);
    if (checkedBKNodes.length === 0) {
      message.warning('请选择要退回的节点');
      return;
    }

    var backNodeIds: string[] = [];
    checkedBKNodes.forEach(ele => {
      backNodeIds.push(ele.nodeId);
    });

    this.props.sendBackCallBack(backNodeIds);
  };

  btnCancle = (e: any) => {};
  bkMouseDown = (evt: KonvaEventObject<MouseEvent>): void => {
    if (evt.target.attrs.stroke === 'lightgray') {
      return;
    }
    var curCheckBox = this.state.backChecks.find(p => p.id === evt.target.attrs.id);
    if (curCheckBox !== undefined) {
      curCheckBox.checked = !curCheckBox.checked;
      curCheckBox.circleConfig.fill = curCheckBox.checked ? '#4876FF' : 'lightgray';
      this.setOtherCheckBoxState(curCheckBox.nodeId, curCheckBox.checked);

      this.setState({
        backChecks: this.state.backChecks,
      });
    }
  };

  setOtherCheckBoxState = (nodeId: string, state: boolean): void => {
    var curInLines = this.state.lines.filter(p => p.eNodeId === nodeId);
    curInLines.forEach(curInLine => {
      this.setPreCheckBoxState(curInLine, state);
    });

    var curOutLines = this.state.lines.filter(p => p.sNodeId === nodeId);
    curOutLines.forEach(curOutLine => {
      this.setPosCheckBoxState(curOutLine, state);
    });
  };

  setPreCheckBoxState = (line: WFArrowLine, state: boolean): void => {
    var preCheckBox = this.state.backChecks.find(p => p.nodeId === line.sNodeId);
    if (preCheckBox !== undefined) {
      if (state) {
        preCheckBox.disableCount--;
        if (preCheckBox.disableCount === 0) {
          preCheckBox.checked = true;
          preCheckBox.circleConfig.stroke = '#87CEFA';
        }
      } else {
        preCheckBox.checked = false;
        preCheckBox.disableCount++;
      }

      var curInLines = this.state.lines.filter(p => p.eNodeId === preCheckBox?.nodeId);
      curInLines.forEach(curInLine => {
        this.setPreCheckBoxState(curInLine, state);
      });
    } else {
      var curNode = this.state.nodes.find(
        p => p.id === line.sNodeId && p.nodeType === NodeType.Condition,
      );

      if (curNode !== undefined) {
        var inLines = this.state.lines.filter(p => p.eNodeId === curNode?.id);
        inLines.forEach(curInLine => {
          this.setPreCheckBoxState(curInLine, state);
        });
      }
    }
  };

  setPosCheckBoxState = (line: WFArrowLine, state: boolean): void => {
    let preCheckBox = this.state.backChecks.find(p => p.nodeId === line.eNodeId);
    if (preCheckBox !== undefined) {
      if (state) {
        preCheckBox.disableCount--;
        if (preCheckBox.disableCount === 0) {
          preCheckBox.circleConfig.stroke = '#87CEFA';
        }
      } else {
        preCheckBox.circleConfig.stroke = 'lightgray';
        preCheckBox.disableCount++;
      }

      let curInLines = this.state.lines.filter(p => p.sNodeId === preCheckBox?.nodeId);
      curInLines.forEach(curInLine => {
        this.setPosCheckBoxState(curInLine, state);
      });
    } else {
      let curNode = this.state.nodes.find(
        p => p.id === line.eNodeId && p.nodeType === NodeType.Condition,
      );
      if (curNode !== undefined) {
        let inLines = this.state.lines.filter(p => p.sNodeId === curNode?.id);
        inLines.forEach(curInLine => {
          this.setPosCheckBoxState(curInLine, state);
        });
      }
    }
  };

  componentDidMount() {
    if (
      this.props.curWorkflowId === Guid.EMPTY ||
      this.props.curWorkflowId === '' ||
      this.props.curWorkflowId === undefined ||
      this.props.curWorkflowId === null
    ) {
      return;
    }

    fetch(baseUrl + 'api/WFEngine/GetWFInstanceById?id=' + this.props.curWorkflowId)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.state.nodes = res.nodes;
        this.state.lines = res.lines;
        this.state.nodeDescriptors = res.nodeDescriptors;
        this.state.backChecks = [];
        this.setWFState();

        this.setState({
          nodes: [...this.state.nodes],
          lines: this.state.lines,
          nodeDescriptors: this.state.nodeDescriptors,
          backChecks: this.state.backChecks,
        });
      })
      .catch(exp => {
        console.log(exp);
      });
  }

  setWFState = () => {
    var that = this;
    this.state.nodes.forEach(node => {
      node.circleConfig.draggable = false;

      let nodeDes = new WFTip();
      nodeDes.id = Guid.create().toString();
      nodeDes.shapeId = node.id;
      nodeDes.shapeType = 'WFNode';
      nodeDes.tipType = 'desciptor';
      nodeDes.labelConfig = {
        fill: 'green',
        pointerDirection: 'down',
        pointerWidth: 0,
        pointerHeight: 0,
        lineJoin: 'round',
        shadowColor: 'green',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.5,
      };
      nodeDes.textConfig = {
        text: node.userName + '：送审',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      };

      if (node.state === NodeState.Undefine) {
        node.circleConfig.fill = '#d3d3d3';
      } else if (
        node.state === NodeState.Created ||
        node.state === NodeState.Sent ||
        node.state === NodeState.Completed
      ) {
        node.circleConfig.fill = '#d3d3d3';
        if (node.state === NodeState.Created) {
          nodeDes.textConfig.text = '开始';
        }
        if (node.id === this.props.currentNodeId) {
          nodeDes.textConfig.text = '你在这里！';
        }
        if (
          node.state === NodeState.Completed &&
          node.nodeType === NodeType.Audit &&
          node.nodeLogs.length === 0
        ) {
          node.circleConfig.fill = 'gray';
        }
        if (
          (node.nodeLogs.length === 0 && node.state === NodeState.Completed) ||
          node.nodeType === NodeType.Start
        ) {
          return;
        }
        (that.state.nodeDescriptors as WFTip[]).push(nodeDes);
      } else if (node.state === NodeState.WaitSend) {
        node.circleConfig.fill = '#d39282';
        nodeDes.textConfig.text = node.userName + ':待处理！';
        if (node.id === that.props.currentNodeId) {
          node.circleConfig.fill = 'blue';
          nodeDes.textConfig.text = '你在这里！';
        }
        (that.state.nodeDescriptors as WFTip[]).push(nodeDes);
      } else if (node.state === NodeState.Suspend) {
        node.circleConfig.fill = '#008B8B';

        (that.state.nodeDescriptors as WFTip[]).push(nodeDes);
      } else if (node.state === NodeState.BackSent) {
        node.circleConfig.fill = '#CDCD00';
      } else if (node.state === NodeState.BeBackSent) {
        node.circleConfig.fill = 'red';
        nodeDes.textConfig.text = node.userName + ':待处理！';
        if (node.id === that.props.currentNodeId) {
          nodeDes.textConfig.text = '你在这里！';
        }
        (that.state.nodeDescriptors as WFTip[]).push(nodeDes);
      } else if (node.nodeType === NodeType.End) {
        nodeDes.textConfig.text = '结束';
        node.circleConfig.fill = 'darkblack';
        (that.state.nodeDescriptors as WFTip[]).push(nodeDes);
      }
    });
    this.buildChecks();
  };

  buildChecks = () => {
    let cur = this.state.nodes.find(p => p.id === this.props.currentNodeId);
    this.createChecks(cur?.id);
  };
  createChecks = (nodeId: string | undefined) => {
    var that = this;
    var preLines = this.state.lines.filter(line => line.eNodeId === nodeId);
    if (preLines !== undefined) {
      preLines.forEach(ele => {
        let nodes = that.state.nodes.filter(node => node.id === ele.sNodeId);
        nodes.forEach(nd => {
          if (nd.nodeLogs.length > 0) {
            if (nd.nodeType === NodeType.Audit) {
              if (!that.state.backChecks.some(p => p.nodeId === nd.id)) {
                that.state.backChecks.push({
                  id: Guid.create().toString(),
                  nodeId: nd.id,
                  checked: false,
                  disableCount: 0,
                  circleConfig: {
                    radius: 10,
                    fill: 'lightgray',
                    draggable: false,
                    stroke: '#87CEFA',
                    strokeWidth: 4,
                    id: Guid.create().toString(),
                    scaleX: 1,
                    scaleY: 1,
                  },
                });
                that.createChecks(nd.id);
              }
            }
          } else if (nd.nodeType === NodeType.Condition) {
            that.createChecks(nd.id);
          }
        });
      });
    }
  };

  render() {
    return (
      <div>
        <Button type="primary" icon="save" onClick={this.btnOk}></Button>
        <Button type="primary" icon="export" onClick={this.btnCancle}></Button>

        <Stage
          width={this.stageConfig.width}
          height={this.stageConfig.height}
          draggable={this.stageConfig.draggable}
        >
          <Layer>
            {this.state.nodes.map((circle, i) => {
              return (
                <Circle
                  key={circle.id}
                  id={circle.id}
                  x={circle.circleConfig.x}
                  y={circle.circleConfig.y}
                  scaleX={circle.circleConfig.scaleX}
                  scaleY={circle.circleConfig.scaleY}
                  radius={circle.circleConfig.radius}
                  fill={circle.circleConfig.fill}
                  shadowBlur={circle.circleConfig.shadowBlur}
                  draggable={circle.circleConfig.draggable}
                  visible={circle.circleConfig.visible}
                ></Circle>
              );
            })}
            {this.state.lines.map((line, i) => {
              return (
                <Arrow
                  key={line.id}
                  id={line.id}
                  points={line.lineConfig.points}
                  stroke={line.lineConfig.stroke}
                  fill={line.lineConfig.fill}
                  strokeEnabled={line.lineConfig.strokeEnabled}
                  listening={line.lineConfig.listening}
                  draggable={line.lineConfig.draggable}
                  strokeWidth={line.lineConfig.strokeWidth}
                ></Arrow>
              );
            })}
            {this.state.nodeDescriptors.map((nd, i) => {
              return (
                <Label
                  key={nd.id}
                  x={nd.labelConfig.x}
                  y={nd.labelConfig.y}
                  visible={nd.labelConfig.visible}
                  opacity={nd.labelConfig.opacity}
                >
                  <Tag
                    fill={nd.tagConfig.fill}
                    pointerDirection={nd.tagConfig.pointerDirection}
                    pointerWidth={nd.tagConfig.pointerWidth}
                    pointerHeight={nd.tagConfig.pointerHeight}
                    lineJoin={nd.tagConfig.lineJoin}
                    shadowColor={nd.tagConfig.shadowColor}
                    shadowBlur={nd.tagConfig.shadowBlur}
                    shadowOffsetX={nd.tagConfig.shadowOffsetX}
                    shadowOffsetY={nd.tagConfig.shadowOffsetY}
                    shadowOpacity={nd.tagConfig.shadowOpacity}
                  ></Tag>
                  <Text
                    text={nd.textConfig.text}
                    fontFamily={nd.textConfig.fontFamily}
                    fontSize={nd.textConfig.fontSize}
                    padding={nd.textConfig.padding}
                    fill={nd.textConfig.fill}
                  ></Text>
                </Label>
              );
            })}
            {this.state.backChecks.map((bk, i) => {
              return (
                <Circle
                  key={bk.id}
                  id={bk.id}
                  x={bk.circleConfig.x}
                  y={bk.circleConfig.y}
                  scaleX={bk.circleConfig.scaleX}
                  scaleY={bk.circleConfig.scaleY}
                  radius={bk.circleConfig.radius}
                  fill={bk.circleConfig.fill}
                  shadowBlur={bk.circleConfig.shadowBlur}
                  draggable={bk.circleConfig.draggable}
                  visible={bk.circleConfig.visible}
                  onMouseDown={this.bkMouseDown}
                ></Circle>
              );
            })}
          </Layer>
        </Stage>
      </div>
    );
  }
}

export interface BackState {
  nodes: WFNode[];
  lines: WFArrowLine[];
  nodeDescriptors: WFTip[];
  backChecks: WFCheckBox[];
}
