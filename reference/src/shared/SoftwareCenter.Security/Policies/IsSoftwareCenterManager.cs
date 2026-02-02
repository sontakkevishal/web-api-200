using Microsoft.AspNetCore.Authorization;

namespace SoftwareCenter.Security.Policies;

public class IsSoftwareCenterManagerRequirement :
    IAuthorizationRequirement,
    IAuthorizationHandler
{
    public Task HandleAsync(AuthorizationHandlerContext context)
    {
        var isManager = context.User.Claims.Where(c => c.Type == "role" && c.Value == "Manager");
        var isSoftwareCenter = context.User.Claims.Where(c => c.Type == "role" && c.Value == "SoftwareCenter");
        if (isManager.Any() && isSoftwareCenter.Any())
        {
            context.Succeed(this);
        }
        return Task.CompletedTask;
    }
}