using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Software.Api.Controllers;

//public class CatalogController : ControllerBase
//{
//    [HttpPost("catalog")]
//    public async Task<ActionResult> AddItemToCatalogAsync([FromBody] CatalogItemRequest request)
//    {
//        // have to await
//        return Ok(request); 
//    }
//}

public static class CatalogApiExtensions
{
    extension(IEndpointRouteBuilder endpoints)
    {
        public IEndpointRouteBuilder MapCatalogRoutes()
        {
            var group = endpoints.MapGroup("catalog")
                .WithDescription("All Things Catalog Related");

            group.MapPost("", async (CatalogItemRequest req) =>
            {
                // do not create references to backing services EVER EVER EVER
                using var client = new HttpClient();

                var request = new HttpRequestMessage(HttpMethod.Get, "https://work-share.akita-velociraptor.ts.net/vendors/123e4567-e89b-12d3-a456-426614174000");

                using var response = await client.SendAsync(request);
                // if the vendor you supplied isn't supported, I'm giong to return an error.
                // a 400? weird.
                return TypedResults.Ok(req);
            });
               
            return endpoints;
        }
    }
}

public record CatalogItemRequest
{
    [Required, MinLength(3), MaxLength(100)]
    public string Title { get; set; } = string.Empty;
    [Required]
    public string VendorId { get; set; } = string.Empty;

}