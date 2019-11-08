using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Models
{
    public class WFInstance
    {
        public Guid Id { set; get; }
        /// <summary>
        /// WFTemplate Id
        /// </summary>
        public Guid WFId { set; get; }
        /// <summary>
        /// bussiness id
        /// </summary>
        public Guid BId { set; get; }
        /// <summary>
        /// 单据类型，业务系统根据此字段判断BId去哪张表去查找单据
        /// </summary>
        public string BType { set; get; }
        /// <summary>
        /// 流程单据描述信息，此字段可自行扩充为json格式，到时候自行解析json格式
        /// </summary>
        public string Desc { set; get; }

    }
}
