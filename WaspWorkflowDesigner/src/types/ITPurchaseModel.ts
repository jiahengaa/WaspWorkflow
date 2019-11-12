import { Guid } from 'guid-typescript';

export class ITPurchaseModel {
  id: string = Guid.EMPTY;
  billName: string = '采购申请单';
  companyName: string = 'google';
  applicantId: string = Guid.EMPTY;
  applicantName: string = '';
  departmentId: string = Guid.EMPTY;
  departmentName: string = '';
  projectId: string = Guid.EMPTY;
  projectName: string = '';
  createTime: number = 0;
  estimatedAmount: number = 0;
  count: number = 0;
  hadCount: number = 0;
  signatureOfFM: string = '';
  dataOfSFM: number = 0;
  signatureOfDP: string = '';
  dataOfSDP: number = 0;
  signatureOfVGM: string = '';
  dataOfSVGM: number = 0;
  signatureOfGM: string = '';
  dataOfSGM: number = 0;
  assetItem: AssetPuchase[] = [];
}

export class AssetPuchase {
  id: string = Guid.EMPTY;
  billId: string = Guid.EMPTY;
  name: string = '';
  specifications: string = '';
  purpose: string = '';
  purchaseQuantity: number = 0;
  estimatedAmount: number = 0;
  inventoryOnHand: number = 0;
}
