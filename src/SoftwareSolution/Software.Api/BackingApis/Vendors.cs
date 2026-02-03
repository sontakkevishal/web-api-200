using Marten;

namespace Software.Api.BackingApis;

public class Vendors(HttpClient client, IConfiguration config)
{

    // Todo: think aobut using a cancellation token?
    public async Task<Boolean> CheckIfVendorExistsAsync(Guid vendorId, CancellationToken token)
    {
        
        var apiKey = config.GetValue<string>("VENDOR_API_KEY"); // throwing here is too late maybe.
        // The Url to to API - don't set that here. That's in program.cs.
        var response = await client.GetAsync($"/vendors/{vendorId}?apiKey={apiKey}", token);

        // add some stuff, whatever

      
        if (response.StatusCode == System.Net.HttpStatusCode.OK) {

            return true;
        } 
        if(response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
        // don't get fancy with exception handling here. Or anywhere, on HTTP calls.

        response.EnsureSuccessStatusCode();

        return false;
        // I am HOPING for a 404, but any other error - non 200-299 status code
        // which would include not being able to connect to the server, or whatever, should be
        // an error and we should throw an exception.

    
    }
}
