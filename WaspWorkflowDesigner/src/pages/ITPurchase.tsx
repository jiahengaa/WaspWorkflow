import styles from './ITPurchase.css';
import baseUrl from '../types/ServerConfig';
import { Button, Col, Modal, Input, Row, Table, Tooltip, Upload } from 'antd';
import { Guid } from 'guid-typescript';
import React, { Component } from 'react';
import { ITPurchaseModel, AssetPuchase, ITPurchaseInfo } from '../types/ITPurchaseModel';

import { WFView } from '../components/wfview';

enum BillState {
  Create,
  View,
  Update,
  Undefine,
}

class ITPurchase extends Component {
  btnSave = (e: any) => {
    if (this.state.billState === BillState.Create) {
      var para = {
        userId: this.state.curLoginUser.id,
        userName: this.state.curLoginUser.name,
        wfDefine: this.state.curWF,
        itPurchaseVM: this.state.bill,
      };
      fetch(baseUrl + '/ITPurchase/CreateOrUpdate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(para),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch(exp => {
          console.log(exp);
        });
    }
  };
  assetSpecificationChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].specifications = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  assetpurposeChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].purpose = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  assetPurchaseQuantityChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].purchaseQuantity = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  assetEstimatedAmountChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].estimatedAmount = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  assetInventoryOnHandChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].inventoryOnHand = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  assetNameChange(e: any, item: AssetPuchase, index: number) {
    this.state.bill.assetItem[index].name = e.target.value;
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  }
  state = {
    curLoginUser: {
      id: '',
      name: '',
    },
    curTemplateWFId: '',
    bill: new ITPurchaseModel(),
    bills: [],
    curWF: null,
    billState: BillState.Undefine,
    curWFInstanceId: '',
    curNodeInstanceId: '',
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'itPurchaseViewModel.id',
      key: 'itPurchaseViewModel.id',
    },
    {
      title: '单据描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '操作',
      render: (text: any, record: ITPurchaseInfo) => (
        <div>
          <Button
            onClick={(ev: any) => {
              this.handleView(ev, record);
            }}
          >
            查看详情
          </Button>
          <Button
            onClick={(ev: any) => {
              this.sendBill(ev, record);
            }}
          >
            送审
          </Button>
          <Button
            onClick={(ev: any) => {
              this.backBill(ev, record);
            }}
          >
            退回
          </Button>
        </div>
      ),
    },
  ];

  addItem = () => {
    this.state.bill.assetItem.push(new AssetPuchase());
    this.setState({
      bill: {
        ...this.state.bill,
        assetItem: [...this.state.bill.assetItem],
      },
    });
  };
  createBill = (e: any) => {
    fetch(baseUrl + '/WFEngine/GetWFWhiteByTemplate?id=' + this.state.curTemplateWFId)
      .then(res => res.json())
      .then(data => {
        this.setState({
          billState: BillState.Create,
          curWF: data,
          bill: new ITPurchaseModel(),
        });
      })
      .catch(exp => {
        console.log(exp);
      });
  };
  getAllWaitSendBills = (e: any) => {
    fetch(baseUrl + '/ITPurchase/GetWaitSendBills?userId=' + this.state.curLoginUser.id)
      .then(res => res.json())
      .then((data: ITPurchaseInfo[]) => {
        this.setState({
          bills: data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  getAllSentBills = (e: any) => {};
  getAllFinishedBills = (e: any) => {};
  handleView = (e: any, bill: ITPurchaseInfo) => {
    this.setState({
      billState: BillState.Undefine,
    });
    this.setState({
      bill: bill.itPurchaseViewModel,
      curNodeInstanceId: bill.nodeInstanceId,
      curWFInstanceId: bill.wfInstanceId,
      billState: BillState.View,
    });

    if (this.refs.wfview !== undefined) {
      (this.refs.wfView as WFView).updateView();
    }
  };
  sendBill = (ev: any, record: ITPurchaseInfo) => {
    var para = {
      wfInstanceId: record.wfInstanceId,
      nodeInstanceId: record.nodeInstanceId,
      bussinessInfo: record.itPurchaseViewModel,
      options: '请帮个忙啦',
      userName: '录入员A',
      userConfigs: [],
    };

    fetch(baseUrl + '/WFEngine/Send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(para),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(exp => {
        console.log(exp);
      });
  };
  backBill = (ev: any, record: ITPurchaseInfo) => {
    throw new Error('Method not implemented.');
  };
  userIdChange = (e: any) => {
    this.setState({
      curLoginUser: {
        ...this.state.curLoginUser,
        id: e.target.value,
      },
    });
  };
  userNameChange = (e: any) => {
    this.setState({
      curLoginUser: {
        ...this.state.curLoginUser,
        name: e.target.value,
      },
    });
  };
  wfTemplateIdChange = (e: any) => {
    this.setState({
      curTemplateWFId: e.target.value,
    });
  };
  applicantNameChange = (e: any) => {
    this.setState({
      bill: {
        ...this.state.bill,
        applicantName: e.target.value,
      },
    });
  };
  departmentNameChange = (e: any) => {
    this.setState({
      bill: {
        ...this.state.bill,
        departmentName: e.target.value,
      },
    });
  };
  createTimeChange = (e: any) => {
    this.setState({
      bill: {
        ...this.state.bill,
        createTime: e.target.value,
      },
    });
  };

  billTable = () => {
    if (this.state.bill === undefined || this.state.billState === BillState.Undefine) {
      return;
    }

    let title = (
      <div>
        <Row>
          <div className={styles.titleTop}>{this.state.bill.companyName}</div>
        </Row>
        <Row>
          <div className={styles.titleLayer}>{this.state.bill.billName}</div>
        </Row>
      </div>
    );
    let tableBody = (
      <Row gutter={0} className={styles.cellHeight}>
        <Col span={2} className={styles.CellTitle}>
          姓名
        </Col>
        <Col span={6} className={styles.CellTitle}>
          <Input
            className={styles.CellInput}
            value={this.state.bill.applicantName}
            onChange={(e: any) => {
              this.applicantNameChange(e);
            }}
          />
        </Col>
        <Col span={2} className={styles.CellTitle}>
          部门
        </Col>
        <Col span={6} className={styles.CellTitle}>
          <Input
            className={styles.CellInput}
            value={this.state.bill.departmentName}
            onChange={(e: any) => {
              this.departmentNameChange(e);
            }}
          />
        </Col>
        <Col span={2} className={styles.CellTitle}>
          制表时间
        </Col>
        <Col span={6} className={styles.CellTitle}>
          <Input
            className={styles.CellInput}
            value={this.state.bill.createTime}
            onChange={(e: any) => {
              this.createTimeChange(e);
            }}
          />
        </Col>
      </Row>
    );

    let childTableTitle = (
      <Row gutter={0} className={styles.cellHeight}>
        <Col span={4} className={styles.CellTitle}>
          品名
        </Col>
        <Col span={4} className={styles.CellTitle}>
          规格
        </Col>
        <Col span={4} className={styles.CellTitle}>
          用途
        </Col>
        <Col span={4} className={styles.CellTitle}>
          采购数量
        </Col>
        <Col span={4} className={styles.CellTitle}>
          预计金额
        </Col>
        <Col span={4} className={styles.CellTitle}>
          现有库存
        </Col>
      </Row>
    );

    let childBody = this.state.bill.assetItem.map((item, index) => {
      return (
        <Row gutter={0} className={styles.cellHeight} key={index}>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.name}
              onChange={(e: any) => {
                this.assetNameChange(e, item, index);
              }}
            />
          </Col>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.specifications}
              onChange={(e: any) => {
                this.assetSpecificationChange(e, item, index);
              }}
            />
          </Col>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.purpose}
              onChange={(e: any) => {
                this.assetpurposeChange(e, item, index);
              }}
            />
          </Col>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.purchaseQuantity}
              onChange={(e: any) => {
                this.assetPurchaseQuantityChange(e, item, index);
              }}
            />
          </Col>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.estimatedAmount}
              onChange={(e: any) => {
                this.assetEstimatedAmountChange(e, item, index);
              }}
            />
          </Col>
          <Col span={4} className={styles.CellTitle}>
            <Input
              className={styles.CellInput}
              value={item.inventoryOnHand}
              onChange={(e: any) => {
                this.assetInventoryOnHandChange(e, item, index);
              }}
            />
          </Col>
        </Row>
      );
    });

    return (
      <div className={styles.cellTable}>
        {title}
        {tableBody}
        {childTableTitle}
        {childBody}
      </div>
    );
  };

  wfViewShow = () => {
    if (this.state.billState !== BillState.Undefine) {
      return (
        <WFView
          ref="wfView"
          curWorkflowId={this.state.curWFInstanceId}
          currentNodeId={this.state.curNodeInstanceId}
          bill={this.state.bill}
        />
      );
    } else {
      return;
    }
  };

  render() {
    const userId = this.state.curLoginUser.id;
    const userName = this.state.curLoginUser.name;
    const wfTemplateId = this.state.curTemplateWFId;
    return (
      <div>
        <Row>
          <Col span={6}>用户Id</Col>
          <Col span={6}>
            <Input value={userId} onChange={this.userIdChange}></Input>
          </Col>
          <Col span={6}>用户名称</Col>
          <Col span={6}>
            <Input value={userName} onChange={this.userNameChange}></Input>
          </Col>
        </Row>
        <Row>
          <Col span={6}>流程模板ID</Col>
          <Col span={6}>
            <Input value={wfTemplateId} onChange={this.wfTemplateIdChange}></Input>
          </Col>
        </Row>
        <Row>
          <Button onClick={this.createBill}>创建申请</Button>
          <Button onClick={this.getAllWaitSendBills}>待处理单据</Button>
          <Button onClick={this.getAllSentBills}>审批中单据</Button>
          <Button onClick={this.getAllFinishedBills}>已完结单据</Button>
        </Row>
        <Table
          columns={this.columns}
          dataSource={this.state.bills}
          rowKey={record =>
            record.itPurchaseViewModel === undefined
              ? Guid.create().toString()
              : record.itPurchaseViewModel.id
          }
        />
        <Button onClick={this.addItem}>新增一行</Button>
        <Button onClick={this.btnSave}>保存</Button>
        {this.billTable()}
        {this.wfViewShow()}
      </div>
    );
  }
}

export default ITPurchase;
