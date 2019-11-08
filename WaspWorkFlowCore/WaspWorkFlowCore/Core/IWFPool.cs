using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.Core
{
    public interface IWFPool
    {
        ConcurrentDictionary<Guid, WFInstanceViewModel> WFs { set; get; }
    }
}
