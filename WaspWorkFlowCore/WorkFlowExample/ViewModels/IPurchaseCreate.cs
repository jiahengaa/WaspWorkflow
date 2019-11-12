using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaspWorkFlowCore.ViewModels;

namespace WorkflowExample.ViewModels
{
    public class IPurchaseCreate
    {
        public ITPurchaseViewModel ITPurchaseVM { set; get; }
        public WFInstanceViewModel WFDefine { set; get; }
        public Guid UserId { set; get; }
        public string UserName { set; get; }
    }
}
