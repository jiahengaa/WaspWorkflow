using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WaspWorkFlowCore.Models;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.IServer
{
    /// <summary>
    /// 工作流服务
    /// </summary>
    public interface IWFInstanceServer
    {
        /// <summary>
        /// 初始化工作流实例到内存
        /// </summary>
        void InitWFInstances();

        /// <summary>
        /// 根据模板创建空白的流程实例
        /// </summary>
        /// <param name="templateId"></param>
        /// <returns></returns>
        WFInstanceViewModel GetWFWhiteByTemplate(Guid templateId);
        /// <summary>
        /// 根据wf实例获取wf实例详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        WFInstanceViewModel GetWFInstanceById(Guid id);
        /// <summary>
        /// 根据业务单据获取流程信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        WFInstanceViewModel GetWFInstanceByBId(Guid id);
        /// <summary>
        /// 新增工作流实例
        /// 将实例存入运行实例池
        /// 将实例信息入库
        /// </summary>
        /// <returns></returns>
        WFInstanceViewModel CreateWFInstance(WFInstanceViewModel wFInstanceViewModel, Guid userId, string userName);

        /// <summary>
        /// 送审
        /// </summary>
        /// <typeparam name="T">送审的单据信息类型</typeparam>
        /// <param name="wfInstanceId">流程实例id</param>
        /// <param name="nodeInstanceId">当前操作节点id</param>
        /// <param name="bussiness">送审的单据</param>
        /// <param name="opinions">意见</param>
        /// <returns></returns>
        Task<bool> Send<T>(Guid wfInstanceId, Guid nodeInstanceId, T bussiness, string opinions, string userName, Dictionary<Guid, Tuple<Guid, string>> nextNodeUserConfig);
        /// <summary>
        /// 送审
        /// </summary>
        /// <typeparam name="T">送审的单据信息类型</typeparam>
        /// <param name="wfInstanceId">流程实例id</param>
        /// <param name="nodeInstanceId">当前操作节点id</param>
        /// <param name="bussiness">送审的单据</param>
        /// <param name="opinions">意见</param>
        /// <returns></returns>
        Task<bool> Send(Guid wfInstanceId, Guid nodeInstanceId, object bussiness, string opinions, string userName, Dictionary<Guid, Tuple<Guid, string>> nextNodeUserConfig);
        /// <summary>
        /// 回退
        /// </summary>
        /// <param name="wfInstanceId">当前流程id</param>
        /// <param name="nodeInstanceId">当前操作节点</param>
        /// <param name="preNodesId">被退回的节点</param>
        /// <param name="options">意见</param>
        /// <param name="userName">操作人名称</param>
        /// <returns></returns>
        bool Back(Guid wfInstanceId, Guid nodeInstanceId, List<Guid> preNodesId, string options, string userName);

        /// <summary>
        /// 挂起
        /// </summary>
        /// <param name="wfInstanceId"></param>
        /// <param name="nodeInstanceId"></param>
        /// <param name="options"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        bool Suspend(Guid wfInstanceId, Guid nodeInstanceId, string options, string userName);

        /// <summary>
        /// 取消挂起，恢复成待处理
        /// </summary>
        /// <param name="wfInstanceId"></param>
        /// <param name="nodeInstanceId"></param>
        /// <param name="options"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        bool UnSuspend(Guid wfInstanceId, Guid nodeInstanceId, string options, string userName);

        /// <summary>
        /// 获取用户创建的所有单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetCreatedWFsByUserId(Guid userId);

        /// <summary>
        /// 获取所有待送审单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetWaitSendWFsByUserId(Guid userId);

        /// <summary>
        /// 获取所有已挂起的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetSuspendWFsByUserId(Guid userId);

        /// <summary>
        /// 获取所有已结束的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetCompletedWFsByUserId(Guid userId);

        /// <summary>
        /// 获取所有已送审的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetSentWFsByUserId(Guid userId);

        /// <summary>
        /// 获取当前用户退回的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetBackSentWFsByUserId(Guid userId);

        /// <summary>
        /// 获取所有已被退回的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        List<WFNodeInstance> GetBeBackSentWFsByUserId(Guid userId);
    }
}
