
using BackendForFrontend.Extensions.Yarp.Transforms;
using Microsoft.Extensions.Configuration.Json;
using Yarp.ReverseProxy.Transforms;

namespace BackendForFrontend.Extensions.Yarp;

public static class YarpExtensions
{
    extension(IHostApplicationBuilder builder)
    {
        public IHostApplicationBuilder AddBffYarpReverseProxy()
        {
           
            builder.Services.AddSingleton<AddBearerTokenToHeadersTransform>();

            builder.Configuration.AddJsonFile("yarp-config.json", optional: false, reloadOnChange: true).Build();


            builder.Services
                .AddReverseProxy()
                .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
                .AddTransforms(builderContext =>
                {
 
                    builderContext.RequestTransforms.Add(new RequestHeaderRemoveTransform("Cookie"));


                    if (!string.IsNullOrEmpty(builderContext.Route.AuthorizationPolicy) &&
                        builderContext.Route.AuthorizationPolicy != "Anonymous")
                    {
                        builderContext.RequestTransforms.Add(builderContext.Services
                            .GetRequiredService<AddBearerTokenToHeadersTransform>());
                    }
                    else
                    {
                        Console.WriteLine(builderContext.Route.RouteId);
                    }
                })
                .AddServiceDiscoveryDestinationResolver();


            return builder;
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