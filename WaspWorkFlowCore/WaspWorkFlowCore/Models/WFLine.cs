using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Models
{
    public class WFLine
    {
        public Guid Id { set; get; }
        public Guid LineId { set; get; }
        /// <summary>
        /// WFTemplate id
        /// </summary>
        public Guid WFId { set; get; }
        public string LineJson { set; get; }
    }
}
