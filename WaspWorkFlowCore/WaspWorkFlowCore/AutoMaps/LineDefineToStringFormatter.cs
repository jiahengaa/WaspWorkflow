using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.ViewModels;

namespace WaspWorkFlowCore.AutoMaps
{
    public class LineDefineToStringFormatter : IValueConverter<LineDefine,string>
    {
        public string Convert(LineDefine sourceMember, ResolutionContext context)
        {
            return JsonConvert.SerializeObject(sourceMember);
        }
    }
}
