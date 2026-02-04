
using JasperFx.Events.Projections;
using Marten;
using Microsoft.OpenApi;
using Vendors.Api.Vendors;
using Vendors.Api.Vendors.ReadModels;
using Wolverine;
using Wolverine.Marten;

var builder = WebApplication.CreateBuilder(args);


builder.AddServiceDefaults();

builder.AddNpgsqlDataSource("vendors-db");
// IMessageBus
builder.UseWolverine(options =>
{

    options.Policies.AutoApplyTransactions();
    options.Policies.UseDurableInboxOnAllListeners();
    //options.Policies.UseDurableOutboxOnAllSendingEndpoints();
});

// Add Marten - with a database - for the events, because these need to be durable.
builder.Services.AddMarten(options =>
{
    options.Projections.Add<UiVendorListProjection>(ProjectionLifecycle.Async);

}).IntegrateWithWolverine()
.UseLightweightSessions()
.UseNpgsqlDataSource()
.AddAsyncDaemon(JasperFx.Events.Daemon.DaemonMode.Solo);


builder.Services.AddOpenApi(config =>
{
    config.AddDocumentTransformer((doc, ctx, ct) =>
    {
        doc.Info = new OpenApiInfo()
        {
            Title = "Vendors API for Classroom Training",
            Description =
                "This API provides a list of vendors and allows lookup by unique identifier. It is intended for use in classroom training scenarios. \n\n The API Key can be anything that ends in three integers. Those integers are multiplied by 100 and the result is delayed by that number of milliseconds.",
        };
        return Task.CompletedTask;
    });
});


var app = builder.Build();



app.MapOpenApi();

app.MapVendorEndpoints();
app.MapDefaultEndpoints();

if(app.Environment.IsDevelopment())
{
    app.MapPost("/seed", async (IMessageBus bus) =>
    {
        var v1 = new CreateAVendor(Guid.NewGuid(), "Microsoft");
        await bus.PublishAsync(v1);
        
        var v2 = new CreateAVendor(Guid.NewGuid(), "Google");
        await bus.PublishAsync(v2);
        
        var v3 = new CreateAVendor(Guid.NewGuid(), "Amazon");
        await bus.PublishAsync(v3);
        
        var v4 = new CreateAVendor(Guid.NewGuid(), "Apple");
        await bus.PublishAsync(v4);
        
        var v5 = new CreateAVendor(Guid.NewGuid(), "Oracle");
        await bus.PublishAsync(v5);
        
        var v6 = new CreateAVendor(Guid.NewGuid(), "IBM");
        await bus.PublishAsync(v6);
        
        var v7 = new CreateAVendor(Guid.NewGuid(), "SAP");
        await bus.PublishAsync(v7);
        
        var v8 = new CreateAVendor(Guid.NewGuid(), "Adobe");
        await bus.PublishAsync(v8);
        
        var v9 = new CreateAVendor(Guid.NewGuid(), "Salesforce");
        await bus.PublishAsync(v9);
        
        var v10 = new CreateAVendor(Guid.NewGuid(), "Cisco");
        await bus.PublishAsync(v10);
        
        var v11 = new CreateAVendor(Guid.NewGuid(), "Intel");
        await bus.PublishAsync(v11);
        
        var v12 = new CreateAVendor(Guid.NewGuid(), "VMware");
        await bus.PublishAsync(v12);
        
        var v13 = new CreateAVendor(Guid.NewGuid(), "Red Hat");
        await bus.PublishAsync(v13);
        
        var v14 = new CreateAVendor(Guid.NewGuid(), "Atlassian");
        await bus.PublishAsync(v14);
        
        var v15 = new CreateAVendor(Guid.NewGuid(), "GitHub");
        await bus.PublishAsync(v15);
        
        var v16 = new CreateAVendor(Guid.NewGuid(), "JetBrains");
        await bus.PublishAsync(v16);
        
        var v17 = new CreateAVendor(Guid.NewGuid(), "Slack");
        await bus.PublishAsync(v17);
        
        var v18 = new CreateAVendor(Guid.NewGuid(), "Zoom");
        await bus.PublishAsync(v18);
        
        var v19 = new CreateAVendor(Guid.NewGuid(), "Dropbox");
        await bus.PublishAsync(v19);
        
        var v20 = new CreateAVendor(Guid.NewGuid(), "Stripe");
        await bus.PublishAsync(v20);
        
        var v21 = new CreateAVendor(Guid.NewGuid(), "MongoDB");
        await bus.PublishAsync(v21);
        
    });
}

app.Run();