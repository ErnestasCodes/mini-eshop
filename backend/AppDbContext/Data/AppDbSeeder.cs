using web_api.model;

namespace web_api.Data;

public static class AppDbSeeder
{
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
}
