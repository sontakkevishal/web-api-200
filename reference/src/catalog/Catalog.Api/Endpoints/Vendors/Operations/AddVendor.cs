using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Catalog.Api.Endpoints.Vendors.ReadModels;
using Marten;

namespace Catalog.Api.Endpoints.Vendors.Operations;

public record VendorCreated(Guid Id, string Name, string Description, string WebsiteUrl, string CreatedBy);
public record VendorPocAdded(Guid VendorId, string Name, string Email, string Phone);
public static class AddVendor
{
    public static async Task<IResult> AddVendorHandler(VendorAddRequest request, IDocumentSession session, ClaimsPrincipal identity)
    {
        var id = Guid.NewGuid();
        var sub = identity.Claims.SingleOrDefault(x => x.Type == "sub")?.Value;
        session.Events.StartStream<Vendor>(id, new VendorCreated(id, request.Name, request.Description, request.WebsiteUrl, sub ?? "unknown"));
        session.Events.Append(id, new VendorPocAdded(id, request.Poc.Name, request.Poc.Email, request.Poc.Phone));
        await session.SaveChangesAsync();
        return Results.Created($"/vendors/{id}", new { Id = id });
    }
}

public record VendorAddRequest
{
    [Required, MaxLength(50)]
    public string Name { get; init; } = string.Empty;
    [MaxLength(500)]
    public string Description { get; init; } = string.Empty;
    [Url, MaxLength(200)]
    public string WebsiteUrl { get; init; } = string.Empty;
    [Required]
    public VendorPoc Poc { get; init; } = new VendorPoc();
    
}

public record VendorPoc
{
    [Required, MaxLength(100)]
    public string Name { get; init; } = string.Empty;
    [EmailAddress, MaxLength(100), Required]
    public string Email { get; init; }= string.Empty;
    public string Phone { get; init; }= string.Empty;
}