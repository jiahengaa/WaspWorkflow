using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.IServer
{
    public interface IWFTemplateServer
    {

        /// <summary>
        /// 获取所有WF模板
        /// </summary>
        /// <returns></returns>
        List<WFTemplateViewModel> GetAllWFTemplate();

        /// <summary>
        /// 根据id获取单个流程详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        WFTemplateViewModel GetTemplateById(Guid id);

        /// <summary>
        ///  新增或者修改
        /// 
        /// 流程图设计过程中，Node的Id由设计器产生。也就是说Node更新步骤是检查数据库是否有该id，如果有则更新，没有则新增
        /// </summary>
        /// <param name="wFTemplateViewModel"></param>
        /// <returns></returns>
        WFTemplateViewModel AddOrUpdate(WFTemplateViewModel wFTemplateViewModel);
        /// <summary>
        /// 删除流程模板
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        bool DeleteWFTemplate(Guid Id);
    }
}
