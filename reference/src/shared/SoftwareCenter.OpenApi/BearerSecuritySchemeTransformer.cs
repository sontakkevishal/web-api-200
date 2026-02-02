namespace SoftwareCenter.OpenApi;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;

public sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider)
    : IOpenApiDocumentTransformer
{
    public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context,
        CancellationToken cancellationToken)
    {
        var config = context.ApplicationServices.GetRequiredService<IConfiguration>();
        var uri = config.GetValue<string>("Authentication:Schemes:OpenIdConnect:Authority") ??
                  throw new Exception("Missing configuration OpenIdConnect:Authority");
        var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();

        var securitySchemes = new Dictionary<string, IOpenApiSecurityScheme>
        {
            ["Bearer"] = new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer", // "bearer" refers to the header name here
                In = ParameterLocation.Header,
                BearerFormat = "Json Web Token",
                OpenIdConnectUrl = new Uri(uri)
            }
        };
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes = securitySchemes;
    }
}