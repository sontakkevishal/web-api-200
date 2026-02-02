using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace SoftwareCenter.OpenApi;

internal static class AssemblyExtension
{
    extension<T>(T _) where T : Assembly
    {
        public static bool IsBuildingOpenApiDocs()
        {
            return Assembly.GetEntryAssembly()?.GetName().Name == "GetDocument.Insider";
        }
        
        public static bool NotBuildingOpenApiDocs()
        {
            return Assembly.GetEntryAssembly()?.GetName().Name != "GetDocument.Insider";
        }
  
    }
}



public static class OpenApiRelatedExtensions
{
    private const string CorsPolicyName = "ForScalar";
    extension(IServiceCollection services)
    {
        /// <summary>
        ///     Since we are using Scalar, we need to allow CORS during development to be able to test OpenAPI docs with the
        ///     Swagger UI.
        ///     This method adds a permissive CORS policy when not building OpenAPI docs.
        /// </summary>
        /// <returns></returns>
 

        /// <summary>
        ///     This adds OpenAPI with document transformers for BFF scenario and for local dev/testing.
        /// </summary>
        /// <param name="pathPrefix">
        ///     As dictated by the bff, usually "/api/{path}". This will be used in an additional tranform to
        ///     change the paths of your endpoints.
        /// </param>
        /// <param name="version">For the service OpenApi document</param>
        /// <typeparam name="TTransformer">Your transformer that adds scopes, and Info.</typeparam>
        /// <returns></returns>
        public IServiceCollection AddSoftwareCenterOpenApiWithTransforms<TTransformer>(
            string version) where TTransformer : SoftwareCenterOAuth2DocumentTransformer
        {
           services.AddOpenApi(version, config => config.AddDocumentTransformer<TTransformer>());
            return services;
        }
        public IServiceCollection AddSoftwareCenterOpenApiWithTransformsForBff(
            string version, string pathPrefixForBff) 
        {
            return services;
        }
        
    }


}