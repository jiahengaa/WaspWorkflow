using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Core
{
    /// <summary>
    /// 节点类型
    /// </summary>
    public enum NodeType
    {
        /// <summary>
        /// 开始节点
        /// </summary>
        Start = 0,
        /// <summary>
        /// 常规审批节点
        /// </summary>
        Audit = 1,
        /// <summary>
        /// 条件自动流转节点
        /// </summary>
        Condition = 2,
        /// <summary>
        /// 结束节点
        /// </summary>
        End = 3
    }
}
