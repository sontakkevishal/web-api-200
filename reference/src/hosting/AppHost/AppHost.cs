using AppHost;
using Scalar.Aspire;

var builder = DistributedApplication.CreateBuilder(args);


var features = builder.AddFlagd("features", ofrepPort:9327, port:9325)
    .WithBindFileSync(fileSource: "./flags/", filename: "flagd.json")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithLogLevel(Microsoft.Extensions.Logging.LogLevel.Debug);
    

var postgres = builder.AddPostgres("pg")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Persistent);

var natsTransport = builder.AddNats("nats")
    .WithJetStream()
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

// Mock OAuth2 Server container - Pretends to be an identity provider, great for development.
var identity = builder.AddContainer("identity", "ghcr.io/navikt/mock-oauth2-server:3.0.1")
    .WithHttpEndpoint(9069, 8080) // Expose port 9069 on host to 8080 in container
    .WithBindMount("./MockOauth2/",
        "/app/resources/software/") // Mount local folder to container, contains config and login template
    .WithLifetime(ContainerLifetime.Persistent) // Keep container and data between runs
    .WithEnvironment("JSON_CONFIG_PATH", "/app/resources/software/settings/config.json");




var usersDb = postgres.AddDatabase("sc-users-db");

var usersApi = builder.AddProject<Projects.Users_Api>("users-api")
    .WithSharedLoggingLevels()
    .WithReference(usersDb)
    .WithReference(natsTransport)
    .WithIdentityOpenIdAuthority(identity)
    .WithIdentityOpenIdBearer(identity)
    .WaitFor(usersDb)
    .WaitFor(natsTransport);

var catalogDb = postgres.AddDatabase("sc-catalog-db");
var catalogApi = builder.AddProject<Projects.Catalog_Api>("catalog-api")
    .WithSharedLoggingLevels()
    .WithIdentityOpenIdAuthority(identity)
    .WithIdentityOpenIdBearer(identity)
    .WithReference(natsTransport)
    .WithReference(catalogDb)
    .WaitFor(catalogDb)
    .WaitFor(natsTransport);



var bff = builder.AddProject<Projects.BackendForFrontend>("bff")
    .WithSharedLoggingLevels()
    .WithReference(usersApi)
    .WithReference(catalogApi)
    .WithReference(features)
    .WithIdentityOpenIdAuthority(identity)
    .WithIdentityOpenIdBearer(identity)
    .WithChildRelationship(usersApi)
    .WithChildRelationship(catalogApi);


var scalarApis = builder.AddScalarApiReference("scalar-apis", 9561, options =>
    {
        options.DisableDefaultProxy();
        options.PreferHttpsEndpoint();
        options.PersistentAuthentication = true;
        options.AllowSelfSignedCertificates();
        options.AddPreferredSecuritySchemes("oauth2")
            .AddAuthorizationCodeFlow("oauth2",
                flow =>
                {
                    flow.WithClientId("aspire-client")
                        .WithClientSecret("super-secret")
                        .WithSelectedScopes("openid", "profile", "email", "roles");
                });

        options.WithOpenApiRoutePattern("/openapi/{documentName}.json");
    })
    .WaitFor(identity)
    .WithParentRelationship(bff)
    .WithExplicitStart();

scalarApis.WithApiReference(catalogApi, options => { options.AddDocument("v1", "Catalog API"); });
builder.Build().Run();