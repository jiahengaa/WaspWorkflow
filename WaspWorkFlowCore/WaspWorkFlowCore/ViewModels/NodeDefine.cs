using System;
using System.Collections.Generic;
using System.Drawing;
using System.Text;
using WaspWorkFlowCore.Core;

namespace WaspWorkFlowCore.ViewModels
{
    public class NodeDefine
    {
        public Guid Id { set; get; }
        /// <summary>
        /// S(Start,开始节点),E(End,结束节点),N(Normarl,常规审批节点),C(Condition,条件自动流转节点)
        /// </summary>
        public NodeType NodeType { set; get; }
        public string UserId { set; get; }
        public string UserName { set; get; }
        public string Desc { set; get; }

        public string CircleConfigJson { set; get; }
    }
}
