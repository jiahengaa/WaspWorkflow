using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Models
{
    public class WFToolTip
    {
        public Guid Id { set; get; }
        public Guid TipId { set; get; }
        public Guid WFId { set; get; }
        public String TipDef { set; get; }
    }
}
