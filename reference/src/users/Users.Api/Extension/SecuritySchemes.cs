using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Users.Api.Extension;

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
            return services.AddAuthorization();
        }
    }
}