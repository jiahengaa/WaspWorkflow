using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaspWorkFlowCore.IServer;
using WaspWorkFlowCore.ViewModels;

namespace WorkFlowWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkFlowTemplateController : ControllerBase
    {
        private readonly IWFTemplateServer iWFTemplateServer;

        public WorkFlowTemplateController(IWFTemplateServer iWFTemplateServer)
        {
            this.iWFTemplateServer = iWFTemplateServer;
        }

        // GET: api/WorkFlowTemplate
        [HttpGet]
        public IEnumerable<WFTemplateViewModel> Get()
        {
            return iWFTemplateServer.GetAllWFTemplate();
        }

        // GET: api/WorkFlowTemplate/5
        [HttpGet("{id}", Name = "Get")]
        public WFTemplateViewModel Get(Guid id)
        {
            return iWFTemplateServer.GetTemplateById(id);
        }

        // POST: api/WorkFlowTemplate
        [HttpPost]
        public WFTemplateViewModel Post([FromBody] WFTemplateViewModel viewModel)
        {
            return iWFTemplateServer.AddOrUpdate(viewModel);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public bool Delete(Guid id)
        {
            return iWFTemplateServer.DeleteWFTemplate(id);
        }
    }
}
