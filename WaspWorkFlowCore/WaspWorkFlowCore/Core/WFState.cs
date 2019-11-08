using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Core
{
    /// <summary>
    /// 单据状态
    /// </summary>
    public enum WFState
    {
        /// <summary>
        /// 已创建
        /// </summary>
        Created = 0,
        /// <summary>
        /// 已送审
        /// </summary>
        Sent = 1,
        /// <summary>
        /// 待处理
        /// </summary>
        WaitSend = 2,
        /// <summary>
        /// 挂起（另外，当恢复挂起时，单据恢复成前一状态即WaitSend，待处理）
        /// </summary>
        Suspend = 3,
        /// <summary>
        /// 已回退 （从节点N退回到前面某个节点A，则A节点状态为被退回）
        /// </summary>
        BackSent = 4,
        /// <summary>
        /// 被退回
        /// </summary>
        BeBackSent = 5,
        /// <summary>
        /// 流程还未走到该节点
        /// </summary>
        Undefine = 6,
        /// <summary>
        /// 已完成
        /// </summary>
        Completed = 7
    }
}
