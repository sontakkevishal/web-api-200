using Users.Api.Endpoints;
using Users.Api.Extension;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

builder.Services.AddAuthenticationSchemes();
builder.Services.AddAuthorizationAndPolicies();

builder.AddPersistenceAndMessaging("sc-users-db");

var app = builder.Build();
app.UseStatusCodePages();
app.UseAuthentication();
app.UseAuthorization();

app.MapUserEndpoints();

app.MapDefaultEndpoints();
app.Run();

