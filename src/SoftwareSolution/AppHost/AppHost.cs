using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);

var scalar = builder.AddScalarApiReference(options =>
{
    options
        .PreferHttpsEndpoint() // Use HTTPS endpoints when available
        .AllowSelfSignedCertificates() // Trust self-signed certificates
        .WithTheme(ScalarTheme.DeepSpace);
});

// Got Rid of this For Now...
// var mappingsPath = Path.Combine(Directory.GetCurrentDirectory(), "__admin", "mappings");
// var vendorApi = builder.AddWireMock("vendors-api")
//     .WithMappingsPath(mappingsPath)
//     .WithWatchStaticMappings();

// old remote one
// var vendorApi = builder.AddExternalService("vendors-api", "https://work-share.akita-velociraptor.ts.net/");

var vendorApiKey = builder.AddParameter("apiKey", "001");

var pg = builder.AddPostgres("pg-server") // you can nail down the port, the user, etc.
    
  .WithPgWeb() // web based dashboards that might be enough while you are doing development.
    .WithLifetime(ContainerLifetime.Persistent);

var softwareDb = pg.AddDatabase("software-db");
// might need an initialization script, or a prepared base image, more later.

var vendorDb = pg.AddDatabase("vendors-db");

var vendorApi = builder.AddProject<Projects.Vendors_Api>("vendors-api")
    .WithReference(vendorDb)
    .WithHttpCommand("seed", "Seed Data")
    .WaitFor(vendorDb);

var softwareApi = builder.AddProject<Projects.Software_Api>("software-api")
    .WithReference(softwareDb)
    .WithReference(vendorApi)
    .WithEnvironment("VENDOR_API_KEY", vendorApiKey)
    .WaitFor(softwareDb) 
    .WaitFor(vendorApi);

var gateway = builder.AddProject<Projects.Gateway>("gateway")
    .WithReference(softwareApi)
    .WithReference(vendorApi)
    .WithChildRelationship(vendorApi)
    .WithChildRelationship(softwareApi)
    .WaitFor(softwareApi);

scalar.WithApiReference(softwareApi);
scalar.WithApiReference(vendorApi);

builder.Build().Run();
