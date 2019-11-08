using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{

    public class NodeDefineFormatter : IValueConverter<string, NodeDefine>
    {
        public NodeDefine Convert(string sourceMember, ResolutionContext context)
        {
            return JsonConvert.DeserializeObject<NodeDefine>(sourceMember);
        }
    }
}
