using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Core
{
    /// <summary>
    /// 工作流动作定义
    /// </summary>
    public enum WFOperation
    {
        /// <summary>
        /// 创建
        /// </summary>
        Create = 0,
        /// <summary>
        /// 送审
        /// </summary>
        Send=1,
        /// <summary>
        /// 回退
        /// </summary>
        Back = 2,
        /// <summary>
        /// 挂起
        /// </summary>
        Suspend=3,
        /// <summary>
        /// 恢复挂起
        /// </summary>
        UnSuspend =4,
        /// <summary>
        /// 编辑
        /// </summary>
        Edit = 5,
    }
}
