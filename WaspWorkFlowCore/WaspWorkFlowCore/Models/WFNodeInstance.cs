using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Core;

namespace WaspWorkFlowCore.Models
{
    public class WFNodeInstance
    {
        public Guid Id { set; get; }
        /// <summary>
        /// WFInstance Id
        /// </summary>
        public Guid WFInstanceId { set; get; }
        /// <summary>
        /// WFNode Id
        /// </summary>
        public Guid WFNodeId { set; get; }
        /// <summary>
        /// 审核用户Id
        /// </summary>
        public Guid UserId { set; get; }
        /// <summary>
        /// 审核用户名称
        /// </summary>
        public string UserName { set; get; }
        /// <summary>
        /// 节点状态
        /// </summary>
        public WFState State { set; get; } = WFState.Undefine;
        /// <summary>
        /// 节点动作日志
        /// </summary>
        public string ActionLogs { set; get; } = "";

        /// <summary>
        /// WFTemplate Id，此处设置此字段是为了避免多表连接查询
        /// </summary>
        public Guid WFId { set; get; }
        /// <summary>
        /// bussiness id，此处设置此字段是为了避免多表连接查询
        /// </summary>
        public Guid BId { set; get; }

        /// <summary>
        /// 单据类型，业务系统根据此字段判断BId去哪张表去查找单据
        /// </summary>
        public string BType { set; get; }
        public string Desc { set; get; }
    }
}
