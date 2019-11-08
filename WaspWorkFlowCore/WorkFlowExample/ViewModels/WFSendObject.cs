using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkFlowExample.ViewModels
{
    public class WFSendObject
    {
        public Guid WFInstanceId { set; get; }
        public Guid NodeInstanceId { set; get; }
        public Object BussinessInfo { set; get; }
        public string Options { set; get; }
        public string UserName { set; get; }
        public List<NodeUserInfo> userConfigs { set; get; }
    }

    public class NodeUserInfo
    {
        public Guid NodeInstanceId { set; get; }
        public Guid UserId { set; get; }
        public string UserName { set; get; }
    }
}
