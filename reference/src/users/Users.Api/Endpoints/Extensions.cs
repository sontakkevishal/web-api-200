using System.Security.Claims;
using Marten;
using Users.Api.Outgoing.Documents;
using Wolverine;

namespace Users.Api.Endpoints;

public static class Extensions
{
    extension(IEndpointRouteBuilder endpoints)
    {
        public IEndpointRouteBuilder MapUserEndpoints()
        {
            endpoints.MapGet("/user", async (ClaimsPrincipal principal, IDocumentSession session, IMessageBus messageBus) =>
            {
                var sub = principal.FindFirstValue("sub");
                if (string.IsNullOrEmpty(sub))
                {
                    return Results.Unauthorized();
                }

                var userProfile = await session.Query<User>()
                    .Where(u => u.Sub == sub)
                    .SingleOrDefaultAsync();

                if (userProfile != null) return Results.Ok(userProfile);
                var id = Guid.NewGuid();
                session.Events.StartStream(id, new UserCreated(id, sub));
                    
                    
                await session.SaveChangesAsync();
                var profile = await session.LoadAsync<User>(id);
                    
                await messageBus.SendAsync(new UserDocument(id, sub));
                return TypedResults.Ok(profile);

            }).RequireAuthorization();
            
            endpoints.MapPut("/user/personal-info", async (ClaimsPrincipal principal, PersonalInfo personalInfo, IDocumentSession session) =>
            {
                var sub = principal.FindFirstValue("sub");
                if (string.IsNullOrEmpty(sub))
                {
                    return Results.Unauthorized();
                }

                var userProfile = await session.Query<User>()
                    .Where(u => u.Sub == sub)
                    .SingleOrDefaultAsync();

                if (userProfile == null)
                {
                    return Results.NotFound("User profile not found.");
                }

                session.Events.Append(userProfile.Id, new PersonalInformationSet(personalInfo));
                await session.SaveChangesAsync();

                return TypedResults.Ok();
            }).RequireAuthorization();
            return endpoints;
        }
    }
}