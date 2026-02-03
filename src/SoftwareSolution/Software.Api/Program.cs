using Marten;

var builder = WebApplication.CreateBuilder(args); // Hey Microsoft, give me the stuff you think I'll need.
builder.AddNpgsqlDataSource("software-db");
builder.AddServiceDefaults(); // Add our "standard" resiliency, open telemetry, all that.
// ASPNETCORE_ENVIRONMENT=Tacos
// The last place is the actual environment variables on the machine.


//var salesDiscountAmount = builder.Configuration.GetValue<decimal>("sales-discount");
//var connectionString = builder.Configuration.GetConnectionString("software-db") ??
//    throw new Exception("Cannnot start without a connection string");

// Add services to the container.

builder.Services.AddMarten(config =>
{

}).UseNpgsqlDataSource()
.UseLightweightSessions();


builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();



// Above this line is "configuration" - mostly services
var app = builder.Build();
// after this line is "middleware" - configuration about how endpoints should be exposed

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapDefaultEndpoints(); // this adds the endpoints defined in the ServiceDefaults - which are mostly for health checks.
app.Run();
