using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaspWorkFlowCore;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.ViewModels;
using WorkflowExample.IServers;
using WorkflowExample.Models;
using WorkflowExample.ViewModels;

namespace WorkflowExample.Servers
{
    public class ITPurchaseServer : IITPurchaseServer
    {
        private readonly WFContext wFContext;
        private readonly ExampleContext exampleContext;
        private readonly IMapper mapper;
        private readonly IWFInstanceServer iWFInstanceServer;
        public ITPurchaseServer(WFContext wFContext,ExampleContext exampleContext, IMapper mapper, IWFInstanceServer iWFInstanceServer)
        {
            this.wFContext = wFContext;
            this.exampleContext = exampleContext;
            this.mapper = mapper;
            this.iWFInstanceServer = iWFInstanceServer;
        }

        public bool CreateOrUpdate(ITPurchaseViewModel viewModel, WFInstanceViewModel wFInstanceView, Guid userId, string userName)
        {
            if (viewModel.Id == new Guid())
            {
                viewModel = mapper.Map(exampleContext.ITPurchase.Add(mapper.Map<ITPurchase>(viewModel)).Entity, viewModel);
            }
            else
            {
                viewModel = mapper.Map(exampleContext.ITPurchase.Update(mapper.Map<ITPurchase>(viewModel)).Entity, viewModel);
            }

            if (viewModel.AssetItem != null)
            {
                for (int i = 0; i < viewModel.AssetItem.Count; i++)
                {
                    viewModel.AssetItem[i].BillId = viewModel.Id;
                    if (viewModel.AssetItem[i].Id == new Guid())
                    {
                        viewModel.AssetItem[i] = mapper.Map(exampleContext.AssetPuchase.Add(mapper.Map<AssetPuchase>(viewModel.AssetItem[i])).Entity, viewModel.AssetItem[i]);
                    }
                    else
                    {
                        viewModel.AssetItem[i] = mapper.Map(exampleContext.AssetPuchase.Update(mapper.Map<AssetPuchase>(viewModel.AssetItem[i])).Entity, viewModel.AssetItem[i]);
                    }
                }
            }

            wFContext.SaveChanges();

            wFInstanceView.Desc = $"{viewModel.ApplicantName}发起采购申请，总金额{viewModel.EstimatedAmount}";
            wFInstanceView.BId = viewModel.Id;
            wFInstanceView.BType = typeof(ITPurchase).Name;

            var wf = iWFInstanceServer.CreateWFInstance(wFInstanceView, userId, userName);

            if (wf == null)
            {
                //没有创建成功
                return false;
            }

            return true;
        }

        public ITPurchaseViewModel GetBillById(Guid id)
        {
            var bill = exampleContext.ITPurchase.Find(id);
            if (bill == null)
            {
                return null;
            }

            var curBillVM = mapper.Map<ITPurchaseViewModel>(bill);
            curBillVM.AssetItem = new List<AssetPuchase>();
            var items = exampleContext.AssetPuchase.Where(p => p.BillId == id).ToList();
            if (items != null)
            {
                items.ForEach(ele =>
                {

                });
                curBillVM.AssetItem.AddRange(items);
            }

            return curBillVM;
        }

        public List<ITPurchaseViewModel> GetBillsById(List<Guid> ids)
        {
            var list = exampleContext.ITPurchase.Where(p => ids.Contains(p.Id)).ToList();
            var vmList = mapper.Map<List<ITPurchaseViewModel>>(list);

            foreach (var item in vmList)
            {
                var childs = exampleContext.AssetPuchase.Where(p => p.BillId == item.Id).ToList();
                item.AssetItem = new List<AssetPuchase>();
                item.AssetItem.AddRange(childs);
            }

            return vmList;
        }
    }
}
