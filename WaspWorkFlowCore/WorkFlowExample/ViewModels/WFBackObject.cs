﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorkflowExample.ViewModels
{
    public class WFBackObject
    {
        public Guid WFInstanceId { set; get; }
        public Guid NodeInstanceId { set; get; }
        public Object BussinessInfo { set; get; }
        public string Options { set; get; }
        public string UserName { set; get; }
        public List<Guid> PreNodes { set; get; }
    }
}
