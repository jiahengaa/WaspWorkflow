using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Models
{
    public class WFNode
    {
        public Guid Id { set; get; }
        public Guid WFId { set; get; }
        /// <summary>
        /// S(Start,开始节点),E(End,结束节点),N(Normarl,常规审批节点),C(Condition,条件自动流转节点)
        /// </summary>
        public string NodeJson { set; get; }
    }
}
