using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using WaspWorkFlowCore.Core;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.Server;

namespace WaspWorkFlowCore
{
    public static class WaspWorkFlowCoreExtensions
    {
        public static IServiceCollection UserWorkFlow(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddSingleton<IWFPool>(new WFPool());
            services.AddSingleton<IConditionJudger>(new ConditionJudger());
            services.AddScoped<IWFTemplateServer, WFTemplateServer>();
            services.AddScoped<IWFInstanceServer, WFInstanceServer>();

            services.AddScoped<WFContext>();


            //初始化工作
            services.BuildServiceProvider().GetRequiredService<WFContext>().Database.Migrate();
            services.BuildServiceProvider().GetService<IWFInstanceServer>().InitWFInstances();
            services.BuildServiceProvider().GetService<IConditionJudger>().InitConditionJudger();

            AppDomain.CurrentDomain.ProcessExit += (sender,e) =>
            {
                services.BuildServiceProvider().GetService<IConditionJudger>().Dispose();
            };

            return services;
        }
    }
}
