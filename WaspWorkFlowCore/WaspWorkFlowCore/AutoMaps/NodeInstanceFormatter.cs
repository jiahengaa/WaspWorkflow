using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class NodeInstanceFormatter : IValueConverter<string, List<NodeActionLog>>
    {
        public List<NodeActionLog> Convert(string sourceMember, ResolutionContext context)
        {
            return JsonConvert.DeserializeObject<List<NodeActionLog>>(sourceMember);
        }
    }
}
