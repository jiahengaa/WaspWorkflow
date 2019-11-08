using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Core;

namespace WaspWorkFlowCore.ViewModels
{
    public class NodeActionLog
    {
        /// <summary>
        /// 操作用户名称
        /// </summary>
        public string UserName { set; get; }
        /// <summary>
        /// 操作动作
        /// </summary>
        public WFOperation Action { set; get; }
        /// <summary>
        /// 操作时间
        /// </summary>
        public long OperateTime { set; get; }
        /// <summary>
        /// 操作意见
        /// </summary>
        public string Opinions { set; get; }
    }
}
