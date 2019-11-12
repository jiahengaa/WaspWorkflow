using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaspWorkFlowCore.ViewModels;
using WorkflowExample.ViewModels;

namespace WorkflowExample.IServers
{
    public interface IITPurchaseServer
    {
        bool CreateOrUpdate(ITPurchaseViewModel viewModel, WFInstanceViewModel wFInstanceView, Guid userId, string userName);
        ITPurchaseViewModel GetBillById(Guid id);
        List<ITPurchaseViewModel> GetBillsById(List<Guid> ids);
    }
}
