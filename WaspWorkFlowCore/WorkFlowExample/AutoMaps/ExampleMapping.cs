using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorkflowExample.Models;
using WorkflowExample.ViewModels;

namespace WorkflowExample.AutoMaps
{
    public class ExampleMapping : Profile
    {
        public ExampleMapping()
        {

            CreateMap<ITPurchase, ITPurchaseViewModel>();
            CreateMap<ITPurchaseViewModel, ITPurchase>();
        }
    }


}