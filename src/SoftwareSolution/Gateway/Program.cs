var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults(); // our shared defaults for OTEL, SRE, etc.

builder.Configuration.AddJsonFile("yarp-config.json", optional: false, reloadOnChange: true).Build();


builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver(); // we are using Aspire, and I want to use the services added to this with the .withReference() in my configuration.

var app = builder.Build();

app.MapReverseProxy();
app.MapDefaultEndpoints(); // Our shared configuration for how we do health checks, etc.
app.Run();