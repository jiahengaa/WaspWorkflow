using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.Core
{
    public class WFPool: IWFPool
    {
        public ConcurrentDictionary<Guid, WFInstanceViewModel> WFs { set; get; }
        
        public WFPool()
        {
            WFs = new ConcurrentDictionary<Guid, WFInstanceViewModel>();
        }

    }
}
