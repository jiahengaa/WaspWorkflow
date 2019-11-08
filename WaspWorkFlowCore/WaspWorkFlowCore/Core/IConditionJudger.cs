using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace WaspWorkFlowCore.Core
{
    public interface IConditionJudger
    {
        /// <summary>
        /// 条件判断器初始化
        /// </summary>
        /// <returns></returns>
        Task<bool> InitConditionJudger();
        /// <summary>
        /// 条件判断
        /// </summary>
        /// <param name="jsonFunc"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        Task<bool> Predicte(string jsonFunc, params object[] args);
        /// <summary>
        /// 结束brower
        /// </summary>
        void Dispose();
    }
}
