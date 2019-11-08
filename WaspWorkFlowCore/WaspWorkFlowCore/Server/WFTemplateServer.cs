using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WaspWorkFlowCore.Core;
using WaspWorkFlowCore.Infra;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.Models;
using WaspWorkFlowCore.ViewModels;
using Z.EntityFramework.Plus;

namespace WaspWorkFlowCore.Server
{
    public class WFTemplateServer: IWFTemplateServer
    {
        private readonly WFContext wFContext;
        private readonly IWFPool iWFPool;
        private readonly IMapper mapper;
        public WFTemplateServer(WFContext wFContext, IWFPool iWFPool, IMapper mapper)
        {
            this.wFContext = wFContext;
            this.iWFPool = iWFPool;
            this.mapper = mapper;
            
        }

        /// <summary>
        /// 获取所有WF模板
        /// </summary>
        /// <returns></returns>
        public List<WFTemplateViewModel> GetAllWFTemplate()
        {
            List<WFTemplateViewModel> wfList = new List<WFTemplateViewModel>();

            var wfTemplateList = wFContext.WFTemplate.ToList();

            if(wfTemplateList == null || wfTemplateList.Count == 0)
            {
                return wfList;
            }

            var wfLineList = wFContext.WFLine.ToList();

            var wfLineVMList = mapper.Map<List<WFLineViewModel>>(wfLineList);

            var wfNodeList = wFContext.WFNode.ToList();

            var wfNodeVMList = mapper.Map<List<WFNodeViewModel>>(wfNodeList);

            var wfToolTips = wFContext.WFToolTip.ToList();
            foreach (var item in wfToolTips)
            {
                item.Id = item.TipId;
            }

            foreach (var wf in wfTemplateList)
            {
                var wfvm = mapper.Map<WFTemplate, WFTemplateViewModel>(wf);
                var lines = wfLineVMList.FindAll(p => p.WFId == wfvm.Id);
                var nodes = wfNodeVMList.FindAll(p => p.WFId == wfvm.Id);

                wfvm.Lines = lines;
                wfvm.Nodes = nodes;

                foreach(var node in wfvm.Nodes)
                {
                    node.InLines = wfvm.Lines.FindAll(p => p.LineDefine.ENodeId == node.NodeDefine.Id)?.Select(p=>p.LineDefine)?.ToList();
                    node.OutLines = wfvm.Lines.FindAll(p => p.LineDefine.SNodeId == node.NodeDefine.Id)?.Select(p => p.LineDefine)?.ToList();
                }

                var tips = wfToolTips.FindAll(p => p.WFId == wfvm.Id);
                wfvm.ToolTips = tips;
                wfList.Add(wfvm);
            }

            return wfList;
        }

        /// <summary>
        /// 根据id获取单个流程详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public WFTemplateViewModel GetTemplateById(Guid id)
        {
            var WFTemplate = wFContext.WFTemplate.FirstOrDefault(p => p.Id == id);

            if(WFTemplate == null)
            {
                return null;
            }

            var wfvm = mapper.Map<WFTemplate, WFTemplateViewModel>(WFTemplate);

            var wfLineList = wFContext.WFLine.Where(p=>p.WFId == id).ToList();

            wfvm.Lines = mapper.Map<List<WFLineViewModel>>(wfLineList);

            var wfNodeList = wFContext.WFNode.Where(p => p.WFId == id).ToList();

            wfvm.Nodes = mapper.Map<List<WFNodeViewModel>>(wfNodeList);

            foreach (var node in wfvm.Nodes)
            {
                node.InLines = wfvm.Lines.FindAll(p => p.LineDefine.ENodeId == node.NodeDefine.Id)?.Select(p => p.LineDefine)?.ToList();
                node.OutLines = wfvm.Lines.FindAll(p => p.LineDefine.SNodeId == node.NodeDefine.Id)?.Select(p => p.LineDefine)?.ToList();
            }

            var wfToolTips = wFContext.WFToolTip.Where(p => p.WFId == id).ToList();
            foreach(var item in wfToolTips)
            {
                item.Id = item.TipId;
            }
            wfvm.ToolTips = wfToolTips;

            return wfvm;
        }


