using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class NodeDefineToStringFormatter : IValueConverter<NodeDefine, string>
    {
        public string Convert(NodeDefine source, ResolutionContext context)
        => JsonConvert.SerializeObject(source);
    }
}
