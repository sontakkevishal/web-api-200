using Catalog.Api.Endpoints.Vendors.ReadModels;
using Marten;

namespace Catalog.Api.Endpoints.Vendors.Operations;

public static class GetVendors
{
    public static async Task<IResult> GetVendorsHandler(IDocumentSession session)
    {
        var vendors = await session.Query<Vendor>().ToListAsync();
        return Results.Ok(vendors);
    }       
}