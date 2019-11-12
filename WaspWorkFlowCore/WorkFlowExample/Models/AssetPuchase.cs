using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkflowExample.Models
{
    /// <summary>
    /// 采购物资申请条目
    /// </summary>
    public class AssetPuchase
    {
        public Guid Id { set; get; }
        /// <summary>
        /// 采购申请单Id
        /// </summary>
        public Guid BillId { set; get; }
        /// <summary>
        /// 品名
        /// </summary>
        public string Name { set; get; }
        /// <summary>
        /// 规格
        /// </summary>
        public string Specifications { set; get; }
        /// <summary>
        /// 用途
        /// </summary>
        public string Purpose { set; get; }
        /// <summary>
        /// 采购数量
        /// </summary>
        public int PurchaseQuantity { set; get; }
        /// <summary>
        /// 预计金额
        /// </summary>
        public double EstimatedAmount { set; get; }
        /// <summary>
        /// 现有库存量
        /// </summary>
        public int InventoryOnHand { set; get; }
    }
}
