import Konva from 'konva';
import { Guid } from 'guid-typescript';

/**
 * the definition of node type
 */
export enum NodeType {
  /**
   * start type node
   */
  Start,
  /**
   * audit type node
   */
  Audit,
  /**
   * condition type node
   */
  Condition,
  /**
   * end type node
   */
  End,
}

/**
 * the definition of  anchor type
 */
export enum AnchorType {
  /**
   * start type anchor
   */
  Start,
  /**
   * end type anchor
   */
  End,
}

/**
 * the definition of point
 */
export class Point {
  x: number;
  y: number;
  public constructor({ left, top }: { left: number; top: number }) {
    this.x = left;
    this.y = top;
  }
}

/**
 * the definition of workflow node
 */
export class WFNode {
  /**
   * id (guid type)
   */
  id!: string;
  /**
   * Konva CircleConfig
   */
  circleConfig!: Konva.CircleConfig;
  /**
   * node type
   */
  nodeType!: NodeType;
  /**
   * audit user id (guid type)
   */
  userId!: string;
  /**
   * audit user name
   */
  userName!: string;
  /**
   * node description
   */
  desc!: string;
}

/**
 * the definition of workflow anchor point
 */
export class WFAnchorPoint {
  id!: string;

  /**
   * Konva CircleConfig
   */
  circleConfig!: Konva.CircleConfig;

  /**
   * if current anchor is a start type anchor,pairId is id of the end node,Otherwise, vice versa.
   */
  pairId!: string;
  /**
   * AnchorType
   */
  anchorType!: AnchorType;
  /**
   * id of a matched node
   */
  nodeId!: string;
}

/**
 * the definition of workflow tip
 */
export class WFTip {
  id!: string;
  labelConfig!: Konva.LabelConfig;
  tagConfig!: Konva.TagConfig;
  textConfig!: Konva.TextConfig;
  shapeType!: string;
  shapeId!: string;
  tipType!: string;
}

/**
 * the definition of workflow arrow line
 */
export class WFArrowLine {
  id!: string;
  /**
   * the start node id
   */
  sNodeId!: string;
  /**
   * the end node id
   */
  eNodeId!: string;
  /**
   * the code of node
   */
  nodeCode!: number;
  /**
   * the description of workflow arrow line
   */
  desc!: string;
  /**
   * the definition of callback condition function
   */
  conditionFuncStr!: string;
  lineConfig!: Konva.ArrowConfig;
}

/**
 * the definition of workflow
 */
export class Workflow {
  /**
   * nodes
   */
  nodes: Array<WFNode> = [];
  /**
   * anchors
   */
  anchors: Array<WFAnchorPoint> = [];
  /**
   * arrow lines
   */
  lines: Array<WFArrowLine> = [];
  /**
   * node descriptions
   */
  nodeDescriptors: Array<WFTip> = [];
  /**
   * tooltips
   */
  toolTips: Array<WFTip> = [];
  /**
   * current mouse position
   */
  mousePoint: Point = new Point({ left: 0, top: 0 });
  public constructor() {
    this.nodes = [];
    this.anchors = [];
    this.lines = [];
    this.nodeDescriptors = [];
    this.toolTips = [];
    this.mousePoint = new Point({ left: 0, top: 0 });
  }
}

/**
 * arrow line ViewModel
 */
export class LineVM {
  id: string = Guid.EMPTY;
  sNodeId: string = Guid.EMPTY;
  eNodeId: string = Guid.EMPTY;
  nodeCode: number = 0;
  desc: string = '';
  conditionFuncStr: string = '';
  lineConfigJson: string = '';
}
/**
 * workflow arrow line ViewModel
 */
export class WFLineVM {
  id: string = Guid.EMPTY;
  lineId: string = Guid.EMPTY;
  wfId: string = Guid.EMPTY;
  lineJson: string = '';
  lineDefine: LineVM = new LineVM();
}
/**
 * node ViewModel
 */
export class NodeVM {
  id: string = Guid.EMPTY;
  nodeType: NodeType = NodeType.Start;
  userId: string = Guid.EMPTY;
  userName: string = '';
  desc: string = '';
  circleConfigJson: string = '';
}
/**
 * workflow node ViewModel
 */
export class WFNodeVM {
  id: string = Guid.EMPTY;
  wfId: string = Guid.EMPTY;
  nodeJson: string = '';
  nodeDefine: NodeVM = new NodeVM();
  inLines: LineVM[] = [];
  outLines: LineVM[] = [];
}
/**
 * workflow tooltip ViewModel
 */
export class WFToolTip {
  id: string = Guid.EMPTY;
  tipId: string = Guid.EMPTY;
  wfId: string = Guid.EMPTY;
  tipDef: string = '';
}
/**
 * workflow ViewModel
 */
export class WorkflowVM {
  id: string = Guid.EMPTY;
  name: string = '';
  desc: string = '';
  createUserId: string = Guid.EMPTY;
  updateUserId: string = Guid.EMPTY;
  createUserName: string = '';
  updateUserName: string = '';
  createTime: number = 0;
  updateTime: number = 0;
  isDelete: boolean = false;
  version: string = '';
  toolTips: WFToolTip[] = [];
  nodes: WFNodeVM[] = [];
  lines: WFLineVM[] = [];
}
