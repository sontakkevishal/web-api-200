using Software.Api.Catalog.Operations;

namespace Software.Api.Catalog;



public static class CatalogApiExtensions
{
    extension(IEndpointRouteBuilder endpoints)
    {
        public IEndpointRouteBuilder MapCatalogRoutes()
        {
            var group = endpoints.MapGroup("catalog")
                .WithDescription("All Things Catalog Related");

            group.MapPost("", AddingItem.Post);
               
            return endpoints;
        }
    }
}

