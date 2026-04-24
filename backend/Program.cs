using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using web_api.Data;
using web_api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var rawConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                         ?? "Data Source=identifier.sqlite";
var sqliteBuilder = new SqliteConnectionStringBuilder(rawConnectionString);
if (!Path.IsPathRooted(sqliteBuilder.DataSource))
{
    sqliteBuilder.DataSource = Path.Combine(builder.Environment.ContentRootPath, sqliteBuilder.DataSource);
}

builder.Services.AddCors(ConfigureCors);
builder.Services.AddDbContext<AppDbContext>(ConfigureDbContext);

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<CartItemService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    AppDbSeeder.SeedUsers(db);
    AppDbSeeder.SeedProducts(db);
}

app.UseHttpsRedirection();
app.UseCors("Front");
app.MapControllers();
app.Run();

void ConfigureCors(Microsoft.AspNetCore.Cors.Infrastructure.CorsOptions options)
{
    options.AddPolicy("Front", ConfigureFrontPolicy);
}

void ConfigureFrontPolicy(Microsoft.AspNetCore.Cors.Infrastructure.CorsPolicyBuilder policy)
{
    policy.WithOrigins("http://localhost:5173");
    policy.AllowAnyHeader();
    policy.AllowAnyMethod();
}

void ConfigureDbContext(DbContextOptionsBuilder options)
{
    options.UseSqlite(sqliteBuilder.ToString());
}
