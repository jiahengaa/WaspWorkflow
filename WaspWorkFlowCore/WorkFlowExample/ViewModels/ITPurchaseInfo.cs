using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkflowExample.ViewModels
{
    public class ITPurchaseInfo
    {
        public Guid WFInstanceId { set; get; }
        public Guid NodeInstanceId { set; get; }
        public string Desc { set; get; }

        public ITPurchaseViewModel ITPurchaseViewModel { set; get; }
    }
}
