using Marten;
using Vendors.Api.Vendors.ReadModels;
using Wolverine;

namespace Vendors.Api.Vendors;

public static class VendorEndpoints
{

    extension(IEndpointRouteBuilder endpoints)
    {
        public IEndpointRouteBuilder MapVendorEndpoints()
        {
            var group = endpoints.MapGroup("vendors");

            // Get All The Vendors (Read Model)

            // A way to add vendors
            group.MapPost("/", AddingVendors.Add);
            group.MapDelete("{id:guid}", async (Guid id, IMessageBus bus) =>
            {
                
                await bus.PublishAsync(new RemoveAVendor(id));
                return;
            });
            // A way to remove vendors

            group.MapGet("{id:guid}", async (Guid id, IDocumentSession session) =>
            {
                var vendor = await session.Events.AggregateStreamAsync<VendorSummary>(id);

                return vendor;
            });
            group.MapGet("", async (IDocumentSession session) =>
            {
                var list = await session.Query<UiVendorListItem>()
                .OrderBy(b => b.Name)
                .ToListAsync();
                return list;
            });

            return group;
        }
    }
}
