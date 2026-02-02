using JasperFx.Events;
using Marten.Events.Aggregation;

namespace Users.Api.Endpoints;

public record UserCreated(Guid Id, string Sub);

public record PersonalInformationSet(PersonalInfo Info);
public  class UserProjection : SingleStreamProjection<User, Guid>
{
    public static User Create(IEvent<UserCreated> @event)
    {
        return new User()
        {
            Id = @event.Data.Id,
            Sub = @event.Data.Sub,
            CreatedOn = @event.Timestamp
        };
    }

    public static User Apply(PersonalInformationSet set, User model)
    {
        return model with { PersonalInfo = set.Info };
    }

}

public record User
{
    public Guid Id { get; init; }
    public int Version { get; init; }
    public string Sub { get; init; } = string.Empty;
    
    public DateTimeOffset CreatedOn { get; init; }
    
    public PersonalInfo? PersonalInfo { get; set; }
    
}

public record PersonalInfo
{
 
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string WorkPhoneExtension { get; set; } = string.Empty;
    public string PersonalPhone { get; set; } = string.Empty;
}