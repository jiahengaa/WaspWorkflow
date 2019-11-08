using System;
using System.Collections.Generic;
using System.Text;

namespace WaspWorkFlowCore.Infra
{
    public static class TimeHelper
    {
        public static DateTime DateTime1970 = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1)); // 当地时区

        /// <summary>
        /// 获取从 1970-01-01 到现在的毫秒数。
        /// </summary>
        /// <returns></returns>
        public static long GetTimeStamp()
        {
            return (long)(DateTime.Now - DateTime1970).TotalMilliseconds;
        }

        /// <summary>
        /// 计算 1970-01-01 到指定 <see cref="DateTime"/> 的毫秒数。
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static long GetTimeStamp(DateTime dateTime)
        {
            return (long)(dateTime.ToLocalTime() - DateTime1970).TotalSeconds;
        }
    }
}
