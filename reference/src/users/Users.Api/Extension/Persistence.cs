
using JasperFx.Events.Projections;
using Marten;
using Users.Api.Endpoints;
using Users.Api.Outgoing.Documents;
using Wolverine;
using Wolverine.Marten;
using Wolverine.Nats;

namespace Users.Api.Extension;

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
                    .DefineWorkQueueStream("USERS", s => s.EnableScheduledDelivery(), "users.>");
              
                options.PublishMessage<UserDocument>()
                    .ToNatsSubject("users.user");
                
                options.Policies.AutoApplyTransactions();
       
            });

            builder.Services.AddMarten(options =>
                {
                    options.Projections.Add<UserProjection>(ProjectionLifecycle.Inline);

                })
                .UseNpgsqlDataSource()
                .UseLightweightSessions()
                .IntegrateWithWolverine();
            return builder;
        }
    }
}