using JasperFx.Events;
using System.Diagnostics.Contracts;

namespace Vendors.Api.Vendors.ReadModels;

public class VendorSummary
{
    public Guid Id { get; set; }
    public int Version { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    public string Name { get; set; } = string.Empty;   
    
    public bool IsDeactivated { get; set; } = false;
    public DateTimeOffset? DeactivatedOn { get; set; } = null;

    public static VendorSummary Create(IEvent<VendorCreated> evt)
    {
        return new VendorSummary
        {
            Id = evt.Data.Id,
            Name = evt.Data.Name,
            CreatedOn = evt.Timestamp
        };
    }

    public void Apply(IEvent<VendorDeactivated> evt, VendorSummary model)
    {

        model.IsDeactivated = true;
        model.DeactivatedOn = evt.Timestamp;

    }
}
