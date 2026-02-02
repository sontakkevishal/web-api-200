using Microsoft.AspNetCore.Authorization;

namespace SoftwareCenter.Security.Policies;

public class IsSoftwareCenterRequirement :
    IAuthorizationRequirement,
    IAuthorizationHandler
{
    public Task HandleAsync(AuthorizationHandlerContext context)
    {
       
        var isSoftwareCenter = context.User.Claims.Where(c => c.Type == "role" && c.Value == "SoftwareCenter");
        if (isSoftwareCenter.Any())
        {
            context.Succeed(this);
        }
        return Task.CompletedTask;
    }
}