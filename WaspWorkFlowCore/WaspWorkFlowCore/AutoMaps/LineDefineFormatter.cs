using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class LineDefineFormatter: IValueConverter<string,LineDefine>
    {
        public LineDefine Convert(string sourceMember, ResolutionContext context)
        {
            return JsonConvert.DeserializeObject<LineDefine>(sourceMember);
        }
    }
}
