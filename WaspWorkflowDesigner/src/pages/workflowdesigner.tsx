import { Button, Col, Input, Modal, Row, Table, Tooltip, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { Guid } from 'guid-typescript';
import Konva from 'konva';
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import { Arrow, Circle, Label, Layer, Stage, Tag, Text } from 'react-konva';
import WFTransformer from '../components/wftransformer';
import Iconfont from '../iconfont/Iconfont';
import {
  AnchorType,
  NodeType,
  WFAnchorPoint,
  WFArrowLine,
  WFLineVM,
  WFNode,
  WFNodeVM,
  WFTip,
  WFToolTip,
  Workflow,
  WorkflowVM,
} from '../types/WorkFlow';
import styles from './workflowdesigner.css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/webpack-resolver';
import baseUrl from '../types/ServerConfig';

const { TextArea } = Input;

class WorkFlowDesigner extends Component {
  state = {
    color: 'green',
    width: 500,
    height: 500,
    curSelectedNode: new WFNode(),
    curSelectedArrowLine: new WFArrowLine(),
    previewLayer: undefined,
    wf: new Workflow(),
    stageMenuContext: {
      left: '100px',
      top: '100px',
      width: '200px',
      active: false,
    },
    nodeMenuContext: {
      left: '100px',
      top: '100px',
      width: '100px',
      active: false,
    },
    lineMenuContext: {
      left: '100px',
      top: '100px',
      width: '70px',
      active: false,
    },
    themeConfig: {
      startNodeFillColor: '#15AE67',
      startNodeShadowColor: '#15AE67',
      startNodeShadowBlur: 10,
      startRadius: 30,
      startNodeDesShadowColor: '#15AE67',

      auditNodeFillColor: '#C8E6E2',
      auditNodeShadowColor: '#AFDDE0',
      auditNodeShadowBlur: 10,
      auditRadius: 45,
      auditNodeDesShadowColor: '#4E8CA8',

      condNodeFillColor: '#8499A1',
      condNodeShadowColor: '#8499A1',
      condNodeShadowBlur: 20,
      condRadius: 35,
      condNodeDesShadowColor: '#8499A1',

      endNodeFillColor: '#374169',
      endNodeShadowColor: '#374169',
      endNodeShadowBlur: 15,
      endRadius: 30,
      endNodeDesShadowColor: '#374169',
    },
    workflowVM: new WorkflowVM(),
    workflowVMs: [],
    editLineDialogVisible: false,
    editNodeDialogVisible: false,
    wfSaveDialogVisible: false,
  };

  stageConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: WorkflowVM) => (
        <a
          onClick={(e: any) => {
            this.wfClick(record);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    },
  ];

  componentDidMount = () => {
    fetch(baseUrl + '/WorkFlowTemplate')
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            workflowVMs: result,
          });
        },
        // 注意：需要在此处处理错误
        // 而不是使用 catch() 去捕获错误
        // 因为使用 catch 去捕获异常会掩盖掉组件本身可能产生的 bug
        error => {
          // this.setState({
          //   isLoaded: true,
          //   error,
          // });
        },
      );
  };

  handleClick = () => {
    let wfNode = {
      id: Guid.create().toString(),
      userId: Guid.EMPTY,
      userName: '',
      desc: '',
      nodeType: NodeType.Audit,
      circleConfig: {
        radius: 150,
        x: 500,
        y: 600,
        fill: Konva.Util.getRandomColor(),
        shadowBlur: 5,
        visible: true,
        draggable: true,
      },
    };
    var nextNodes = [...this.state.wf.nodes];
    nextNodes.push(wfNode);
    this.setState({
      color: Konva.Util.getRandomColor(),
    });

    this.setState({
      wf: {
        ...this.state.wf,
        nodes: nextNodes,
      },
    });
  };
  exportWF = (e: any) => {
    this.download('wf.json', JSON.stringify(this.state.wf));

    this.setState({
      stageMenuContext: {
        ...this.state.stageMenuContext,
        active: true,
      },
    });
  };
  download = (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  addStartNode = (e: any) => {
    if (this.state.wf.nodes.every(p => p.nodeType !== NodeType.Start)) {
      let nodeDescriptor: WFTip = {
        id: Guid.create().toString(),
        shapeId: '',
        shapeType: 'WFNode',
        tipType: 'desciptor',
        labelConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y - this.state.themeConfig.startRadius,
          visible: true,
          opacity: 0.75,
        },
        tagConfig: {
          fill: this.state.themeConfig.startNodeFillColor,
          pointerDirection: 'down',
          pointerWidth: 0,
          pointerHeight: 0,
          lineJoin: 'round',
          shadowColor: this.state.themeConfig.startNodeFillColor,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowOpacity: 0,
        },
        textConfig: {
          text: '开始',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'white',
        },
      };

      let tooltip: WFTip = {
        id: Guid.create().toString(),
        shapeId: '',
        shapeType: 'WFNode',
        tipType: 'tip',
        labelConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y - this.state.themeConfig.startRadius - 30,
          visible: true,
          opacity: 0.75,
        },
        tagConfig: {
          fill: 'black',
          pointerDirection: 'down',
          pointerWidth: 10,
          pointerHeight: 10,
          lineJoin: 'round',
          shadowColor: 'black',
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowOpacity: 0.5,
        },
        textConfig: {
          text: '流程开始节点',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'white',
        },
      };
      let sNode: WFNode = {
        id: Guid.create().toString(),
        nodeType: NodeType.Start,
        userId: '',
        userName: '',
        desc: '开始节点',
        circleConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y,
          shadowBlur: this.state.themeConfig.startNodeShadowBlur,
          radius: this.state.themeConfig.startRadius,
          fill: this.state.themeConfig.startNodeFillColor,
          shadowColor: this.state.themeConfig.startNodeShadowColor,

          draggable: true,
          scaleX: 1,
          scaleY: 1,
        },
      };

      nodeDescriptor.shapeId = sNode.id;
      tooltip.shapeId = sNode.id;

      let nodeDescriptors = [...this.state.wf.nodeDescriptors];
      let tooltips = [...this.state.wf.toolTips];
      let nodes = [...this.state.wf.nodes];

      nodeDescriptors.push(nodeDescriptor);
      tooltips.push(tooltip);
      nodes.push(sNode);

      this.setState({
        wf: {
          ...this.state.wf,
          nodes: nodes,
          toolTips: tooltips,
          nodeDescriptors: nodeDescriptors,
        },
        stageMenuContext: {
          ...this.state.stageMenuContext,
          active: false,
        },
      });
    }
  };
  addAuditNode = (e: any) => {
    let nodeDescriptor: WFTip = {
      id: Guid.create().toString(),
      shapeId: '',
      shapeType: 'WFNode',
      tipType: 'desciptor',
      labelConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y - this.state.themeConfig.auditRadius,
        visible: true,
        opacity: 0.75,
      },
      tagConfig: {
        fill: this.state.themeConfig.auditNodeDesShadowColor,
        pointerDirection: 'down',
        pointerWidth: 0,
        pointerHeight: 0,
        lineJoin: 'round',
        shadowColor: this.state.themeConfig.auditNodeDesShadowColor,
        shadowBlur: 5,
      },
      textConfig: {
        text: '人员未定义',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      },
    };

    let tooltip: WFTip = {
      id: Guid.create().toString(),
      shapeId: '',
      shapeType: 'WFNode',
      tipType: 'tip',
      labelConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y - this.state.themeConfig.auditRadius - 30,
        visible: false,
        opacity: 0.75,
      },
      tagConfig: {
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        shadowOpacity: 0.5,
      },
      textConfig: {
        text: '审批节点',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      },
    };
    let aNode: WFNode = {
      id: Guid.create().toString(),
      nodeType: NodeType.Audit,
      userId: '',
      userName: '',
      desc: '审批节点',
      circleConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y,
        shadowBlur: this.state.themeConfig.auditNodeShadowBlur,
        shadowColor: this.state.themeConfig.auditNodeShadowColor,
        radius: this.state.themeConfig.auditRadius,
        fill: this.state.themeConfig.auditNodeFillColor,
        draggable: true,
        scaleX: 1,
        scaleY: 1,
      },
    };

    nodeDescriptor.shapeId = aNode.id;
    tooltip.shapeId = aNode.id;

    let nodeDescriptors = [...this.state.wf.nodeDescriptors];
    let toolTips = [...this.state.wf.toolTips];
    let nodes = [...this.state.wf.nodes];

    nodeDescriptors.push(nodeDescriptor);
    toolTips.push(tooltip);
    nodes.push(aNode);

    this.setState({
      wf: {
        ...this.state.wf,
        nodes: nodes,
        toolTips: toolTips,
        nodeDescriptors: nodeDescriptors,
      },
      stageMenuContext: {
        ...this.state.stageMenuContext,
        active: false,
      },
    });
  };
  addConditionNode = (e: any) => {
    let nodeDescriptor: WFTip = {
      id: Guid.create().toString(),
      shapeId: '',
      shapeType: 'WFNode',
      tipType: 'desciptor',
      labelConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y - this.state.themeConfig.condRadius,
        visible: false,
        opacity: 0.75,
      },
      tagConfig: {
        fill: this.state.themeConfig.condNodeFillColor,
        pointerDirection: 'down',
        pointerWidth: 0,
        pointerHeight: 0,
        lineJoin: 'round',
        shadowColor: this.state.themeConfig.condNodeFillColor,
        shadowBlur: 5,
      },
      textConfig: {
        text: '条件流转节点',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      },
    };

    let tooltip: WFTip = {
      id: Guid.create().toString(),
      shapeId: '',
      shapeType: 'WFNode',
      tipType: 'tip',
      labelConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y - this.state.themeConfig.condRadius - 30,
        visible: false,
        opacity: 0.75,
      },
      tagConfig: {
        fill: this.state.themeConfig.condNodeFillColor,
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: this.state.themeConfig.condNodeFillColor,
      },
      textConfig: {
        text: '条件流转节点',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      },
    };
    let cNode: WFNode = {
      id: Guid.create().toString(),
      nodeType: NodeType.Condition,
      userId: '',
      userName: '',
      desc: '开始节点',
      circleConfig: {
        id: Guid.create().toString(),
        x: this.state.wf.mousePoint.x,
        y: this.state.wf.mousePoint.y,
        shadowBlur: this.state.themeConfig.condNodeShadowBlur,
        radius: this.state.themeConfig.condRadius,
        fill: this.state.themeConfig.condNodeFillColor,
        draggable: true,
        scaleX: 1,
        scaleY: 1,
      },
    };

    nodeDescriptor.shapeId = cNode.id;
    tooltip.shapeId = cNode.id;

    let nodeDescriptors = [...this.state.wf.nodeDescriptors];
    let tooltips = [...this.state.wf.toolTips];
    let nodes = [...this.state.wf.nodes];

    nodeDescriptors.push(nodeDescriptor);
    tooltips.push(tooltip);
    nodes.push(cNode);

    this.setState({
      wf: {
        ...this.state.wf,
        nodes: nodes,
        toolTips: tooltips,
        nodeDescriptors: nodeDescriptors,
      },
      stageMenuContext: {
        ...this.state.stageMenuContext,
        active: false,
      },
    });
  };
  addEndNode = (e: any) => {
    if (this.state.wf.nodes.every(p => p.nodeType !== NodeType.End)) {
      let nodeDescriptor: WFTip = {
        id: Guid.create().toString(),
        shapeId: '',
        shapeType: 'WFNode',
        tipType: 'desciptor',
        labelConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y - this.state.themeConfig.endRadius,
          visible: true,
          opacity: 0.75,
        },
        tagConfig: {
          fill: this.state.themeConfig.endNodeFillColor,
          pointerDirection: 'down',
          pointerWidth: 0,
          pointerHeight: 0,
          lineJoin: 'round',
          shadowColor: this.state.themeConfig.endNodeFillColor,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowOpacity: 0,
        },
        textConfig: {
          text: '结束',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'white',
        },
      };

      let tooltip: WFTip = {
        id: Guid.create().toString(),
        shapeId: '',
        shapeType: 'WFNode',
        tipType: 'tip',
        labelConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y - this.state.themeConfig.endRadius - 30,
          visible: true,
          opacity: 0.75,
        },
        tagConfig: {
          fill: this.state.themeConfig.endNodeFillColor,
          pointerDirection: 'down',
          pointerWidth: 10,
          pointerHeight: 10,
          lineJoin: 'round',
          shadowColor: this.state.themeConfig.endNodeShadowColor,
          shadowBlur: this.state.themeConfig.endNodeShadowBlur,
        },
        textConfig: {
          text: '流程结束节点',
          fontFamily: 'Calibri',
          fontSize: 18,
          padding: 5,
          fill: 'white',
        },
      };
      let eNode: WFNode = {
        id: Guid.create().toString(),
        nodeType: NodeType.End,
        userId: '',
        userName: '',
        desc: '结束节点',
        circleConfig: {
          id: Guid.create().toString(),
          x: this.state.wf.mousePoint.x,
          y: this.state.wf.mousePoint.y,
          shadowBlur: this.state.themeConfig.endNodeShadowBlur,
          radius: this.state.themeConfig.endRadius,
          fill: this.state.themeConfig.endNodeShadowColor,
          draggable: true,
          scaleX: 1,
          scaleY: 1,
        },
      };

      nodeDescriptor.shapeId = eNode.id;
      tooltip.shapeId = eNode.id;

      let nodeDescriptors = [...this.state.wf.nodeDescriptors];
      let tooltips = [...this.state.wf.toolTips];
      let nodes = [...this.state.wf.nodes];

      nodeDescriptors.push(nodeDescriptor);
      tooltips.push(tooltip);
      nodes.push(eNode);

      this.setState({
        wf: {
          ...this.state.wf,
          nodes: nodes,
          toolTips: tooltips,
          nodeDescriptors: nodeDescriptors,
        },
        stageMenuContext: {
          ...this.state.stageMenuContext,
          active: false,
        },
      });
    }
  };

  deleteNode = (e: any) => {
    var that = this;
    for (var i = 0; i < this.state.wf.lines.length; i++) {
      if (this.state.wf.lines[i].sNodeId === that.state.curSelectedNode.id) {
        var nodeId = Guid.create().toString();
        var anchorNode: WFAnchorPoint = {
          id: nodeId,
          nodeId: '',
          pairId: this.state.wf.lines[i].eNodeId,
          anchorType: AnchorType.Start,
          circleConfig: {
            x: this.state.wf.lines[i].lineConfig.points[0],
            y: this.state.wf.lines[i].lineConfig.points[1],
            radius: 16,
            fill: 'red',
            draggable: true,
            strokeEnabled: false,
            scaleX: 1,
            scaleY: 1,
            id: Guid.create().toString(),
          },
        };
        this.state.wf.lines[i].sNodeId = anchorNode.id;
        this.state.wf.anchors.push(anchorNode);
        continue;
      }

      if (this.state.wf.lines[i].eNodeId === this.state.curSelectedNode.id) {
        var nodeId = Guid.create().toString();
        var anchorNode: WFAnchorPoint = {
          id: nodeId,
          nodeId: '',
          pairId: this.state.wf.lines[i].sNodeId,
          anchorType: AnchorType.End,
          circleConfig: {
            x: this.state.wf.lines[i].lineConfig.points[2],
            y: this.state.wf.lines[i].lineConfig.points[3],
            radius: 16,
            fill: 'red',
            draggable: true,
            strokeEnabled: false,
            scaleX: 1,
            scaleY: 1,
            id: Guid.create().toString(),
          },
        };
        this.state.wf.lines[i].eNodeId = anchorNode.id;
        this.state.wf.anchors.push(anchorNode);
        continue;
      }
    }

    this.state.wf.nodes.splice(
      this.state.wf.nodes.findIndex(p => p.id === this.state.curSelectedNode.id),
      1,
    );
    this.state.wf.toolTips.splice(
      this.state.wf.toolTips.findIndex(p => p.shapeId === this.state.curSelectedNode.id),
      1,
    );
    this.state.wf.nodeDescriptors.splice(
      this.state.wf.nodeDescriptors.findIndex(p => p.shapeId === this.state.curSelectedNode.id),
      1,
    );

    const curNodes = [...this.state.wf.nodes];
    const curToolTips = [...this.state.wf.toolTips];
    const curNodeDesc = [...this.state.wf.nodeDescriptors];

    this.setState({
      wf: {
        ...this.state.wf,
        nodes: curNodes,
        toolTips: curToolTips,
        nodeDescriptors: curNodeDesc,
      },
    });
  };

  addLine = (e: any) => {
    if (this.state.curSelectedNode.nodeType === NodeType.End) {
      console.log('结束节点不能作为连线起点');
      return;
    }

    var eNodeId = Guid.create().toString();
    var lineId = Guid.create().toString();
    var eAnchor: WFAnchorPoint = {
      id: eNodeId,
      nodeId: '',
      pairId: this.state.curSelectedNode.id,
      anchorType: AnchorType.End,
      circleConfig: {
        x:
          (this.state.curSelectedNode.circleConfig.x as number) +
          (this.state.curSelectedNode.circleConfig.radius as number) * 2,
        y: this.state.curSelectedNode.circleConfig.y as number,
        shadowBlur: 10,
        radius: 16,
        fill: 'red',
        draggable: true,
        strokeEnabled: false,
        scaleX: 1,
        scaleY: 1,
        id: Guid.create().toString(),
      },
    };

    var points = this.getConnectorPoints(
      this.state.curSelectedNode.circleConfig,
      eAnchor.circleConfig,
    );

    var toolTip: WFTip = {
      id: Guid.create().toString(),
      shapeId: lineId,
      shapeType: 'WFArrowLine',
      tipType: 'tip',
      labelConfig: {
        id: Guid.create().toString(),
        x: (points[0] + points[2]) / 2,
        y: (points[1] + points[3]) / 2,
        visible: false,
        opacity: 0.75,
      },
      tagConfig: {
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.5,
      },
      textConfig: {
        text: '未定义条件，自动流转到下一节点',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white',
      },
    };

    var lineCodeNum = 1;
    if (
      this.state.wf.lines === undefined ||
      this.state.wf.lines == null ||
      this.state.wf.lines.length === 0
    ) {
      lineCodeNum = 1;
    } else {
      this.state.wf.lines.forEach(line => {
        if (line.nodeCode >= lineCodeNum) {
          lineCodeNum = line.nodeCode + 1;
        }
      });
    }

    var line: WFArrowLine = {
      id: lineId,
      sNodeId: this.state.curSelectedNode.id,
      eNodeId: eNodeId,
      nodeCode: lineCodeNum,
      desc: '',
      conditionFuncStr: '',
      lineConfig: {
        points: points,
        stroke: '#B0E0E6',
        fill: '#B0E0E6',
        strokeEnabled: true,
        listening: true,
        draggable: false,
        strokeWidth: 5,
      },
    };

    const tooltips = [...this.state.wf.toolTips];
    const lines = [...this.state.wf.lines];
    const anchors = [...this.state.wf.anchors];

    tooltips.push(toolTip);
    lines.push(line);
    anchors.push(eAnchor);
    this.state.nodeMenuContext.active = false;

    this.setState({
      nodeMenuContext: {
        ...this.state.nodeMenuContext,
        active: false,
      },
      stageMenuContext: {
        ...this.state.stageMenuContext,
        active: false,
      },
      lineMenuContext: {
        ...this.state.lineMenuContext,
        active: false,
      },
      wf: {
        ...this.state.wf,
        toolTips: tooltips,
        lines: lines,
        anchors: anchors,
      },
    });
  };

  preventContextMenu = (e: any) => {
    e.preventDefault();
  };
  anchorDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.currentTarget.moveToTop();

    var curAnchor = this.state.wf.anchors.find(p => p.id === e.target.attrs.id) as WFAnchorPoint;

    if (curAnchor !== undefined) {
      this.updateArrow(curAnchor);
      curAnchor.circleConfig.x = e.target.attrs.x;
      curAnchor.circleConfig.y = e.target.attrs.y;
      const toolTips = [...this.state.wf.toolTips];
      const lines = [...this.state.wf.lines];
      const anchors = [...this.state.wf.anchors];
      this.setState({
        wf: {
          ...this.state.wf,
          toolTips: toolTips,
          anchors: anchors,
          lines: lines,
        },
      });
    }
  };
  anchorDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.currentTarget.moveToTop();
    var curAnchor = this.state.wf.anchors.find(p => p.id === e.target.attrs.id) as WFAnchorPoint;

    if (curAnchor !== undefined) {
      curAnchor.circleConfig.x = e.target._lastPos.x;
      curAnchor.circleConfig.y = e.target._lastPos.y;

      this.updateArrow(curAnchor);
      const toolTips = [...this.state.wf.toolTips];
      const lines = [...this.state.wf.lines];
      const anchors = [...this.state.wf.anchors];
      this.setState({
        wf: {
          ...this.state.wf,
          toolTips: toolTips,
          anchors: anchors,
          lines: lines,
        },
      });
    }
  };
  anchorMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    var that = this;
    var curAnchor = this.state.wf.anchors.find(p => p.id === e.target.attrs.id) as WFAnchorPoint;

    if (curAnchor !== undefined) {
      if (
        this.state.wf.lines.some(
          p => p.sNodeId === curAnchor.pairId && p.eNodeId === curAnchor.nodeId,
        )
      ) {
        return;
      }

      if (curAnchor.nodeId !== '' && curAnchor.circleConfig.fill === 'green') {
        this.state.wf.lines.forEach(ele => {
          if (ele.eNodeId === curAnchor.id) {
            var sNode: any;
            sNode = that.state.wf.nodes.find(p => p.id === ele.sNodeId);
            if (sNode === undefined) {
              sNode = this.state.wf.anchors.find(p => p.id === ele.sNodeId);
            }
            ele.eNodeId = curAnchor.nodeId;
            var eNode = this.state.wf.nodes.find(p => p.id === ele.eNodeId);
            ele.lineConfig.points = that.getConnectorPoints(
              sNode.circleConfig,
              (eNode as WFNode).circleConfig,
            );
          } else if (ele.sNodeId === curAnchor.id) {
            var enode: any;
            enode = that.state.wf.nodes.find(p => p.id === ele.eNodeId);
            if (enode === undefined) {
              enode = that.state.wf.anchors.find(p => p.id === ele.eNodeId);
            }
            ele.sNodeId = curAnchor.nodeId;
            var snode = that.state.wf.nodes.find(p => p.id === ele.sNodeId);
            ele.lineConfig.points = that.getConnectorPoints(
              (snode as WFNode).circleConfig,
              enode.circleConfig,
            );
          }
        });
        this.state.wf.anchors.splice(
          this.state.wf.anchors.findIndex(p => p.id === curAnchor.id),
          1,
        );
      }
    }
  };
  anchorMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {};
  arrowClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button == 2) {
      var arrowLine = this.state.wf.lines.find(p => p.id === e.target.attrs.id);
      this.setState({
        curSelectedArrowLine: arrowLine,
        lineMenuContext: {
          ...this.state.lineMenuContext,
          left: e.evt.pageX + 'px',
          top: e.evt.pageY + 'px',
          active: true,
        },
        stageMenuContext: {
          ...this.state.stageMenuContext,
          active: false,
        },
        nodeMenuContext: {
          ...this.state.nodeMenuContext,
          active: false,
        },
      });
    } else {
      var arrowLine = this.state.wf.lines.find(p => p.id === e.target.attrs.id);
      var tip = this.state.wf.toolTips.find(p => p.shapeId === e.target.attrs.id);
      if (tip !== undefined && arrowLine !== undefined) {
        let curTip = tip as WFTip;
        let curLine = arrowLine as WFArrowLine;
        curTip.labelConfig.visible = !curTip.labelConfig.visible;
        curTip.textConfig.text =
          curLine.nodeCode + (curLine.desc === '' ? '' : ': ' + curLine.desc);
      }
      const toolTips = [...this.state.wf.toolTips];
      this.setState({
        curSelectedArrowLine: arrowLine,
        wf: {
          ...this.state.wf,
          toolTips: toolTips,
        },
      });
    }
  };
  deleteLine = (e: any) => {
    this.state.wf.lines.splice(
      this.state.wf.lines.findIndex(p => p.id === this.state.curSelectedArrowLine.id),
      1,
    );
    this.state.wf.toolTips.splice(
      this.state.wf.toolTips.findIndex(p => p.shapeId === this.state.curSelectedArrowLine.id),
      1,
    );
    var enodeIndex = this.state.wf.anchors.findIndex(
      p => p.id === this.state.curSelectedArrowLine.eNodeId,
    );
    if (enodeIndex >= 0) {
      this.state.wf.anchors.splice(enodeIndex, 1);
    }
    var snodeIndex = this.state.wf.anchors.findIndex(
      p => p.id === this.state.curSelectedArrowLine.sNodeId,
    );
    if (snodeIndex >= 0) {
      this.state.wf.anchors.splice(snodeIndex, 1);
    }
    const toolTips = [...this.state.wf.toolTips];
    const lines = [...this.state.wf.lines];
    const anchors = [...this.state.wf.anchors];
    this.setState({
      lineMenuContext: {
        ...this.state.lineMenuContext,
        active: false,
      },
      stageMenuContext: {
        ...this.state.stageMenuContext,
        active: false,
      },
      nodeMenuContext: {
        ...this.state.nodeMenuContext,
        active: false,
      },
      wf: {
        ...this.state.wf,
        toolTips: toolTips,
        lines: lines,
        anchors: anchors,
      },
    });
  };
  nodeMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.currentTarget.moveToBottom();
    if (e.evt.button === 2) {
      this.setState({
        curSelectedNode: this.state.wf.nodes.find(p => p.id === e.target.attrs.id),
        nodeMenuContext: {
          ...this.state.nodeMenuContext,
          left: e.evt.pageX + 'px',
          top: e.evt.pageY + 'px',
          active: true,
        },
        stageMenuContext: {
          ...this.state.stageMenuContext,
          active: false,
        },
        lineMenuContext: {
          ...this.state.lineMenuContext,
          active: false,
        },
      });
    }
  };
  nodeMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
    let tip = this.state.wf.toolTips.find(p => p.shapeId === e.target.attrs.id);
    if (tip !== undefined) {
      tip.labelConfig.visible = true;
      const toolTips = [...this.state.wf.toolTips];
      this.setState({
        wf: {
          ...this.state.wf,
          toolTips: toolTips,
        },
      });
    }
  };
  nodeMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
    let tip = this.state.wf.toolTips.find(p => p.shapeId === e.target.attrs.id);
    if (tip !== undefined) {
      tip.labelConfig.visible = false;
      this.setState({
        wf: {
          ...this.state.wf,
          toolTips: [...this.state.wf.toolTips],
        },
      });
    }
  };
  nodeDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    this.updateWFNodeData(e);

    this.setState({
      wf: this.state.wf,
    });
  };
  nodeDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    this.updateWFNodeData(e);
    this.setState({
      wf: this.state.wf,
    });
  };

  transformEvent = (e: Konva.KonvaEventObject<DragEvent>) => {
    let curTransform = e.currentTarget as Konva.Transformer;

    let curNode = this.state.wf.nodes.find(p => p.id === curTransform._node.attrs.id);
    if (curNode !== undefined) {
      let node = curNode as WFNode;
      node.circleConfig.x = curTransform._node.attrs.x;
      node.circleConfig.y = curTransform._node.attrs.y;
      node.circleConfig.scaleX = curTransform._node.attrs.scaleX;
      node.circleConfig.scaleY = curTransform._node.attrs.scaleY;

      var tipNode = this.state.wf.toolTips.find(p => p.shapeId === node.id);
      var discriptor = this.state.wf.nodeDescriptors.find(p => p.shapeId === node.id);
      if (tipNode !== undefined) {
        if (curNode !== undefined) {
          tipNode.labelConfig.x = node.circleConfig.x;
          tipNode.labelConfig.y =
            (node.circleConfig.y as number) -
            node.circleConfig.radius * (node.circleConfig.scaleY as number);
        }
      }

      if (discriptor !== undefined) {
        if (curNode !== undefined) {
          discriptor.labelConfig.x = node.circleConfig.x;
          discriptor.labelConfig.y = node.circleConfig.y;
        }
      }

      this.state.wf.lines.forEach(ele => {
        var sNode: any;
        var eNode: any;
        sNode = this.state.wf.nodes.find(p => p.id === ele.sNodeId);
        eNode = this.state.wf.nodes.find(p => p.id === ele.eNodeId);
        if (eNode === undefined) {
          eNode = this.state.wf.anchors.find(p => p.id == ele.eNodeId);
        }
        if (sNode === undefined) {
          sNode = this.state.wf.anchors.find(p => p.id == ele.sNodeId);
        }
        if (sNode !== undefined && eNode !== undefined) {
          ele.lineConfig.points = this.getConnectorPoints(sNode.circleConfig, eNode.circleConfig);
        }

        var tipLine = this.state.wf.toolTips.find(p => p.shapeId === ele.id);
        if (tipLine !== undefined) {
          tipLine.labelConfig.x = (ele.lineConfig.points[0] + ele.lineConfig.points[2]) / 2;
          tipLine.labelConfig.y = (ele.lineConfig.points[1] + ele.lineConfig.points[3]) / 2;
        }
      });

      this.setState({
        wf: {
          ...this.state.wf,
          nodes: [...this.state.wf.nodes],
          toolTips: [...this.state.wf.toolTips],
          nodeDescriptors: [...this.state.wf.nodeDescriptors],
          lines: [...this.state.wf.lines],
        },
      });
    }
  };

  updateWFNodeData = (e: Konva.KonvaEventObject<DragEvent>) => {
    var curNode = this.state.wf.nodes.find(p => p.id === e.target.attrs.id);
    var tipNode = this.state.wf.toolTips.find(p => p.shapeId === (curNode as WFNode).id);
    var discriptor = this.state.wf.nodeDescriptors.find(p => p.shapeId === (curNode as WFNode).id);

    if (tipNode !== undefined) {
      if (curNode !== undefined) {
        tipNode.labelConfig.x =
          (tipNode.labelConfig.x as number) +
          (e.target.attrs.x - (curNode.circleConfig.x as number));
        tipNode.labelConfig.y =
          (tipNode.labelConfig.y as number) +
          (e.target.attrs.y - (curNode.circleConfig.y as number));
      }
    } else {
      console.log('no tips');
    }

    if (discriptor !== undefined) {
      if (curNode !== undefined) {
        discriptor.labelConfig.x =
          (discriptor.labelConfig.x as number) +
          (e.target.attrs.x - (curNode.circleConfig.x as number));
        discriptor.labelConfig.y =
          (discriptor.labelConfig.y as number) +
          (e.target.attrs.y - (curNode.circleConfig.y as number));
      }
    } else {
      console.log('no discriptor');
    }

    if (curNode !== undefined) {
      let wfNode = curNode as WFNode;
      wfNode.circleConfig.x = e.target.attrs.x;
      wfNode.circleConfig.y = e.target.attrs.y;
      wfNode.circleConfig.scaleX = e.target.attrs.scaleX;
      wfNode.circleConfig.scaleY = e.target.attrs.scaleY;

      for (var i = 0; i < this.state.wf.anchors.length; i++) {
        if (this.state.wf.anchors[i].nodeId === e.currentTarget.attrs.id) {
          this.state.wf.anchors[i].circleConfig.x =
            (this.state.wf.anchors[i].circleConfig.x as number) + e.evt.movementX;
          this.state.wf.anchors[i].circleConfig.y =
            (this.state.wf.anchors[i].circleConfig.y as number) + e.evt.movementY;
          this.updateArrow(this.state.wf.anchors[i]);
        }
      }

      this.state.wf.lines.forEach(ele => {
        var sNode: any;
        var eNode: any;
        sNode = this.state.wf.nodes.find(p => p.id === ele.sNodeId);
        eNode = this.state.wf.nodes.find(p => p.id === ele.eNodeId);
        if (eNode === undefined) {
          eNode = this.state.wf.anchors.find(p => p.id == ele.eNodeId);
        }
        if (sNode === undefined) {
          sNode = this.state.wf.anchors.find(p => p.id == ele.sNodeId);
        }
        if (sNode !== undefined && eNode !== undefined) {
          ele.lineConfig.points = this.getConnectorPoints(sNode.circleConfig, eNode.circleConfig);
        }

        var tipLine = this.state.wf.toolTips.find(p => p.shapeId === ele.id);
        if (tipLine !== undefined) {
          tipLine.labelConfig.x = (ele.lineConfig.points[0] + ele.lineConfig.points[2]) / 2;
          tipLine.labelConfig.y = (ele.lineConfig.points[1] + ele.lineConfig.points[3]) / 2;
        }
      });
    }
  };
  updateArrow = (anchor: WFAnchorPoint): void => {
    var that = this;
    this.state.wf.lines.forEach(ele => {
      if (ele.eNodeId === anchor.id) {
        var snode = that.state.wf.nodes.find(p => p.id === ele.sNodeId);
        if (snode !== undefined) {
          ele.lineConfig.points = that.getConnectorPoints(snode.circleConfig, anchor.circleConfig);
        }
      }
      if (ele.sNodeId === anchor.id) {
        var enode = that.state.wf.nodes.find(p => p.id === ele.eNodeId);
        if (enode !== undefined) {
          ele.lineConfig.points = that.getConnectorPoints(anchor.circleConfig, enode.circleConfig);
        }
      }

      var sNode = that.state.wf.anchors.find(p => p.id === ele.sNodeId);
      var eNode = that.state.wf.anchors.find(p => p.id === ele.eNodeId);

      if (sNode !== undefined) {
        if (sNode.pairId === anchor.id || sNode.id === anchor.pairId) {
          ele.lineConfig.points = that.getConnectorPoints(sNode.circleConfig, anchor.circleConfig);
          if (sNode.pairId === anchor.id) {
            anchor.pairId = sNode.id;
          }
          if (sNode.id === anchor.pairId) {
            sNode.pairId = anchor.id;
          }
        }
      }

      if (eNode !== undefined) {
        if (eNode.pairId === anchor.id || eNode.id === anchor.pairId) {
          ele.lineConfig.points = that.getConnectorPoints(anchor.circleConfig, eNode.circleConfig);
          if (eNode.pairId === anchor.id) {
            anchor.pairId = eNode.id;
          }
          if (eNode.id === anchor.pairId) {
            eNode.pairId = anchor.id;
          }
        }
      }

      var tipLine = that.state.wf.toolTips.find(p => p.shapeId === ele.id);
      if (tipLine !== undefined) {
        tipLine.labelConfig.x = (ele.lineConfig.points[0] + ele.lineConfig.points[2]) / 2;
        tipLine.labelConfig.y = (ele.lineConfig.points[1] + ele.lineConfig.points[3]) / 2;
      }
    });

    var count = 0;
    var wfNodeId = '';
    var curNode = this.state.wf.anchors.find(p => p.id === anchor.id);
    if (curNode !== undefined) {
      let wfNode = curNode as WFAnchorPoint;
      wfNode.circleConfig.x = anchor.circleConfig.x;
      wfNode.circleConfig.y = anchor.circleConfig.y;
      wfNode.circleConfig.radius = anchor.circleConfig.radius;
      for (var m = 0; m < this.state.wf.nodes.length; m++) {
        var curWFNode = (this.refs.layer as any).findOne('#' + this.state.wf.nodes[m].id);
        if (curWFNode !== undefined) {
          if (this.judgeCircleContain(anchor.circleConfig, this.state.wf.nodes[m].circleConfig)) {
            count++;
            wfNodeId = this.state.wf.nodes[m].id;
          }
        }
      }

      if (count == 1) {
        if (curNode.pairId !== wfNodeId) {
          if (
            this.state.wf.lines.some(p => p.sNodeId === anchor.pairId && p.eNodeId === wfNodeId)
          ) {
            return;
          }
          curNode.nodeId = wfNodeId;
          curNode.circleConfig.fill = 'green';
        }
      } else {
        curNode.nodeId = '';
        curNode.circleConfig.fill = 'red';
      }
    }
  };
  getConnectorPoints = (from: Konva.CircleConfig, to: Konva.CircleConfig): number[] => {
    const dx = (to.x as number) - (from.x as number);
    const dy = (to.y as number) - (from.y as number);
    let angle = Math.atan2(-dy, dx);

    const radius = (from.radius + 10) * (from.scaleX as number);
    const toRadius = (to.radius + 10) * (to.scaleX as number);
    return [
      (from.x as number) + -radius * Math.cos(angle + Math.PI),
      (from.y as number) + radius * Math.sin(angle + Math.PI),
      (to.x as number) + -toRadius * Math.cos(angle),
      (to.y as number) + toRadius * Math.sin(angle),
    ];
  };
  judgeCircleContain = (circle1: Konva.CircleConfig, circle2: Konva.CircleConfig): boolean => {
    var distance = Math.sqrt(
      Math.pow((circle1.x as number) - (circle2.x as number), 2) +
        Math.pow((circle1.y as number) - (circle2.y as number), 2),
    );

    var rDis = circle1.radius + circle2.radius;
    if (distance < rDis) {
      return true;
    }
    return false;
  };
  stageContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
  };
  stageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {};

  stageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      e.evt.cancelBubble = true;
      if (e.target.nodeType === 'Stage') {
        this.setState({
          stageMenuContext: {
            ...this.state.stageMenuContext,
            left: e.evt.pageX + 'px',
            top: e.evt.pageY + 'px',
            active: true,
          },
          lineMenuContext: {
            ...this.state.lineMenuContext,
            active: false,
          },
          nodeMenuContext: {
            ...this.state.nodeMenuContext,
            active: false,
          },
          wf: {
            ...this.state.wf,
            mousePoint: {
              x:
                e.evt.pageX -
                (e.target._lastPos === null ? 0 : e.target._lastPos.x) -
                e.currentTarget.attrs.container.offsetLeft,
              y:
                e.evt.pageY -
                (e.target._lastPos === null ? 0 : e.target._lastPos.y) -
                e.currentTarget.attrs.container.offsetTop,
            },
          },
        });
      }
    } else {
      this.setState({
        stageMenuContext: {
          ...this.state.stageMenuContext,
          active: false,
        },
        lineMenuContext: {
          ...this.state.lineMenuContext,
          active: false,
        },
        nodeMenuContext: {
          ...this.state.nodeMenuContext,
          active: false,
        },
      });
    }

    if (e.target === e.currentTarget) {
      let transformer = this.refs.transformer as WFTransformer;
      transformer.selectedShapeId = '';
      transformer.componentDidMount();
      return;
    }

    if (e.target.getParent() === null || e.target.getParent() === undefined) {
      return;
    }

    if (e.target.getParent().className === 'Transformer') {
      return;
    }

    const node = this.state.wf.nodes.find(p => p.id === e.target.attrs.id);

    if (node !== undefined) {
      let transformer = this.refs.transformer as WFTransformer;
      transformer.selectedShapeId = node.id;
      transformer.componentDidMount();
    }
  };

  beforeWFUpload = (file: RcFile, FileList: RcFile[]): boolean => {
    var that = this;
    var content = '';
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e: any) {
        content = e.target.result;
      };
    })(file);

    reader.onloadend = function() {
      var wfJson = content;
      var wfObj = JSON.parse(wfJson);
      if (wfObj.constructor === Object) {
        that.state.wf = wfObj;
        that.setState({
          wf: that.state.wf,
        });
      } else {
        console.log('导入工作流配置错误');
      }
    };
    reader.readAsText(file);
    return false;
  };
  editNodeOk = (e: any) => {
    let curNode = this.state.wf.nodes.find(p => p.id === this.state.curSelectedNode.id);
    if (curNode !== undefined) {
      let node = curNode as WFNode;
      node.userId = this.state.curSelectedNode.userId;
      node.userName = this.state.curSelectedNode.userName;
      node.desc = this.state.curSelectedNode.desc;
    }

    let curTip = this.state.wf.toolTips.find(p => p.shapeId === this.state.curSelectedNode.id);

    if (curTip !== undefined) {
      let tip = curTip as WFTip;
      tip.textConfig.text = this.state.curSelectedNode.desc;
    }

    let nodeDes = this.state.wf.nodeDescriptors.find(
      p => p.shapeId === this.state.curSelectedNode.id,
    );
    if (nodeDes !== undefined) {
      let nodeDs = nodeDes as WFTip;
      nodeDs.textConfig.text = this.state.curSelectedNode.userName;
      nodeDs.labelConfig.visible = nodeDs.textConfig.text !== '';
    }

    this.setState({
      editNodeDialogVisible: false,
      wf: {
        ...this.state.wf,
        nodes: [...this.state.wf.nodes],
      },
    });
  };
  editLineOk = (e: any) => {
    let curLine = this.state.wf.lines.find(p => p.id === this.state.curSelectedArrowLine.id);
    if (curLine !== undefined) {
      let line = curLine as WFArrowLine;
      line.conditionFuncStr = this.state.curSelectedArrowLine.conditionFuncStr;
      line.desc = this.state.curSelectedArrowLine.desc;
    }

    let curTip = this.state.wf.toolTips.find(p => p.shapeId === this.state.curSelectedArrowLine.id);

    if (curTip !== undefined) {
      let tip = curTip as WFTip;
      tip.textConfig.text =
        this.state.curSelectedArrowLine.nodeCode + ': ' + this.state.curSelectedArrowLine.desc;
    }

    this.setState({
      editLineDialogVisible: false,
      wf: {
        ...this.state.wf,
        lines: [...this.state.wf.lines],
        toolTips: [...this.state.wf.toolTips],
      },
    });
  };
  editNodeCancel = (e: any) => {
    this.setState({
      editNodeDialogVisible: false,
    });
  };
  editLineCancel = (e: any) => {
    this.setState({
      editLineDialogVisible: false,
    });
  };
  editLine = (e: any) => {
    this.setState({
      editLineDialogVisible: true,
    });
  };

  editNode = (e: any) => {
    this.setState({
      editNodeDialogVisible: true,
    });
  };

  aceChange = (value: string, event?: any): void => {
    this.state.curSelectedArrowLine.conditionFuncStr = value;
  };
  lineDesChange = (e: any): void => {
    this.setState({
      curSelectedArrowLine: {
        ...this.state.curSelectedArrowLine,
        desc: e.target.value,
      },
    });
  };
  nodeDescChange = (e: any): void => {
    this.setState({
      curSelectedNode: {
        ...this.state.curSelectedNode,
        desc: e.target.value,
      },
    });
  };
  userIdChange = (e: any): void => {
    this.setState({
      curSelectedNode: {
        ...this.state.curSelectedNode,
        userId: e.target.value,
      },
    });
  };
  userNameChange = (e: any): void => {
    this.setState({
      curSelectedNode: {
        ...this.state.curSelectedNode,
        userName: e.target.value,
      },
    });
  };
  wfSave = (e: any): void => {
    this.setState({
      wfSaveDialogVisible: true,
    });
  };
  wfvmNameChange = (e: any): void => {
    this.state.workflowVM.name = e.target.value;
  };
  wfvmDescChange = (e: any): void => {
    this.state.workflowVM.desc = e.target.value;
  };
  saveWFOk = (e: any): void => {
    this.state.workflowVM.nodes = [];
    this.state.workflowVM.lines = [];
    this.state.workflowVM.toolTips = [];
    this.state.wf.nodes.forEach(node => {
      let nodeVM = new WFNodeVM();
      nodeVM.nodeDefine.nodeType = node.nodeType;
      nodeVM.nodeDefine.userId = node.userId;
      nodeVM.nodeDefine.userName = node.userName;
      nodeVM.nodeDefine.id = node.id;
      nodeVM.nodeDefine.desc = node.desc;
      nodeVM.nodeDefine.circleConfigJson = JSON.stringify(node.circleConfig);
      this.state.workflowVM.nodes.push(nodeVM);
    });

    this.state.wf.lines.forEach(line => {
      let lineVM = new WFLineVM();
      lineVM.lineId = line.id;
      lineVM.lineDefine.id = line.id;
      lineVM.lineDefine.conditionFuncStr = line.conditionFuncStr;
      lineVM.lineDefine.desc = line.desc;
      lineVM.lineDefine.eNodeId = line.eNodeId;
      lineVM.lineDefine.nodeCode = line.nodeCode;
      lineVM.lineDefine.sNodeId = line.sNodeId;
      lineVM.lineDefine.lineConfigJson = JSON.stringify(line.lineConfig);
      this.state.workflowVM.lines.push(lineVM);
    });

    this.state.wf.nodeDescriptors.forEach(nd => {
      let tip = new WFToolTip();
      tip.tipId = nd.id;
      tip.tipDef = JSON.stringify(nd);
      this.state.workflowVM.toolTips.push(tip);
    });

    this.state.wf.toolTips.forEach(tp => {
      let tip = new WFToolTip();
      tip.tipId = tp.id;
      tip.tipDef = JSON.stringify(tp);
      this.state.workflowVM.toolTips.push(tip);
    });

    fetch(baseUrl + '/WorkFlowTemplate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(this.state.workflowVM),
    })
      .then(res => {
        console.log(res);
      })
      .catch(exp => {
        console.log(exp);
      });

    this.setState({
      wfSaveDialogVisible: false,
    });
  };
  saveWFCancel = (e: any): void => {
    this.setState({
      wfSaveDialogVisible: false,
    });
  };
  wfClick = (wf: WorkflowVM): void => {
    let nodes: Array<WFNode> = [];
    let lines: Array<WFArrowLine> = [];
    let nodeDes: Array<WFTip> = [];
    let tips: Array<WFTip> = [];
    if (wf.nodes !== undefined && wf.nodes !== null) {
      wf.nodes.forEach(node => {
        let cur = new WFNode();
        cur.id = node.nodeDefine.id;
        cur.nodeType = node.nodeDefine.nodeType;
        cur.desc = node.nodeDefine.desc;
        cur.userId = node.nodeDefine.userId;
        cur.userName = node.nodeDefine.userName;
        cur.circleConfig = JSON.parse(node.nodeDefine.circleConfigJson);

        nodes.push(cur);
      });
    }
    if (wf.lines !== undefined && wf.lines !== null) {
      wf.lines.forEach(line => {
        let cur = new WFArrowLine();
        cur.id = line.lineDefine.id;
        cur.conditionFuncStr = line.lineDefine.conditionFuncStr;
        cur.desc = line.lineDefine.desc;
        cur.eNodeId = line.lineDefine.eNodeId;
        cur.lineConfig = JSON.parse(line.lineDefine.lineConfigJson);
        cur.nodeCode = line.lineDefine.nodeCode;
        cur.sNodeId = line.lineDefine.sNodeId;

        lines.push(cur);
      });
    }
    if (wf.toolTips !== undefined && wf.toolTips !== null) {
      wf.toolTips.forEach(tp => {
        let tip: WFTip = JSON.parse(tp.tipDef);
        if (tip.tipType === 'desciptor') {
          nodeDes.push(tip);
        }
        if (tip.tipType === 'tip') {
          tips.push(tip);
        }
      });

      console.log(tips);
    }

    this.setState({
      wf: {
        ...this.state.wf,
        nodes: nodes,
        lines: lines,
        nodeDescriptors: nodeDes,
        toolTips: tips,
      },
    });

    this.state.workflowVM = wf;
  };

  render() {
    let stageMenu;
    let nodeMenu;
    let lineMenu;
    if (this.state.stageMenuContext.active === true) {
      stageMenu = (
        <div
          style={{
            left: this.state.stageMenuContext.left,
            top: this.state.stageMenuContext.top,
            width: this.state.stageMenuContext.width,
          }}
          className={styles.boxCard}
          onContextMenu={this.preventContextMenu}
        >
          <Tooltip title="新增开始节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.addStartNode}>
              <Iconfont name="startnode" />
            </Button>
          </Tooltip>
          <Tooltip title="新增审批节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.addAuditNode}>
              <Iconfont name="addnode" />
            </Button>
          </Tooltip>
          <Tooltip title="新增条件流转节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.addConditionNode}>
              <Iconfont name="condnode" />
            </Button>
          </Tooltip>
          <Tooltip title="新增结束节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.addEndNode}>
              <Iconfont name="endnode" />
            </Button>
          </Tooltip>

          <Tooltip title="导出流程">
            <Button type="link" ghost={true} shape="circle" onClick={this.exportWF}>
              <Iconfont name="export" />
            </Button>
          </Tooltip>

          <Upload multiple={false} beforeUpload={this.beforeWFUpload}>
            <Tooltip title="导入流程">
              <Button type="link" ghost={true} shape="circle">
                <Iconfont name="import" />
              </Button>
            </Tooltip>
          </Upload>
        </div>
      );
    } else {
      stageMenu = '';
    }
    if (this.state.nodeMenuContext.active === true) {
      nodeMenu = (
        <div
          style={{
            left: this.state.nodeMenuContext.left,
            top: this.state.nodeMenuContext.top,
            width: this.state.nodeMenuContext.width,
          }}
          className={styles.boxCard}
          onContextMenu={this.preventContextMenu}
        >
          <Tooltip title="新增连线">
            <Button type="link" ghost={true} shape="circle" onClick={this.addLine}>
              <Iconfont name="addline2" />
            </Button>
          </Tooltip>

          <Tooltip title="编辑节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.editNode}>
              <Iconfont name="editnode" />
            </Button>
          </Tooltip>
          <Tooltip title="删除节点">
            <Button type="link" ghost={true} shape="circle" onClick={this.deleteNode}>
              <Iconfont name="delete" />
            </Button>
          </Tooltip>
        </div>
      );
    } else {
      nodeMenu = '';
    }
    if (this.state.lineMenuContext.active === true) {
      lineMenu = (
        <div
          style={{
            left: this.state.lineMenuContext.left,
            top: this.state.lineMenuContext.top,
            width: this.state.lineMenuContext.width,
          }}
          className={styles.boxCard}
          onContextMenu={this.preventContextMenu}
        >
          <Row>
            <Tooltip title="编辑条件">
              <Button type="link" ghost={true} shape="circle" onClick={this.editLine}>
                <Iconfont name="editline" />
              </Button>
            </Tooltip>
            <Tooltip title="删除线">
              <Button type="link" ghost={true} shape="circle" onClick={this.deleteLine}>
                <Iconfont name="delete" />
              </Button>
            </Tooltip>
          </Row>
        </div>
      );
    } else {
      lineMenu = '';
    }

    return (
      <div>
        <Table columns={this.columns} dataSource={this.state.workflowVMs} rowKey="id" />
        <Button type="primary" icon="save" onClick={this.wfSave}></Button>
        <Stage
          width={this.stageConfig.width}
          height={this.stageConfig.height}
          draggable={this.stageConfig.draggable}
          onMouseDown={this.stageMouseDown}
          onMouseMove={this.stageMouseMove}
          onContextMenu={this.stageContextMenu}
          ref="stage"
        >
          <Layer ref="layer">
            {this.state.wf.nodes.map((circle, i) => {
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
                  onMouseDown={this.nodeMouseDown}
                  onMouseOver={this.nodeMouseOver}
                  onMouseLeave={this.nodeMouseLeave}
                  onDragMove={this.nodeDragMove}
                  onDragEnd={this.nodeDragEnd}
                />
              );
            })}

            {this.state.wf.nodeDescriptors.map((nd, i) => {
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

            {this.state.wf.lines.map((line, i) => {
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
                  onClick={this.arrowClick}
                ></Arrow>
              );
            })}

            {this.state.wf.anchors.map((anchor, i) => {
              return (
                <Circle
                  key={anchor.id}
                  id={anchor.id}
                  x={anchor.circleConfig.x}
                  y={anchor.circleConfig.y}
                  radius={anchor.circleConfig.radius}
                  fill={anchor.circleConfig.fill}
                  shadowBlur={anchor.circleConfig.shadowBlur}
                  draggable={anchor.circleConfig.draggable}
                  visible={anchor.circleConfig.visible}
                  scaleX={anchor.circleConfig.scaleX}
                  scaleY={anchor.circleConfig.scaleY}
                  strokeEnabled={anchor.circleConfig.strokeEnabled}
                  onDragMove={this.anchorDragMove}
                  onDragEnd={this.anchorDragEnd}
                  onMouseUp={this.anchorMouseUp}
                  onMouseDown={this.anchorMouseDown}
                ></Circle>
              );
            })}

            {this.state.wf.toolTips.map((tip, i) => {
              return (
                <Label
                  key={tip.id}
                  x={tip.labelConfig.x}
                  y={tip.labelConfig.y}
                  visible={tip.labelConfig.visible}
                  opacity={tip.labelConfig.opacity}
                >
                  <Tag
                    key={Guid.create().toString()}
                    fill={tip.tagConfig.fill}
                    pointerDirection={tip.tagConfig.pointerDirection}
                    pointerWidth={tip.tagConfig.pointerWidth}
                    pointerHeight={tip.tagConfig.pointerHeight}
                    lineJoin={tip.tagConfig.lineJoin}
                    shadowColor={tip.tagConfig.shadowColor}
                    shadowBlur={tip.tagConfig.shadowBlur}
                    shadowOffsetX={tip.tagConfig.shadowOffsetX}
                    shadowOffsetY={tip.tagConfig.shadowOffsetY}
                    shadowOpacity={tip.tagConfig.shadowOpacity}
                  ></Tag>
                  <Text
                    key={Guid.create().toString()}
                    text={tip.textConfig.text}
                    fontFamily={tip.textConfig.fontFamily}
                    fontSize={tip.textConfig.fontSize}
                    padding={tip.textConfig.padding}
                    fill={tip.textConfig.fill}
                  ></Text>
                </Label>
              );
            })}

            <WFTransformer ref="transformer" onTransformEvent={this.transformEvent} />
          </Layer>
        </Stage>

        {stageMenu}
        {nodeMenu}
        {lineMenu}

        <Modal
          title="条件线编辑"
          visible={this.state.editLineDialogVisible}
          onOk={this.editLineOk}
          onCancel={this.editLineCancel}
        >
          <Row>
            <Col span={6}>编号</Col>
            <Col span={18}>{this.state.curSelectedArrowLine.nodeCode}</Col>
          </Row>
          <Row>
            <Col span={6}>描述</Col>
            <Col span={18}>
              <TextArea
                rows={4}
                value={this.state.curSelectedArrowLine.desc}
                onChange={this.lineDesChange}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6}>条件脚本</Col>
            <Col span={18}>
              <AceEditor
                mode="javascript"
                theme="monokai"
                width={'360px'}
                onChange={this.aceChange}
                name="blah2"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={true}
                enableSnippets={true}
                editorProps={{ $blockScrolling: true }}
                value={this.state.curSelectedArrowLine.conditionFuncStr}
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="审批节点编辑"
          visible={this.state.editNodeDialogVisible}
          onOk={this.editNodeOk}
          onCancel={this.editNodeCancel}
        >
          <Row>
            <Col span={6}>审批用户Id</Col>
            <Col span={18}>
              <Input value={this.state.curSelectedNode.userId} onChange={this.userIdChange} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>审批用户名称</Col>
            <Col span={18}>
              <Input value={this.state.curSelectedNode.userName} onChange={this.userNameChange} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>节点描述</Col>
            <Col span={18}>
              <TextArea
                rows={4}
                value={this.state.curSelectedNode.desc}
                onChange={this.nodeDescChange}
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="流程保存"
          visible={this.state.wfSaveDialogVisible}
          onOk={this.saveWFOk}
          onCancel={this.saveWFCancel}
        >
          <Row>
            <Col span={6}>流程名称</Col>
            <Col span={18}>
              <Input defaultValue={this.state.workflowVM.name} onChange={this.wfvmNameChange} />
            </Col>
          </Row>
          <Row>
            <Col span={6}>描述</Col>
            <Col span={18}>
              <Input defaultValue={this.state.workflowVM.desc} onChange={this.wfvmDescChange} />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default WorkFlowDesigner;
