namespace Vendors.Api.Vendors;


// Create a Vendor
public record CreateAVendor(Guid Id, string Name);


// Remove a Vendor

public record RemoveAVendor(Guid Id);