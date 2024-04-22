using NotificationService;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.AddConsole();
builder.Configuration.AddEnvironmentVariables("HHB_");

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();
startup.Configure(app, app.Environment);

app.Run();
