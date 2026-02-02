
using Catalog.Api.Endpoints.Vendors;
using Catalog.Api.Extension;
using SoftwareCenter.OpenApi;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();
builder.Services.AddOpenApi(opts =>
{
    opts.AddDocumentTransformer<CatalogOpenApiTransform>();
    opts.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});
builder.Services.AddCors(pb => pb.AddDefaultPolicy(
    policy => policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
        ));    

builder.Services.AddAuthenticationSchemes();
builder.Services.AddAuthorizationAndPolicies();
builder.Services.AddValidation();

builder.AddPersistenceAndMessaging("sc-catalog-db");

var app = builder.Build();

if (builder.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors();
}
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();
app.MapDefaultEndpoints();
app.MapVendorEndpoints();
app.Run();