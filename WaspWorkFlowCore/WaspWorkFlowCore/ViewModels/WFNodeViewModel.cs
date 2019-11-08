using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Models;

namespace WaspWorkFlowCore.ViewModels
{
    public class WFNodeViewModel: WFNode
    {
        /// <summary>
        /// 节点定义配置信息
        /// </summary>
        public NodeDefine NodeDefine { set; get; }

        /// <summary>
        /// 条件连线入线
        /// </summary>
        public List<LineDefine> InLines { set; get; }

        /// <summary>
        /// 条件连线出线
        /// </summary>
        public List<LineDefine> OutLines { set; get; }
    }
}
