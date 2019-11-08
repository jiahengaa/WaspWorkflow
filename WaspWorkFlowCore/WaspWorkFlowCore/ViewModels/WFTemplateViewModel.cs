using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Models;

namespace WaspWorkFlowCore.ViewModels
{
    public class WFTemplateViewModel: WFTemplate
    {
        public List<WFLineViewModel> Lines { set; get; }
        public List<WFNodeViewModel> Nodes { set; get; }
        public List<WFToolTip> ToolTips { set; get; }
    }
}
