using web_api.Data;
using web_api.model;

namespace web_api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db)
    {
        _db = db;
    }

    public Product CreateProduct(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.ProductName))
        {
            product.ProductName = "Unknown";
        }
        else
        {
            product.ProductName = product.ProductName.Trim();
        }

        _db.Products.Add(product);
        _db.SaveChanges();
        return product;
    }

    public List<Product> GetAllProducts()
    {
        return _db.Products.ToList();
    }

    public Product? UpdateProductById(int id, Product updated)
    {
        var product = _db.Products.Find(id);
        if (product == null) return null;

        product.ProductName = updated.ProductName;
        product.Price = updated.Price;
        product.Stock = updated.Stock;

        _db.SaveChanges();
        return product;
    }

    public bool DeleteProductById(int id)
    {
        var product = _db.Products.Find(id);
        if (product == null) return false;

        _db.Products.Remove(product);
        _db.SaveChanges();
        return true;
    }

    
}
