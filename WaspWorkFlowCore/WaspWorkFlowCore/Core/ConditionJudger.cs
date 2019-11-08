using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace WaspWorkFlowCore.Core
{
    /// <summary>
    /// 应该注册为单例
    /// </summary>
    public class ConditionJudger: IConditionJudger
    {
        private Browser browser { set; get; }
        public ConditionJudger()
        {
            
        }

        public async Task<bool> InitConditionJudger()
        {
            try
            {
                var options = new LaunchOptions { Headless = true };
                await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                Console.WriteLine("the condition judge init");
                browser = await Puppeteer.LaunchAsync(options);
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> Predicte(string jsonFunc,params object[] args)
        {
            if (string.IsNullOrEmpty(jsonFunc))
            {
                return true;
            }
            
            if (browser == null)
            {
                throw new Exception("条件判断器未启动！");
            }
            using(var page = await browser.NewPageAsync())
            {
                try
                {
                    return await page.EvaluateFunctionAsync<bool>(jsonFunc, args);
                }
                catch(Exception ex)
                {
                    return false;
                }
                finally
                {
                    await page.CloseAsync();
                }
                
            }
        }

        public void Dispose()
        {
            browser.CloseAsync();
            browser.Dispose();
        }
    }
}
