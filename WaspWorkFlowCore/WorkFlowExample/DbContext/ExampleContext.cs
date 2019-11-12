using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkflowExample.Models;

namespace WorkflowExample
{
    public class ExampleContext:DbContext
    {
        private readonly IHostingEnvironment env;

        public ExampleContext(IHostingEnvironment env)
        {
            this.env = env;
        }

        public ExampleContext(DbContextOptions<ExampleContext> options)
        : base(options)
        {

        }

        public ExampleContext() { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                var builder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                var configuration = builder.Build();
                string connectionString = configuration.GetConnectionString("SQLConnection");
                optionsBuilder.UseMySql(connectionString);
            }
        }

        #region WF Table

        public virtual DbSet<AssetPuchase> AssetPuchase { set; get; }
        public virtual DbSet<ITPurchase> ITPurchase { set; get; }

        #endregion
    }
}
