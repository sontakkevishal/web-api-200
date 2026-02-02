using Catalog.Api.Endpoints.Vendors.Operations;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace Catalog.Api.Endpoints.Vendors;

public static class ApiExtensions
{
    extension(IEndpointRouteBuilder endpoints)
    {
        public IEndpointRouteBuilder MapVendorEndpoints()
        {
            var group = endpoints.MapGroup("/vendors")
                .WithTags("Vendors")
                .RequireAuthorization();
            group.MapGet("/", GetVendors.GetVendorsHandler).RequireAuthorization("vendors:view");
            group.MapPost("/", AddVendor.AddVendorHandler).RequireAuthorization("vendors:create");
            return group;
            
        }
    }
    
}