import styles from './ITPurchase.css';
import baseUrl from '../types/ServerConfig';
import { Button, Col, Input, Modal, Row, Table, Tooltip, Upload } from 'antd';
import { Guid } from 'guid-typescript';
import React, { Component } from 'react';
import { ITPurchaseModel, AssetPuchase } from '../types/ITPurchaseModel';

class ITPurchase extends Component {
  state = {
    curLoginUser: {
      id: '',
      name: '',
    },
    curTemplateWFId: '',
    bill: new ITPurchaseModel(),
    bills: [],
    curWF: null,
  };

  addItem = () => {
    this.state.bill.assetItem.push(new AssetPuchase());
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  };

  render() {
    return (
      <div>
        <Row>
          <Col span={6}>用户Id</Col>
          <Col span={6}>
            <Input value={this.state.curLoginUser.id}></Input>
          </Col>
          <Col span={6}>用户名称</Col>
          <Col span={6}>
            <Input value={this.state.curLoginUser.name}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={6}>流程模板ID</Col>
          <Col span={6}>
            <Input value={this.state.curTemplateWFId}></Input>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ITPurchase;
