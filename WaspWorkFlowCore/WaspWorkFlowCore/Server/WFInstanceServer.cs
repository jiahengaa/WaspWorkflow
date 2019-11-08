using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WaspWorkFlowCore.Core;
using WaspWorkFlowCore.Infra;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.Models;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.Server
{
    public class WFInstanceServer: IWFInstanceServer
    {
        private readonly WFContext wFContext;
        private readonly IWFPool iWFPool;
        private readonly IMapper mapper;
        private readonly IWFTemplateServer templateServer;
        private readonly IConditionJudger judger;
        public WFInstanceServer(WFContext wFContext, IWFPool iWFPool, IMapper mapper,IWFTemplateServer templateServer, IConditionJudger judger)
        {
            this.wFContext = wFContext;
            this.iWFPool = iWFPool;
            this.mapper = mapper;
            this.templateServer = templateServer;
            this.judger = judger;
        }

        /// <summary>
        /// 初始化工作流实例到内存
        /// </summary>
        public void InitWFInstances()
        {
            var wfLines = wFContext.WFLine.ToList();
            var wfLineVMList = this.mapper.Map<List<WFLine>, List<WFLineViewModel>>(wfLines);
            var wfNodes = wFContext.WFNode.ToList();
            var wfNodeVMList = this.mapper.Map<List<WFNode>, List<WFNodeViewModel>>(wfNodes);

            var wfNodeInstances = wFContext.WFNodeInstance.ToList();
            var wfNodeInstanceVMList = this.mapper.Map<List<WFNodeInstance>, List<WFNodeInstanceViewModel>>(wfNodeInstances);

            var wfInstances = wFContext.WFInstance.ToList();
            var wfInstanceVMList = this.mapper.Map<List<WFInstance>, List<WFInstanceViewModel>>(wfInstances);

            if (wfInstanceVMList != null) 
            { 
                foreach(var wf in wfInstanceVMList)
                {
                    var nodeInstances = wfNodeInstanceVMList.FindAll(p => p.WFInstanceId == wf.Id);
                    if(nodeInstances != null)
                    {
                        //补偿配置信息
                        foreach(var item in nodeInstances)
                        {
                            var wfNode = wfNodeVMList?.FirstOrDefault(p => p.NodeDefine.Id == item.WFNodeId);
                            item.NodeDefine = wfNode?.NodeDefine;

                            item.InLines = wfLineVMList.FindAll(p=>p.LineDefine.ENodeId == item.WFNodeId && p.WFId == item.WFId).Select(p=>p.LineDefine).ToList();
                            item.OutLines = wfLineVMList.FindAll(p => p.LineDefine.SNodeId == item.WFNodeId && p.WFId == item.WFId).Select(p => p.LineDefine).ToList();
                        }
                    }

                    wf.Nodes = nodeInstances;

                    //Todo：工作流实例的条件线信息定义
                    wf.Lines = wfLineVMList.FindAll(p => p.WFId == wf.WFId);

                    if (!iWFPool.WFs.ContainsKey(wf.Id))
                    {
                        iWFPool.WFs.TryAdd(wf.Id, wf);
                    }
                }
            }
        }

        /// <summary>
        /// 根据模板创建空白的流程实例
        /// </summary>
        /// <param name="templateId"></param>
        /// <returns></returns>
        public WFInstanceViewModel GetWFWhiteByTemplate(Guid templateId)
        {
            var wfTemplate = templateServer.GetTemplateById(templateId);
            var instance = new WFInstanceViewModel();
            instance.BId = new Guid();
            instance.BType = "";
            
            instance.Id = new Guid();
            instance.WFId = templateId;
            instance.Lines = wfTemplate.Lines;
            instance.Nodes = new List<WFNodeInstanceViewModel>();

            if(wfTemplate.Nodes != null)
            {
                foreach(var item in wfTemplate.Nodes)
                {
                    var nodeInstance = new WFNodeInstanceViewModel();
                    nodeInstance.Id = new Guid();
                    nodeInstance.ActionLogs = "";
                    nodeInstance.BType = "";
                    nodeInstance.BId = new Guid();
                    nodeInstance.WFId = templateId;
                    nodeInstance.InLines = item.InLines;
                    nodeInstance.OutLines = item.OutLines;
                    nodeInstance.State =  WFState.Undefine;
                    nodeInstance.WFInstanceId = instance.Id;
                    nodeInstance.WFNodeId = item.NodeDefine.Id;
                    nodeInstance.NodeDefine = item.NodeDefine;
                    nodeInstance.NodeLogs = new List<NodeActionLog>();
                    nodeInstance.UserId = string.IsNullOrEmpty(nodeInstance.NodeDefine.UserId)? new Guid():new Guid(nodeInstance.NodeDefine.UserId);
                    nodeInstance.UserName = string.IsNullOrEmpty(nodeInstance.NodeDefine.UserId) ?"": nodeInstance.NodeDefine.UserName;

                    instance.Nodes.Add(nodeInstance);
                }
            }

            return instance;
        }

        public WFInstanceViewModel GetWFInstanceById(Guid id)
        {
            WFInstanceViewModel wFInstance;
            if( iWFPool.WFs.TryGetValue(id,out wFInstance))
            {
                return wFInstance;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// 根据业务单据获取流程信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public WFInstanceViewModel GetWFInstanceByBId(Guid id)
        {
            try
            {
                return iWFPool.WFs.FirstOrDefault(p => p.Value.BId == id).Value;
            }
            catch(Exception ex)
            {
                return null;
            }

        }

        /// <summary>
        /// 新增工作流实例
        /// 将实例存入运行实例池
        /// 将实例信息入库
        /// </summary>
        /// <returns></returns>
        public WFInstanceViewModel CreateWFInstance(WFInstanceViewModel  wFInstanceViewModel,Guid userId,string userName)
        {
            wFInstanceViewModel.Id = new Guid();

            if(wFInstanceViewModel.BId == new Guid())
            {
                throw new Exception("关联单据必填");
            }

            if(string.IsNullOrWhiteSpace(wFInstanceViewModel.BType))
            {
                throw new Exception("单据类型必填");
            }

            if(wFInstanceViewModel.WFId == new Guid())
            {
                throw new Exception("流程模板必填");
            }

            var wfTemplate = GetWFWhiteByTemplate(wFInstanceViewModel.WFId);

            if(wfTemplate == null)
            {
                return null;
            }

            //判断该单据是否已经参与流程管理，如果参与了，则不允许再创建新的流程。

            var wfInstance = mapper.Map<WFInstance>(wFInstanceViewModel);
            wfInstance.Id = Guid.NewGuid();
            wFContext.WFInstance.BulkInsert(new List<WFInstance> { wfInstance });
            wFInstanceViewModel = mapper.Map(wfInstance, wFInstanceViewModel);
            Guid nextNodeId = new Guid();

            var startNode = wFInstanceViewModel.Nodes.FirstOrDefault(p => NodeType.Start == p.NodeDefine.NodeType);
            if (startNode != null)
            {
                startNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.Create,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = "",
                    UserName = userName
                });
                startNode.State = WFState.Created;
                startNode.UserId = userId;
                startNode.BId = wFInstanceViewModel.BId;
                startNode.BType = wFInstanceViewModel.BType;
                startNode.WFInstanceId = wfInstance.Id;
                startNode.WFId = wFInstanceViewModel.WFId;

                nextNodeId = startNode.OutLines[0].ENodeId;

                var nodeInstance = mapper.Map<WFNodeInstance>(startNode);
                nodeInstance.Id = Guid.NewGuid();
                wFContext.WFNodeInstance.BulkInsert(new List<WFNodeInstance> { nodeInstance });
                startNode = mapper.Map(nodeInstance, startNode);
            }
            else
            {
                throw new Exception("开始节点未定义，请联系管理员~");
            }

            for (int i = 0; i < wFInstanceViewModel.Nodes.Count; i++)
            {
                if (wFInstanceViewModel.Nodes[i].NodeDefine.NodeType != NodeType.Start)
                {
                    wFInstanceViewModel.Nodes[i].Id = new Guid();
                    wFInstanceViewModel.Nodes[i].NodeLogs = new List<NodeActionLog>();

                    if (wFInstanceViewModel.Nodes[i].WFNodeId == nextNodeId)
                    {
                        if (wFInstanceViewModel.Nodes[i].UserId == new Guid() && string.IsNullOrEmpty(wFInstanceViewModel.Nodes[i].NodeDefine.UserId))
                        {
                            wFInstanceViewModel.Nodes[i].UserId = userId;
                            wFInstanceViewModel.Nodes[i].UserName = userName;
                        }

                        wFInstanceViewModel.Nodes[i].State = WFState.WaitSend;
                        wFInstanceViewModel.Nodes[i].WFInstanceId = wfInstance.Id;
                        wFInstanceViewModel.Nodes[i].BId = wFInstanceViewModel.BId;
                        wFInstanceViewModel.Nodes[i].BType = wFInstanceViewModel.BType;
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(wFInstanceViewModel.Nodes[i].NodeDefine.UserId))
                        {
                            wFInstanceViewModel.Nodes[i].UserId = new Guid();
                            wFInstanceViewModel.Nodes[i].UserName = "";
                        }
                        else
                        {
                            wFInstanceViewModel.Nodes[i].UserId = new Guid(wFInstanceViewModel.Nodes[i].NodeDefine.UserId);
                            wFInstanceViewModel.Nodes[i].UserName = wFInstanceViewModel.Nodes[i].NodeDefine.UserName;
                        }
                        wFInstanceViewModel.Nodes[i].State = WFState.Undefine;

                        wFInstanceViewModel.Nodes[i].WFInstanceId = wfInstance.Id;
                        wFInstanceViewModel.Nodes[i].BId = wFInstanceViewModel.BId;
                        wFInstanceViewModel.Nodes[i].BType = wFInstanceViewModel.BType;

                    }
                    var nodeInstance = mapper.Map<WFNodeInstance>(wFInstanceViewModel.Nodes[i]);
                    nodeInstance.Id = Guid.NewGuid();
                    wFContext.WFNodeInstance.BulkInsert(new List<WFNodeInstance> { nodeInstance });
                    wFInstanceViewModel.Nodes[i] = mapper.Map(nodeInstance, wFInstanceViewModel.Nodes[i]);
                }

            }

            if (!iWFPool.WFs.TryAdd(wFInstanceViewModel.Id, wFInstanceViewModel))
            {
                return null;
            }

            return wFInstanceViewModel;
        }

        /// <summary>
        /// 送审
        /// </summary>
        /// <typeparam name="T">送审的单据信息类型</typeparam>
        /// <param name="wfInstanceId">流程实例id</param>
        /// <param name="nodeInstanceId">当前操作节点id</param>
        /// <param name="bussiness">送审的单据</param>
        /// <param name="opinions">意见</param>
        /// <returns></returns>
        public async Task<bool> Send<T>(Guid wfInstanceId, Guid nodeInstanceId, T bussiness, string opinions, string userName,Dictionary<Guid,Tuple<Guid,string>> nextNodeUserConfig)
        {
            var wf = GetWFInstanceById(wfInstanceId);
            if (wf == null)
            {
                return false;
            }

            //找出节点，找出输出线，计算输出
            var curNode = wf.Nodes.FirstOrDefault(p => p.Id == nodeInstanceId);
            if (curNode == null)
            {
                return false;
            }

            if (curNode.State == WFState.WaitSend ||
               curNode.State == WFState.BeBackSent)
            {
                //找出当前节点，更改状态记录日志
                curNode.State = WFState.Sent;
                if (curNode.NodeLogs == null)
                {
                    curNode.NodeLogs = new List<NodeActionLog>();
                }

                curNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.Send,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = opinions,
                    UserName = userName
                });

                //计算输出条件
                var outlines = curNode.OutLines;

                if (outlines == null || outlines.Count == 0)
                {
                    throw new Exception("下一节点未正确配置，请联系管理员！");
                }

                foreach (var item in outlines)
                {
                    //todo:扩充权限字段
                    var state = await judger.Predicte(item.ConditionFuncStr, bussiness);
                    if (state)
                    {
                        //判断下一节点是否为ConditionNode，如果是，则进行多条件计算判断操作
                        //如果不是，则直接更改下一节点状态
                        var nextNode = wf.Nodes.FirstOrDefault(p => p.WFNodeId == item.ENodeId);
                        
                        if (nextNode.NodeDefine.NodeType == NodeType.Condition)
                        {
                            var nextOutLines = nextNode.OutLines;
                            if (nextOutLines == null || nextOutLines.Count == 0)
                            {
                                throw new Exception("下一节点未正确配置，请联系管理员！");
                            }

                            //查找该分流聚合节点所有入线的起始节点是否已完成审核，如果完成，则加入到已完成线的集合

                            var finishedInLines = new List<long>();
                            finishedInLines.Add(item.NodeCode);

                            nextNode.InLines.ForEach(line =>
                            {
                                if (wf.Nodes.FirstOrDefault(p => p.WFNodeId == line.SNodeId).State == WFState.Sent)
                                {
                                    finishedInLines.Add(line.NodeCode);
                                }
                            });

                            finishedInLines = finishedInLines.Distinct().ToList();

                            foreach (var line in nextOutLines)
                            {
                                if (await judger.Predicte(line.ConditionFuncStr, bussiness, finishedInLines))
                                {
                                    var nextAuditNode = wf.Nodes.FirstOrDefault(p => p.WFNodeId == line.ENodeId);
                                    nextAuditNode.State = WFState.WaitSend;
                                    nextAuditNode.BId = wf.BId;
                                    nextAuditNode.BType = wf.BType;
                                    //说明此节点没有配置审核人员
                                    if(nextAuditNode.UserId == null|| nextAuditNode.UserId == new Guid())
                                    {
                                        if(!nextNodeUserConfig.ContainsKey(nextAuditNode.Id))
                                        {
                                            throw new Exception("下一节点未配置审核人员，请配置");
                                        }
                                        else
                                        {
                                            nextAuditNode.UserId = nextNodeUserConfig[nextAuditNode.Id].Item1;
                                            nextAuditNode.UserName = nextNodeUserConfig[nextAuditNode.Id].Item2;
                                        }
                                    }
                                    else
                                    {
                                        //如果先前配置了，但是配置错了，后面需要更改
                                        if (string.IsNullOrWhiteSpace(nextAuditNode.NodeDefine.UserId))
                                        {
                                            if (nextNodeUserConfig.ContainsKey(nextAuditNode.Id))
                                            {
                                                nextAuditNode.UserId = nextNodeUserConfig[nextAuditNode.Id].Item1;
                                                nextAuditNode.UserName = nextNodeUserConfig[nextAuditNode.Id].Item2;
                                            }
                                        }
                                        else
                                        {
                                            //说明模板配置过的，则不允许更改
                                        }
                                    }
                                }
                            }
                        }
                        else if (nextNode.NodeDefine.NodeType == NodeType.Audit)
                        {
                            if(nextNode.UserId == null || nextNode.UserId == new Guid())
                            {
                                if (!nextNodeUserConfig.ContainsKey(nextNode.Id))
                                {
                                    throw new Exception("下一节点未配置审核人员，请配置");
                                }
                                else
                                {
                                    nextNode.UserId = nextNodeUserConfig[nextNode.Id].Item1;
                                    nextNode.UserName = nextNodeUserConfig[nextNode.Id].Item2;
                                }
                            }
                            else
                            {
                                //如果先前配置了，但是配置错了，后面需要更改
                                if (string.IsNullOrWhiteSpace(nextNode.NodeDefine.UserId))
                                {
                                    if (nextNodeUserConfig.ContainsKey(nextNode.Id))
                                    {
                                        nextNode.UserId = nextNodeUserConfig[nextNode.Id].Item1;
                                        nextNode.UserName = nextNodeUserConfig[nextNode.Id].Item2;
                                    }
                                }
                                else
                                {
                                    //说明模板配置过的，则不允许更改
                                }
                            }

                            nextNode.State = WFState.WaitSend;
                            if (nextNode.NodeLogs == null)
                            {
                                nextNode.NodeLogs = new List<NodeActionLog>();
                            }
                        }
                        else if (nextNode.NodeDefine.NodeType == NodeType.End)
                        {
                            nextNode.State = WFState.Completed;
                            //所有有日志的节点上，状态都更改为已完成
                            wf.Nodes.ForEach(p =>
                            {
                                if (p.NodeLogs != null && p.NodeLogs.Count > 0)
                                {
                                    p.State = WFState.Completed;
                                }
                            });
                        }
                    }
                }
            }
            else
            {
                return false;
            }

            //更新流程到流程池，到数据库
            //只有节点信息需要更新

            for (int i = 0; i < wf.Nodes.Count; i++)
            {
                var node = mapper.Map<WFNodeInstance>(wf.Nodes[i]);
                node = wFContext.WFNodeInstance.Add(node).Entity;
                wf.Nodes[i] = mapper.Map(node, wf.Nodes[i]);
            }

            WFInstanceViewModel oldWF;
            if (!iWFPool.WFs.TryRemove(wf.Id, out oldWF))
            {
                return false;
            }
            else
            {
                if (!iWFPool.WFs.TryAdd(wf.Id, wf))
                {
                    return false;
                }
            }

            wFContext.BulkSaveChanges();

            return true;
        }

        /// <summary>
        /// 送审
        /// </summary>
        /// <typeparam name="T">送审的单据信息类型</typeparam>
        /// <param name="wfInstanceId">流程实例id</param>
        /// <param name="nodeInstanceId">当前操作节点id</param>
        /// <param name="bussiness">送审的单据</param>
        /// <param name="opinions">意见</param>
        /// <returns></returns>
        public async Task<bool> Send(Guid wfInstanceId, Guid nodeInstanceId, object bussiness, string opinions, string userName, Dictionary<Guid, Tuple<Guid, string>> nextNodeUserConfig)
        {
            var wf = GetWFInstanceById(wfInstanceId);
            if (wf == null)
            {
                return false;
            }

            //找出节点，找出输出线，计算输出
            var curNode = wf.Nodes.FirstOrDefault(p => p.Id == nodeInstanceId);
            if (curNode == null)
            {
                return false;
            }

            if (curNode.State == WFState.WaitSend ||
               curNode.State == WFState.BeBackSent)
            {
                //找出当前节点，更改状态记录日志
                curNode.State = WFState.Sent;
                if (curNode.NodeLogs == null)
                {
                    curNode.NodeLogs = new List<NodeActionLog>();
                }

                curNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.Send,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = opinions,
                    UserName = userName
                });

                //计算输出条件
                var outlines = curNode.OutLines;

                if (outlines == null || outlines.Count == 0)
                {
                    throw new Exception("下一节点未正确配置，请联系管理员！");
                }

                foreach (var item in outlines)
                {
                    //todo:扩充权限字段
                    var state = await judger.Predicte(item.ConditionFuncStr, bussiness);
                    if (state)
                    {
                        //判断下一节点是否为ConditionNode，如果是，则进行多条件计算判断操作
                        //如果不是，则直接更改下一节点状态
                        var nextNode = wf.Nodes.FirstOrDefault(p => p.WFNodeId == item.ENodeId);

                        if (nextNode.NodeDefine.NodeType == NodeType.Condition)
                        {
                            var nextOutLines = nextNode.OutLines;
                            if (nextOutLines == null || nextOutLines.Count == 0)
                            {
                                throw new Exception("下一节点未正确配置，请联系管理员！");
                            }

                            //查找该分流聚合节点所有入线的起始节点是否已完成审核，如果完成，则加入到已完成线的集合

                            var finishedInLines = new List<long>();
                            finishedInLines.Add(item.NodeCode);

                            nextNode.InLines.ForEach(line =>
                            {
                                if (wf.Nodes.FirstOrDefault(p => p.WFNodeId == line.SNodeId).State == WFState.Sent)
                                {
                                    finishedInLines.Add(line.NodeCode);
                                }
                            });

                            finishedInLines = finishedInLines.Distinct().ToList();

                            foreach (var line in nextOutLines)
                            {
                                if (await judger.Predicte(line.ConditionFuncStr, bussiness, finishedInLines))
                                {
                                    var nextAuditNode = wf.Nodes.FirstOrDefault(p => p.WFNodeId == line.ENodeId);
                                    nextAuditNode.State = WFState.WaitSend;
                                    nextAuditNode.BId = wf.BId;
                                    nextAuditNode.BType = wf.BType;
                                    //说明此节点没有配置审核人员
                                    if (nextAuditNode.UserId == null || nextAuditNode.UserId == new Guid())
                                    {
                                        if (!nextNodeUserConfig.ContainsKey(nextAuditNode.Id))
                                        {
                                            throw new Exception("下一节点未配置审核人员，请配置");
                                        }
                                        else
                                        {
                                            nextAuditNode.UserId = nextNodeUserConfig[nextAuditNode.Id].Item1;
                                            nextAuditNode.UserName = nextNodeUserConfig[nextAuditNode.Id].Item2;
                                        }
                                    }
                                    else
                                    {
                                        //如果先前配置了，但是配置错了，后面需要更改
                                        if (string.IsNullOrWhiteSpace(nextAuditNode.NodeDefine.UserId))
                                        {
                                            if (nextNodeUserConfig.ContainsKey(nextAuditNode.Id))
                                            {
                                                nextAuditNode.UserId = nextNodeUserConfig[nextAuditNode.Id].Item1;
                                                nextAuditNode.UserName = nextNodeUserConfig[nextAuditNode.Id].Item2;
                                            }
                                        }
                                        else
                                        {
                                            //说明模板配置过的，则不允许更改
                                        }
                                    }
                                }
                            }
                        }
                        else if (nextNode.NodeDefine.NodeType == NodeType.Audit)
                        {
                            
                            if (nextNode.UserId == null || nextNode.UserId == new Guid())
                            {
                                if (!nextNodeUserConfig.ContainsKey(nextNode.Id))
                                {
                                    throw new Exception("下一节点未配置审核人员，请配置");
                                }
                                else
                                {
                                    nextNode.UserId = nextNodeUserConfig[nextNode.Id].Item1;
                                    nextNode.UserName = nextNodeUserConfig[nextNode.Id].Item2;
                                }
                            }
                            else
                            {
                                //如果先前配置了，但是配置错了，后面需要更改
                                if (string.IsNullOrWhiteSpace(nextNode.NodeDefine.UserId))
                                {
                                    if (nextNodeUserConfig.ContainsKey(nextNode.Id))
                                    {
                                        nextNode.UserId = nextNodeUserConfig[nextNode.Id].Item1;
                                        nextNode.UserName = nextNodeUserConfig[nextNode.Id].Item2;
                                    }
                                }
                                else
                                {
                                    //说明模板配置过的，则不允许更改
                                }
                            }

                            nextNode.State = WFState.WaitSend;
                            if (nextNode.NodeLogs == null)
                            {
                                nextNode.NodeLogs = new List<NodeActionLog>();
                            }
                        }
                        else if (nextNode.NodeDefine.NodeType == NodeType.End)
                        {
                            nextNode.State = WFState.Completed;
                            //所有有日志的节点上，状态都更改为已完成
                            wf.Nodes.ForEach(p =>
                            {
                                p.State = WFState.Completed;
                            });
                        }
                    }
                }
            }
            else
            {
                return false;
            }

            try
            {
                //只有节点信息需要更新

                for (int i = 0; i < wf.Nodes.Count; i++)
                {
                    var node = mapper.Map<WFNodeInstance>(wf.Nodes[i]);
                    node = wFContext.WFNodeInstance.Update(node).Entity;
                    wf.Nodes[i] = mapper.Map(node, wf.Nodes[i]);
                }

                WFInstanceViewModel oldWF;
                if (!iWFPool.WFs.TryRemove(wf.Id, out oldWF))
                {
                    return false;
                }
                else
                {
                    if (!iWFPool.WFs.TryAdd(wf.Id, wf))
                    {
                        return false;
                    }
                }

                wFContext.BulkSaveChanges();

            }
            catch (Exception ex)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// 回退
        /// </summary>
        /// <param name="wfInstanceId">当前流程id</param>
        /// <param name="nodeInstanceId">当前操作节点</param>
        /// <param name="preNodesId">被退回的节点</param>
        /// <param name="options">意见</param>
        /// <param name="userName">操作人名称</param>
        /// <returns></returns>
        public bool Back(Guid wfInstanceId, Guid nodeInstanceId, List<Guid> preNodesId, string options, string userName)
        {
            var wf = GetWFInstanceById(wfInstanceId);
            if (wf == null)
            {
                return false;
            }

            var curNode = wf.Nodes.FirstOrDefault(p => p.Id == nodeInstanceId);
            if (curNode == null)
            {
                return false;
            }

            if (preNodesId == null || preNodesId.Count == 0)
            {
                throw new Exception("退回的节点不存在！");
            }


            //只有带送审和被驳回的单据，也就是待处理的单据，才能进行驳回。挂起的的单据是不能直接驳回的，只能恢复到待送审状态后才能用作驳回
            //注意：聚合节点的退回，要查看上一节点是否有最新一条记录为sent，如果没有，则不能送到该节点，驳回时，在选节点时UI界面要禁用掉对应节点
            if (curNode.State == WFState.WaitSend ||
               curNode.State == WFState.BeBackSent)
            {
                curNode.State = WFState.BackSent;
                if (curNode.NodeLogs == null)
                {
                    curNode.NodeLogs = new List<NodeActionLog>();
                }

                curNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.Back,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = options,
                    UserName = userName
                });

                for (int i = 0; i < preNodesId.Count; i++)
                {
                    var preNode = wf.Nodes.FirstOrDefault(p => p.NodeDefine.Id == preNodesId[i]);
                    if (preNode == null)
                    {
                        throw new Exception("退回的节点不存在！");
                    }
                    preNode.State = WFState.BeBackSent;
                }
            }
            else
            {
                //其他情况不允许做此操作
                return false;
            }

            try
            {
                //只有节点信息需要更新

                for (int i = 0; i < wf.Nodes.Count; i++)
                {
                    var node = mapper.Map<WFNodeInstance>(wf.Nodes[i]);
                    node = wFContext.WFNodeInstance.Update(node).Entity;
                    wf.Nodes[i] = mapper.Map(node, wf.Nodes[i]);
                }

                WFInstanceViewModel oldWF;
                if (!iWFPool.WFs.TryRemove(wf.Id, out oldWF))
                {
                    return false;
                }
                else
                {
                    if (!iWFPool.WFs.TryAdd(wf.Id, wf))
                    {
                        return false;
                    }
                }


                wFContext.BulkSaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// 挂起
        /// </summary>
        /// <param name="wfInstanceId"></param>
        /// <param name="nodeInstanceId"></param>
        /// <param name="options"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public bool Suspend(Guid wfInstanceId,Guid nodeInstanceId, string options, string userName)
        {
            var wf = GetWFInstanceById(wfInstanceId);
            if (wf == null)
            {
                return false;
            }

            var curNode = wf.Nodes.FirstOrDefault(p => p.Id == nodeInstanceId);
            if (curNode == null)
            {
                return false;
            }

            if (curNode.State == WFState.WaitSend ||
               curNode.State == WFState.BeBackSent)
            {
                curNode.State = WFState.Suspend;
                if (curNode.NodeLogs == null)
                {
                    curNode.NodeLogs = new List<NodeActionLog>();
                }

                curNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.Suspend,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = options,
                    UserName = userName
                });
            }
            else
            {
                //其他情况不允许做此操作
                return false;
            }

            try
            {
                //只有节点信息需要更新

                for (int i = 0; i < wf.Nodes.Count; i++)
                {
                    var node = mapper.Map<WFNodeInstance>(wf.Nodes[i]);
                    node = wFContext.WFNodeInstance.Update(node).Entity;
                    wf.Nodes[i] = mapper.Map(node, wf.Nodes[i]);
                }

                WFInstanceViewModel oldWF;
                if (!iWFPool.WFs.TryRemove(wf.Id, out oldWF))
                {
                    return false;
                }
                else
                {
                    if (!iWFPool.WFs.TryAdd(wf.Id, wf))
                    {
                        return false;
                    }
                }


                wFContext.BulkSaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// 取消挂起，恢复成待处理
        /// </summary>
        /// <param name="wfInstanceId"></param>
        /// <param name="nodeInstanceId"></param>
        /// <param name="options"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public bool UnSuspend(Guid wfInstanceId, Guid nodeInstanceId, string options, string userName)
        {
            var wf = GetWFInstanceById(wfInstanceId);
            if (wf == null)
            {
                return false;
            }

            var curNode = wf.Nodes.FirstOrDefault(p => p.Id == nodeInstanceId);
            if (curNode == null)
            {
                return false;
            }

            if (curNode.State == WFState.WaitSend ||
               curNode.State == WFState.BeBackSent)
            {
                curNode.State = WFState.WaitSend;
                if (curNode.NodeLogs == null)
                {
                    curNode.NodeLogs = new List<NodeActionLog>();
                }

                curNode.NodeLogs.Add(new NodeActionLog()
                {
                    Action = WFOperation.UnSuspend,
                    OperateTime = TimeHelper.GetTimeStamp(),
                    Opinions = options,
                    UserName = userName
                });
            }
            else
            {
                //其他情况不允许做此操作
                return false;
            }

            try
            {
                //只有节点信息需要更新

                for (int i = 0; i < wf.Nodes.Count; i++)
                {
                    var node = mapper.Map<WFNodeInstance>(wf.Nodes[i]);
                    node = wFContext.WFNodeInstance.Update(node).Entity;
                    wf.Nodes[i] = mapper.Map(node, wf.Nodes[i]);
                }

                WFInstanceViewModel oldWF;
                if (!iWFPool.WFs.TryRemove(wf.Id, out oldWF))
                {
                    return false;
                }
                else
                {
                    if (!iWFPool.WFs.TryAdd(wf.Id, wf))
                    {
                        return false;
                    }
                }


                wFContext.BulkSaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// 获取用户创建的所有单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetCreatedWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && p.State == WFState.Created).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取所有待送审单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetWaitSendWFsByUserId (Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.WaitSend || p.State == WFState.BeBackSent)).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取所有已挂起的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetSuspendWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.Suspend)).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取所有已结束的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetCompletedWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.Completed)).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取所有已送审的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetSentWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.Sent)).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取当前用户退回的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetBackSentWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.BackSent)).ToList();
            return nodes;
        }

        /// <summary>
        /// 获取所有已被退回的单据
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<WFNodeInstance> GetBeBackSentWFsByUserId(Guid userId)
        {
            var nodes = wFContext.WFNodeInstance.Where(p => p.UserId == userId && (p.State == WFState.BeBackSent)).ToList();
            return nodes;
        }
    }
}
