using BackendForFrontend;
using BackendForFrontend.Extensions.Auth;
using BackendForFrontend.Extensions.Yarp;
using Duende.AccessTokenManagement.OpenIdConnect;


var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => { options.AddServerHeader = false; });
builder.AddAuthenticationSchemes();

builder.AddBffYarpReverseProxy();

builder.Services.AddOpenIdConnectAccessTokenManagement();


builder.AddServiceDefaults();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseStatusCodePages();
app.MapReverseProxy();
app.MapAuthEndpoints();
app.MapDefaultEndpoints();

app.Run();