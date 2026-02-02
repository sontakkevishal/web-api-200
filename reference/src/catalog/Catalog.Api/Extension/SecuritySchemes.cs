using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using SoftwareCenter.Security.Policies;

namespace Catalog.Api.Extension;

public static class SecuritySchemes
{
    extension(IServiceCollection services)
    {
        public IServiceCollection AddAuthenticationSchemes()
        {
      
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.MetadataAddress = options.Authority + "/.well-known/openid-configuration";
                    options.MapInboundClaims = false;
                });
        
            return services;
        }

        public IServiceCollection AddAuthorizationAndPolicies()
        {
            return services.AddAuthorization(options =>
            {
                options.AddPolicy("vendors:create", policy => policy.AddRequirements(new IsSoftwareCenterManagerRequirement()));
                options.AddPolicy("vendors:view", policy => policy.AddRequirements(new IsSoftwareCenterRequirement()));
            });
            
        }
    }
}

