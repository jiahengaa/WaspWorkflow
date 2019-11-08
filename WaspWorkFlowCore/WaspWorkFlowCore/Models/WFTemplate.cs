using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Models
{
    public class WFTemplate
    {
        public Guid Id { set; get; }
        public string Name { set; get; }
        public string Desc { set; get; }
        public Guid CreateUserId { set; get; }
        public Guid UpdateUserId { set; get; }
        public string CreateUserName{set;get;}
        public string UpdateUserName { set; get; }
        public long CreateTime { set; get; }
        public long UpdateTime { set; get; }
        public bool IsDelete { set; get; }
        public string Version { set; get; }
    }
}
