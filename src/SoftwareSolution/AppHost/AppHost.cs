var builder = DistributedApplication.CreateBuilder(args);

var pg = builder.AddPostgres("pg-server")
    .WithLifetime(ContainerLifetime.Persistent);

var softwareDb = pg.AddDatabase("software-db");
// might need an initialization script, or a prepared base image, more later.



var softwareApi = builder.AddProject<Projects.Software_Api>("software-api")
    .WithReference(softwareDb)
    .WaitFor(softwareDb)    ;

builder.Build().Run();
