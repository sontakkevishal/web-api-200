using Catalog.Api.Endpoints.Vendors.Operations;
using Marten.Events.Aggregation;

namespace Catalog.Api.Endpoints.Vendors.ReadModels;

public class VendorSummary : SingleStreamProjection<Vendor, Guid>
{
    public static Vendor Create(VendorCreated @event) 
    {
        return new Vendor
        {
            Id = @event.Id,
            Name = @event.Name,
            Description = @event.Description,
            WebsiteUrl = @event.WebsiteUrl,
            CreatedBy = @event.CreatedBy
        };
        
    }

    public static Vendor Apply(VendorPocAdded @event, Vendor model)
    {
        return model with { CurrentPoc =  new Poc
        {
            Name = @event.Name,
            Email = @event.Email,
            Phone = @event.Phone
        } };
    }
}

public record Vendor
{
    public Guid Id { get; set; }
    public int Version { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string WebsiteUrl { get; init; } = string.Empty;
    public Poc CurrentPoc { get; init; } = new Poc();
    public IReadOnlyList<Poc> PreviousPocs { get; init; } = Array.Empty<Poc>();
}

public record Poc
{
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; }= string.Empty;
    public string Phone { get; init; }= string.Empty;
}