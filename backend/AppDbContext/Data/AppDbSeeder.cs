using web_api.model;
using web_api.Services;

namespace web_api.Data;

public static class AppDbSeeder
{
    public static void SeedUsers(AppDbContext db)
    {
        SeedUser(
            db,
            name: "Admin",
            surname: "User",
            email: "admin@example.com",
            password: "Admin123!",
            isAdmin: true,
            isReadOnlyAdmin: true,
            age: 30,
            phone: "+37060000001");

        SeedUser(
            db,
            name: "User",
            surname: "User",
            email: "user@example.com",
            password: "User123!",
            isAdmin: false,
            isReadOnlyAdmin: false,
            age: 24,
            phone: "+37060000002");
    }

    public static void SeedProducts(AppDbContext db)
    {
        if (db.Products.Any())
        {
            return;
        }

        db.Products.AddRange(
            new Product
            {
                ProductName = "Basic Marskineliai",
                Price = 29.99m,
                Stock = 14,
                Description = "Minksti medvilnes marskineliai kasdieniam miesto ritmui ir lengvam derinimui."
            },
            new Product
            {
                ProductName = "Oversized Dzemperis",
                Price = 64.90m,
                Stock = 7,
                Description = "Patogus dzemperis vesesniems vakarams, sluoksniavimui ir ramiam minimalistiniam stiliui."
            },
            new Product
            {
                ProductName = "Lengva Striuke",
                Price = 119.00m,
                Stock = 3,
                Description = "Kasdiena striuke pereinamam sezonui su svariu siluetu ir patogiu prigludimu."
            },
            new Product
            {
                ProductName = "Megzta Kepure",
                Price = 19.50m,
                Stock = 11,
                Description = "Silta kepure ir subtilus aksesuaras kasdieniams deriniams vesesniu oru."
            });

        db.SaveChanges();
    }

    private static void SeedUser(
        AppDbContext db,
        string name,
        string surname,
        string email,
        string password,
        bool isAdmin,
        bool isReadOnlyAdmin,
        int age,
        string phone)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var existingUser = db.Users.SingleOrDefault(user => user.Email != null && user.Email.ToLower() == normalizedEmail);

        if (existingUser != null)
        {
            existingUser.Name = name;
            existingUser.Surname = surname;
            existingUser.IsAdmin = isAdmin;
            existingUser.IsReadOnlyAdmin = isReadOnlyAdmin;
            existingUser.Age = age;
            existingUser.Phone = phone;
            existingUser.Email = normalizedEmail;

            if (existingUser.Password == password || !PasswordHasher.Verify(password, existingUser.Password))
            {
                existingUser.Password = PasswordHasher.Hash(password);
            }
        }
        else
        {
            db.Users.Add(new User
            {
                Name = name,
                Surname = surname,
                Email = normalizedEmail,
                Password = PasswordHasher.Hash(password),
                IsAdmin = isAdmin,
                IsReadOnlyAdmin = isReadOnlyAdmin,
                Age = age,
                Phone = phone
            });
        }

        db.SaveChanges();
    }
}
