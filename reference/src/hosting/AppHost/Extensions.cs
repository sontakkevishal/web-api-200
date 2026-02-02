namespace AppHost;

public static class Extensions
{
    extension(IResourceBuilder<ProjectResource> builder)
    {
        /// <summary>
        /// **Hypertheory Added**
        /// This is an extension method to configure the OpenID Connect Authority Environment Variable
        /// It gives you the endpoint of the identity container plus the /software path, which is the client.
        /// </summary>
        /// <param name="identity"></param>
        /// <returns></returns>
        public IResourceBuilder<ProjectResource> WithIdentityOpenIdAuthority(
            IResourceBuilder<ContainerResource> identity)
        {
            builder.WithEnvironment("Authentication__Schemes__OpenIdConnect__Authority",
                () => identity.Resource.GetEndpoint("http").Url + "/software");
            return builder;
        }

        /// <summary>
        /// ***Hypertheory Added***
        /// This is an extension method to configure the OpenID Connect Bearer Authority Environment Variable
        /// It gives you the endpoint of the identity container plus the /software path, which is the client.
        /// </summary>
        /// <param name="identity"></param>
        /// <returns></returns>
        public IResourceBuilder<ProjectResource> WithIdentityOpenIdBearer(IResourceBuilder<ContainerResource> identity)
        {
            builder.WithEnvironment("Authentication__Schemes__Bearer__Authority",
                () => identity.Resource.GetEndpoint("http").Url + "/software");
            return builder;
        }
    }
    
    extension<T>(IResourceBuilder<T> builder) where T : IResourceWithEnvironment
    {
        internal IResourceBuilder<T> WithSharedLoggingLevels()
        {
            var dict = new Dictionary<string, string>
            {
                { "Default", "Information" },
                { "System", "Warning" },
                { "Microsoft", "Warning" },
                { "Microsoft.Hosting", "Information" },
                { "NpgSql", "Warning" },
                { "Wolverine", "Warning" },
                { "Yarp", "Information" }
                
            };

            foreach (var item in dict.Keys) builder = builder.WithEnvironment($"Logging__LogLevel__{item}", dict[item]);
            return builder;
        }
    }
}