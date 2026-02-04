using Marten.Events.Aggregation;

namespace Vendors.Api.Vendors.ReadModels;

public record UiVendorListItem 
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
   
}

public class UiVendorListProjection: SingleStreamProjection<UiVendorListItem, Guid>
{
    public UiVendorListProjection()
    {
        DeleteEvent<VendorDeactivated>();

    }

    public static UiVendorListItem Create(VendorCreated evt)
    {
        return new UiVendorListItem
        {
            Id = evt.Id,
            Name = evt.Name
        };
    }
    
}
