using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using WaspWorkFlowCore.Models;

namespace WaspWorkFlowCore
{
    public class WFContext: DbContext
    {
        private readonly IHostingEnvironment env;
        public WFContext(IHostingEnvironment env)
        {
            this.env = env;
        }
        public WFContext(DbContextOptions<WFContext> options)
            : base(options)
        {

        }

        public WFContext() { }

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

        public virtual DbSet<WFInstance> WFInstance { set; get; }
        public virtual DbSet<WFLine> WFLine { set; get; }
        public virtual DbSet<WFNode> WFNode { set; get; }
        public virtual DbSet<WFNodeInstance> WFNodeInstance { set; get; }
        public virtual DbSet<WFTemplate> WFTemplate { set; get; }

        public virtual DbSet<WFToolTip> WFToolTip { set; get; }

        #endregion

    }
}
