var builder = DistributedApplication.CreateBuilder(args);

var vendorApi = builder.AddExternalService("vendors-api", "https://work-share.akita-velociraptor.ts.net/");
var vedorApiKey = builder.AddParameter("apiKey", true);
var pg = builder.AddPostgres("pg-server")
    .WithLifetime(ContainerLifetime.Persistent);

var softwareDb = pg.AddDatabase("software-db");
// might need an initialization script, or a prepared base image, more later.



var softwareApi = builder.AddProject<Projects.Software_Api>("software-api")
    .WithReference(softwareDb)
    .WithReference(vendorApi)
    
    .WaitFor(softwareDb)    ;

builder.Build().Run();
