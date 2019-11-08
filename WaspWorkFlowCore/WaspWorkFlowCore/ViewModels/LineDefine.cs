using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.ViewModels
{
    public class LineDefine
    {
        public Guid Id { set; get; }
        /// <summary>
        /// 开始节点id
        /// </summary>
        public Guid SNodeId { set; get; }
        /// <summary>
        /// 结束节点Id
        /// </summary>
        public Guid ENodeId { set; get; }
        public int NodeCode { set; get; }
        public string Desc { set; get; }
        public string ConditionFuncStr { set; get; }

        public string LineConfigJson { set; get; }

    }
}
