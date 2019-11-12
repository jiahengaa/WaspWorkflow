import { Arrow, Circle, Label, Layer, Stage, Tag, Text } from 'react-konva';
import { Guid } from 'guid-typescript';
import { WFNode, WFArrowLine, WFTip, NodeType, NodeState } from '@/types/WorkFlow';
import React from 'react';
import baseUrl from '@/types/ServerConfig';

import styles from './wfview.css';

interface IWFViewProps extends React.Props<any> {
  currentNodeId: string;
  curWorkflowId: string;
  bill: Object;
}

export class WFView extends React.Component<IWFViewProps> {
  constructor(props: IWFViewProps) {
    super(props);
  }

  state = {
    nodes: [],
    lines: [],
    nodeDescriptors: [],
    stageConfig: {
      width: window.innerWidth,
      height: window.innerHeight,
      draggable: true,
    },
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
        this.setWFState();
      })
      .catch(exp => {
        console.log(exp);
      });
  }

  setWFState = (): void => {
    var that = this;
    this.state.nodes.forEach((node: WFNode) => {
      node.circleConfig.draggable = false;
      let nodeDes = new WFTip();
      nodeDes.id = Guid.create().toString();
      nodeDes.shapeId = node.id;
      nodeDes.shapeType = 'WFNode';
      nodeDes.tipType = 'desciptor';
      nodeDes.labelConfig = {
        id: Guid.create().toString(),
        x: node.circleConfig.x,
        y: node.circleConfig.y,
        visible: true,
        opacity: 0.75,
      };
      nodeDes.tagConfig = {
        fill: 'green',
        pointerDirection: 'down',
        pointerWidth: 0,
        pointerHeight: 0,
        lineJoin: 'round',
        shadowColor: 'green',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowOpacity: 0,
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

    this.setState({
      nodes: [...this.state.nodes],
      nodeDescriptors: [...this.state.nodeDescriptors],
    });
  };

  render() {
    return (
      <div>
        <Stage
          width={this.state.stageConfig.width}
          height={this.state.stageConfig.height}
          draggable={this.state.stageConfig.draggable}
        >
          <Layer>
            {this.state.nodes.map((circle: WFNode, i) => {
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
            {this.state.nodeDescriptors.map((nd: WFTip, i) => {
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
            {this.state.lines.map((line: WFArrowLine, i) => {
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
          </Layer>
        </Stage>
      </div>
    );
  }
}
