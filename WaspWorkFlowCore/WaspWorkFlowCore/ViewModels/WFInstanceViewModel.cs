using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Models;

namespace WaspWorkFlowCore.ViewModels
{
    public class WFInstanceViewModel: WFInstance
    {
        public List<WFLineViewModel> Lines { set; get; }
        public List<WFNodeInstanceViewModel> Nodes { set; get; }
    }
}
