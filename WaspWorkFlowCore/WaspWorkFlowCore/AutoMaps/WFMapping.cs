using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Models;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class WFMapping: Profile
    {
        public WFMapping()
        {
            CreateMap<WFLine, WFLineViewModel>()
                .ForMember(dest => dest.LineDefine,
                           opt => opt.ConvertUsing(new LineDefineFormatter(),src => src.LineJson)
                           );

            CreateMap<WFLineViewModel, WFLine>()
                .ForMember(dest => dest.LineJson,
                           opt => opt.ConvertUsing(new LineDefineToStringFormatter(), src => src.LineDefine));

            CreateMap<WFNode, WFNodeViewModel>()
                .ForMember(dest=>dest.NodeDefine,
                           opt=>opt.ConvertUsing(new NodeDefineFormatter(),src=>src.NodeJson));

            CreateMap<WFNodeViewModel, WFNode>()
                .ForMember(dest=>dest.NodeJson,
                            opt=>opt.ConvertUsing(new NodeDefineToStringFormatter(),src=>src.NodeDefine));

            CreateMap<WFNodeInstance, WFNodeInstanceViewModel>()
                .ForMember(dest => dest.NodeLogs,
                           opt => opt.ConvertUsing(new NodeInstanceFormatter(), src => src.ActionLogs));

            CreateMap<WFNodeInstanceViewModel, WFNodeInstance>()
                .ForMember(dest=>dest.ActionLogs,
                           opt=> opt.ConvertUsing(new NodeInstanceToStringFormatter(), src=>src.NodeLogs));

            CreateMap<WFInstance, WFInstanceViewModel>();
            CreateMap<WFInstanceViewModel, WFInstance>();

            CreateMap<WFTemplate, WFTemplateViewModel>();
            CreateMap<WFTemplateViewModel, WFTemplate>();
        }
    }
}