        /// <summary>
        /// 新增或者修改
        /// 
        /// 流程图设计过程中，Node的Id由设计器产生。也就是说Node更新步骤是检查数据库是否有该id，如果有则更新，没有则新增
        /// 
        /// </summary>
        /// <param name="wFTemplateViewModel"></param>
        /// <returns></returns>
        public WFTemplateViewModel AddOrUpdate(WFTemplateViewModel wFTemplateViewModel)
        {
            try
            {
                if (wFTemplateViewModel.Id == new Guid())
                {
                    //新增
                    wFTemplateViewModel.CreateTime = TimeHelper.GetTimeStamp();
                    var model = wFContext.WFTemplate.Add(mapper.Map<WFTemplate>(wFTemplateViewModel));
      
                    wFTemplateViewModel = mapper.Map(model.Entity, wFTemplateViewModel);
                }
                else
                {
                    wFTemplateViewModel.UpdateTime = TimeHelper.GetTimeStamp();
                    var model = wFContext.WFTemplate.Update(mapper.Map<WFTemplate>(wFTemplateViewModel));

                    wFTemplateViewModel = mapper.Map(model.Entity, wFTemplateViewModel);
                }

                //先删除掉所有节点
                wFContext.WFNode.Where(p => p.WFId == wFTemplateViewModel.Id).Delete();
                if (wFTemplateViewModel.Nodes != null)
                {
                    //然后新增所有节点
                    for (int i = 0; i < wFTemplateViewModel.Nodes.Count; i++)
                    {
                        wFTemplateViewModel.Nodes[i].WFId = wFTemplateViewModel.Id;
                        var item = mapper.Map<WFNodeViewModel, WFNode>(wFTemplateViewModel.Nodes[i]);
                        item.Id = new Guid();
                        var model = wFContext.WFNode.Add(item);

                        wFTemplateViewModel.Nodes[i] = mapper.Map(model.Entity, wFTemplateViewModel.Nodes[i]);
                    }
                }

                wFContext.WFLine.Where(p => p.WFId == wFTemplateViewModel.Id).Delete();

                if (wFTemplateViewModel.Lines != null)
                {

                    for (int i = 0; i < wFTemplateViewModel.Lines.Count; i++)
                    {
                        wFTemplateViewModel.Lines[i].WFId = wFTemplateViewModel.Id;
                        var item = mapper.Map<WFLine>(wFTemplateViewModel.Lines[i]);
                        item.LineId = wFTemplateViewModel.Lines[i].LineDefine.Id;
                        item.Id = new Guid();
                        var model = wFContext.WFLine.Add(item);

                        wFTemplateViewModel.Lines[i] = mapper.Map(model.Entity, wFTemplateViewModel.Lines[i]);
                    }
                }

                wFContext.WFToolTip.Where(p => p.WFId == wFTemplateViewModel.Id).Delete();

                if (wFTemplateViewModel.ToolTips != null)
                {
                    for (int i = 0; i < wFTemplateViewModel.ToolTips.Count; i++)
                    {
                        wFTemplateViewModel.ToolTips[i].WFId = wFTemplateViewModel.Id;
                        wFTemplateViewModel.ToolTips[i].TipId = wFTemplateViewModel.ToolTips[i].Id;
                        wFTemplateViewModel.ToolTips[i].Id = new Guid();
                        var model = wFContext.WFToolTip.Add(wFTemplateViewModel.ToolTips[i]);

                    }
                }
                wFContext.BulkSaveChanges();
                return wFTemplateViewModel;
            }
            catch (Exception ex)
            {

            }

            return null;
        }

        /// <summary>
        /// 删除流程模板
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public bool DeleteWFTemplate(Guid Id)
        {
            using (var trs = wFContext.Database.BeginTransaction())
            {
                try
                {
                    wFContext.WFTemplate.Where(p => p.Id == Id).Delete();
                    wFContext.WFNode.Where(p => p.WFId == Id).Delete();
                    wFContext.WFLine.Where(p => p.WFId == Id).Delete();
                    trs.Commit();
                }
                catch(Exception ex)
                {
                    trs.Rollback();
                }

            }
            return true;
        }

    }
}
