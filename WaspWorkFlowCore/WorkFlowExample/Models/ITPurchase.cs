using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkflowExample.Models
{
    public class ITPurchase
    {
        /// <summary>
        /// 主键
        /// </summary>
        public Guid Id { set; get; }
        /// <summary>
        /// 单据名称
        /// </summary>
        public string BillName { set; get; } = "采购申请单";
        /// <summary>
        /// 公司名称
        /// </summary>
        public string CompanyName { set; get; } = "Google";

        /// <summary>
        /// 申请人Id
        /// </summary>
        public Guid ApplicantId { set; get; }
        /// <summary>
        /// 申请人名称
        /// </summary>
        public string ApplicantName { set; get; }
        /// <summary>
        /// 申请人所属部门Id
        /// </summary>
        public string DepartmentId { set; get; }
        /// <summary>
        /// 申请人所属部门
        /// </summary>
        public string DepartmentName { set; get; }
        /// <summary>
        /// 项目id
        /// </summary>
        public Guid ProjectId { set; get; }
        /// <summary>
        /// 项目名称
        /// </summary>
        public string ProjectName { set; get; }
        /// <summary>
        /// 制单日期
        /// </summary>
        public long CreateTime { set; get; }
        /// <summary>
        /// 预计金额
        /// </summary>
        public double EstimatedAmount { set; get; }
        /// <summary>
        /// 采购数量
        /// </summary>
        public int Count { set; get; }
        /// <summary>
        /// 现有库存量
        /// </summary>
        public int HadCount { set; get; }
        /// <summary>
        /// 财务经理签字
        /// </summary>
        public string SignatureOfFM { set; get; }
        /// <summary>
        /// 财务签字时间
        /// </summary>
        public long DataOfSFM { set; get; }
        /// <summary>
        /// 部门经理签字
        /// </summary>
        public string SignatureOfDP { set; get; }
        /// <summary>
        /// 部门经理签字时间
        /// </summary>
        public long DataOfSDP { set; get; }
        /// <summary>
        /// 副总经理签字
        /// </summary>
        public string SignatureOfVGM { set; get; }
        /// <summary>
        /// 副总签字时间
        /// </summary>
        public long DataOfSVGM { set; get; }
        /// <summary>
        /// 总经理签字
        /// </summary>
        public string SignatureOfGM { set; get; }
        /// <summary>
        /// 总经理签字时间
        /// </summary>
        public long DataOfSGM { set; get; }
    }
}
