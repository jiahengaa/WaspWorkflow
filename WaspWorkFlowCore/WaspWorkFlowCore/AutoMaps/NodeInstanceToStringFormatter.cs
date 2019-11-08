using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class NodeInstanceToStringFormatter : IValueConverter<List<NodeActionLog>, string>
    {
        public string Convert(List<NodeActionLog> sourceMember, ResolutionContext context)
        {
            return JsonConvert.SerializeObject(sourceMember);
        }
    }
}
