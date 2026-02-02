using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace BackendForFrontend;

public static class AuthEndpoints
{
    extension(IEndpointRouteBuilder endpoints)
    {
        internal IEndpointRouteBuilder MapAuthEndpoints()
        {
            var group = endpoints.MapGroup("/api/auth").WithTags("Authentication");

            group.MapGet("user", (ClaimsPrincipal principal) =>
            {   
                var user = principal switch
                {
                    { Identity.IsAuthenticated: true } => new User
                    {
                        IsAuthenticated = true,
                        Sub = principal.FindFirstValue("sub"),
                        Claims = principal.Claims.Select(c => new UserClaim { Type = c.Type, Value = c.Value })
                    },
                    _ => new User
                    {
                        IsAuthenticated = false,
                        Sub = null
                    }
                };

                return TypedResults.Ok(user);
                
            }).AllowAnonymous();
            group.MapGet("login", (string? returnUrl, string? claimsChallenge, HttpContext context) =>
            {
                if (context.User.Identity is { IsAuthenticated: true })
                {
                    return TypedResults.Challenge(new AuthenticationProperties()
                    {
                        RedirectUri = returnUrl, IsPersistent = true
                    });
                }

                var properties = new AuthenticationProperties()
                {
                    RedirectUri = context.BuildRedirectUrl(returnUrl),

                };
                if (claimsChallenge == null)
                {
                    return TypedResults.Challenge(properties, [OpenIdConnectDefaults.AuthenticationScheme]);
                }
                var jsonString = claimsChallenge.Replace("\\", "", StringComparison.Ordinal).Trim(['"']);
                properties.Items["claims"] = jsonString;
                return TypedResults.Challenge(properties, [OpenIdConnectDefaults.AuthenticationScheme]);
        }).AllowAnonymous();
            


            group.MapGet("/logout", (string? returnUrl, HttpContext context) =>
            {
                var properties = new AuthenticationProperties
                {
                    RedirectUri = context.BuildRedirectUrl(returnUrl)
                };

                return TypedResults.SignOut(properties,
                    [CookieAuthenticationDefaults.AuthenticationScheme, OpenIdConnectDefaults.AuthenticationScheme]);
            });
            return group;
        }

    }

    extension(HttpContext context)
        {
            public string BuildRedirectUrl(string? redirectUrl)
            {
                if (string.IsNullOrEmpty(redirectUrl)) redirectUrl = "/";
                if (redirectUrl.StartsWith('/'))
                    redirectUrl = context.Request.Scheme + "://" + context.Request.Host + context.Request.PathBase +
                                  redirectUrl;
                return redirectUrl;
            }
        }
    
}

public record User
{
    public required bool IsAuthenticated { get; init; }
    public string? Sub { get; init; }
    public IEnumerable<UserClaim> Claims { get; init; } = [];
}

public sealed class UserClaim
{
    public required string Type { get; init; }
    public required string Value { get; init; }
}