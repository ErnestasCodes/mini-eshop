using Microsoft.EntityFrameworkCore;
using web_api.model;

namespace web_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users
    {
        get
        {
            return Set<User>();
        }
    }

    public DbSet<Product> Products
    {
        get
        {
            return Set<Product>();
        }
    }

    public DbSet<CartItem> CartItems
    {
        get
        {
            return Set<CartItem>();
        }
    }
}
