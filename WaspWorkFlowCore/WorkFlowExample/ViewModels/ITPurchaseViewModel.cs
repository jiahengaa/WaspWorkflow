using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkflowExample.Models;

namespace WorkflowExample.ViewModels
{
    public class ITPurchaseViewModel : ITPurchase
    {
        /// <summary>
        /// 购置清单
        /// </summary>
        public List<AssetPuchase> AssetItem { set; get; }
    }
}
