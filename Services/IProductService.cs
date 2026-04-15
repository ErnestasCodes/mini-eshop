using web_api.model;

namespace web_api.Services;

public interface IProductService
{
    Product CreateProduct(Product product);
    List<Product> GetAllProducts();
    Product? UpdateProductById(int id, Product updated);
    bool DeleteProductById(int id);
}
