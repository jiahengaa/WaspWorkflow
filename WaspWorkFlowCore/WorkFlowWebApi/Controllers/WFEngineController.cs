using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.Models;
using WaspWorkFlowCore.ViewModels;
using WorkFlowWebApi.ViewModels;

namespace WorkFlowWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WFEngineController : ControllerBase
    {
        private readonly IWFInstanceServer iWFInstanceServer;
        public WFEngineController(IWFInstanceServer iWFInstanceServer)
        {
            this.iWFInstanceServer = iWFInstanceServer;
        }

        /// <summary>
        /// 根据模板id获取创建空白模板实例
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetWFWhiteByTemplate")]
        public WFInstanceViewModel GetWFWhiteByTemplate(Guid id)
        {
            return iWFInstanceServer.GetWFWhiteByTemplate(id);
        }

        /// <summary>
        /// 根据模板实例获取模板详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetWFInstanceById")]
        public WFInstanceViewModel GetWFInstanceById(Guid id)
        {
            return iWFInstanceServer.GetWFInstanceById(id);
        }

        /// <summary>
        /// 获取当前用户退回的单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetBackSentWFsByUserId")]
        public List<WFNodeInstance> GetBackSentWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetBackSentWFsByUserId(id);
        }

        /// <summary>
        /// 获取所有已被退回的单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetBeBackSentWFsByUserId")]
        public List<WFNodeInstance> GetBeBackSentWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetBeBackSentWFsByUserId(id);
        }

        /// <summary>
        /// 获取所有已结束的单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCompletedWFsByUserId")]
        public List<WFNodeInstance> GetCompletedWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetCompletedWFsByUserId(id);
        }

        /// <summary>
        /// 获取用户创建的所有单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCreatedWFsByUserId")]
        public List<WFNodeInstance> GetCreatedWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetCreatedWFsByUserId(id);
        }

        /// <summary>
        /// 获取所有已送审的单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSentWFsByUserId")]
        public List<WFNodeInstance> GetSentWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetSentWFsByUserId(id);
        }

        /// <summary>
        /// 获取所有已挂起的单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSuspendWFsByUserId")]
        public List<WFNodeInstance> GetSuspendWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetSuspendWFsByUserId(id);
        }

        /// <summary>
        /// 获取所有待送审单据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetWaitSendWFsByUserId")]
        public List<WFNodeInstance> GetWaitSendWFsByUserId(Guid id)
        {
            return iWFInstanceServer.GetWaitSendWFsByUserId(id);
        }

        /// <summary>
        /// 创建项目
        /// </summary>
        /// <param name="viewModel"></param>
        /// <param name="userId"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("CreateWFInstance")]
        public WFInstanceViewModel CreateWFInstance([FromBody] WFInstanceViewModel viewModel,Guid userId,String userName)
        {
            //解析token，获取用户id，用户名称
            return iWFInstanceServer.CreateWFInstance(viewModel, userId, userName);
        }

        /// <summary>
        /// 送审项目
        /// </summary>
        /// <param name="wFSendObject"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Send")]
        public async Task<bool> Send([FromBody] [Required]WFSendObject wFSendObject)
        {
            var nodeConfig = new Dictionary<Guid, Tuple<Guid, string>>();

            if (wFSendObject.userConfigs != null)
            {
                foreach(var item in wFSendObject.userConfigs)
                {
                    if (!nodeConfig.ContainsKey(item.NodeInstanceId))
                    {
                        nodeConfig.Add(item.NodeInstanceId, new Tuple<Guid, string>(item.UserId, item.UserName));
                    }
                }
            }

            //解析token，获取用户id，用户名称
            return await iWFInstanceServer.Send(wFSendObject.WFInstanceId, wFSendObject.NodeInstanceId, wFSendObject.BussinessInfo, wFSendObject.Options, wFSendObject.UserName, nodeConfig);
        }

        /// <summary>
        /// 回退项目
        /// </summary>
        /// <param name="wFSendObject"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Back")]
        public bool Back([FromBody] [Required]WFBackObject wFSendObject)
        {
            return iWFInstanceServer.Back(wFSendObject.WFInstanceId, wFSendObject.NodeInstanceId, wFSendObject.PreNodes, wFSendObject.Options, wFSendObject.UserName);
        }


        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
