using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaspWorkFlowCore.IServer;
using WorkflowExample.IServers;
using WorkflowExample.Models;
using WorkflowExample.ViewModels;

namespace WorkflowExample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ITPurchaseController : ControllerBase
    {
        private readonly IWFInstanceServer wFInstanceServer;
        private readonly IITPurchaseServer purchaseServer;
        public ITPurchaseController(IITPurchaseServer purchaseServer, IWFInstanceServer wFInstanceServer)
        {
            this.purchaseServer = purchaseServer;
            this.wFInstanceServer = wFInstanceServer;
        }
        // GET: api/ITPurchase/5
        [HttpGet]
        [Route("GetBillById")]
        public ITPurchaseViewModel GetBillById(Guid id)
        {
            return purchaseServer.GetBillById(id);
        }

        /// <summary>
        /// 新增或者更新
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateOrUpdate")]
        public bool CreateOrUpdate([FromBody] IPurchaseCreate purchaseCreate)
        {
            return purchaseServer.CreateOrUpdate(purchaseCreate.ITPurchaseVM, purchaseCreate.WFDefine, purchaseCreate.UserId, purchaseCreate.UserName);
        }


        [HttpGet]
        [Route("GetWaitSendBills")]
        public List<ITPurchaseInfo> GetWaitSendBills(Guid userId)
        {
            var wfs = wFInstanceServer.GetWaitSendWFsByUserId(userId);
            var stalist = wfs.Where(p => p.BType == typeof(ITPurchase).Name);
            var list = purchaseServer.GetBillsById(stalist.Select(p => p.BId).ToList());
            List<ITPurchaseInfo> slist = new List<ITPurchaseInfo>();
            foreach (var item in list)
            {
                slist.Add(new ITPurchaseInfo()
                {
                    WFInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFInstanceId,
                    NodeInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFNodeId,
                    Desc = wfs.FirstOrDefault(p=>p.BId == item.Id)?.Desc,
                    ITPurchaseViewModel = item
                });
            }

            return slist;
        }

        [HttpGet]
        [Route("GetSentBills")]
        public List<ITPurchaseInfo> GetSentBills(Guid userId)
        {
            var wfs = wFInstanceServer.GetSentWFsByUserId(userId);
            wfs = wfs.Union(wFInstanceServer.GetBackSentWFsByUserId(userId)).Distinct().ToList();
            var stalist = wfs.Where(p => p.BType == typeof(ITPurchase).Name);
            var list = purchaseServer.GetBillsById(stalist.Select(p => p.BId).ToList());
            List<ITPurchaseInfo> slist = new List<ITPurchaseInfo>();
            foreach (var item in list)
            {
                slist.Add(new ITPurchaseInfo()
                {
                    WFInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFInstanceId,
                    NodeInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFNodeId,
                    Desc = wfs.FirstOrDefault(p => p.BId == item.Id)?.Desc,
                    ITPurchaseViewModel = item
                });
            }

            return slist;
        }

        [HttpGet]
        [Route("GetFinishedBills")]
        public List<ITPurchaseInfo> GetFinishedBills(Guid userId)
        {
            var wfs = wFInstanceServer.GetCompletedWFsByUserId(userId);
            var stalist = wfs.Where(p => p.BType == typeof(ITPurchase).Name);
            var list = purchaseServer.GetBillsById(stalist.Select(p => p.BId).ToList());
            List<ITPurchaseInfo> slist = new List<ITPurchaseInfo>();
            foreach (var item in list)
            {
                slist.Add(new ITPurchaseInfo()
                {
                    WFInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFInstanceId,
                    NodeInstanceId = stalist.FirstOrDefault(p => p.BId == item.Id).WFNodeId,
                    Desc = wfs.FirstOrDefault(p => p.BId == item.Id)?.Desc,
                    ITPurchaseViewModel = item
                });
            }

            return slist;
        }
    }
}
