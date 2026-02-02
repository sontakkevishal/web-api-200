using Catalog.Api.Endpoints.Vendors.ReadModels;
using JasperFx.Events.Daemon;
using JasperFx.Events.Projections;
using Marten;
using Wolverine;
using Wolverine.Marten;
using Wolverine.Nats;

namespace Catalog.Api.Extension;

public static class Persistence
{
    extension(WebApplicationBuilder builder)
    {
        public WebApplicationBuilder AddPersistenceAndMessaging(string dataSourceName)
        {
            builder.AddNpgsqlDataSource(dataSourceName);

            builder.Host.UseWolverine((options) =>
            {
                options.UseNats(builder.Configuration.GetConnectionString("nats") ??
                                throw new Exception("No NATS connection string configured"))
                    .AutoProvision()
                    .UseJetStream(js =>
                    {
                        js.MaxDeliver = 5;
                        js.AckWait = TimeSpan.FromSeconds(30);
                    })
                    .DefineWorkQueueStream("CATALOG", s => s.EnableScheduledDelivery(), "catalog.>");

                // options.PublishMessage<UserDocument>()
                //     .ToNatsSubject("users.user");

                options.Policies.AutoApplyTransactions();

            });

            builder.Services.AddMarten(options =>
                {
                    options.Projections.Add<VendorSummary>(ProjectionLifecycle.Async);
                })
                .UseNpgsqlDataSource()
                .UseLightweightSessions()
                .IntegrateWithWolverine()
                .AddAsyncDaemon(DaemonMode.Solo);
            return builder;
        }
    }
}