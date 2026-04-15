using Microsoft.AspNetCore.Mvc;
using web_api.model;
using web_api.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Product product)
    {
        var created = _productService.CreateProduct(product);
        return Ok(created);
    }

    [HttpGet("Produktai")]
    public IActionResult GetAllProducts()
    {
        return Ok(_productService.GetAllProducts());
    }

    [HttpPut("Produktai/{id}")]
    public IActionResult UpdateProductById(int id, [FromBody] Product updated)
    {
        var result = _productService.UpdateProductById(id, updated);
        if (result == null)
            return NotFound("Produktas nerastas");

        return Ok(result);
    }

    [HttpDelete("Produktai/{id}")]
    public IActionResult DeleteProductById(int id)
    {
        var deleted = _productService.DeleteProductById(id);
        if (!deleted)
            return NotFound("Produktas nerastas");

        return Ok("Produktas istrintas");
    }
}
