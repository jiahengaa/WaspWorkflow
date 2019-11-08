import React from 'react';
import { Circle, Transformer } from 'react-konva';
import Konva from 'konva';

type Props = {
  onTransformEvent(evt: Konva.KonvaEventObject<Event>): void;
};

interface ITransformProps extends React.Props<any> {
  onTransformEvent(evt: Konva.KonvaEventObject<Event>): void;
}

class WFTransformer extends React.Component<ITransformProps> {
  transformer: Konva.Transformer | any;
  transformEvent: ((evt: Konva.KonvaEventObject<Event>) => void) | undefined;
  constructor(props: Props) {
    super(props);
    this.transformEvent = props.onTransformEvent;
  }
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    if (this.selectedShapeId === '') {
      return;
    }
    this.checkNode();
  }

  selectedShapeId: string = '';

  checkNode() {
    if (this.selectedShapeId === '') {
      this.transformer.detach();
      return;
    }
    const stage = this.transformer.getStage();
    const selectedNode = stage.findOne('#' + this.selectedShapeId);
    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  render() {
    return (
      <Transformer
        rotateEnabled={false}
        borderDash={[6, 1, 6]}
        enabledAnchors={['bottom-right']}
        ref={node => {
          this.transformer = node;
        }}
        onTransform={this.transformEvent}
      />
    );
  }
}

export default WFTransformer;
