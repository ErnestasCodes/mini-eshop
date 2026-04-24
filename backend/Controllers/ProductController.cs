using Microsoft.AspNetCore.Mvc;
using web_api.Data;
using web_api.model;
using web_api.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductController : ControllerBase
{
    private const string AdminUserIdHeader = "X-User-Id";
    private readonly IProductService _productService;
    private readonly AppDbContext _db;

    public ProductController(IProductService productService, AppDbContext db)
    {
        _productService = productService;
        _db = db;
    }

    [HttpPost]
    public IActionResult Post([FromBody] Product product)
    {
        var accessError = RequireWritableAdmin();
        if (accessError != null)
        {
            return accessError;
        }

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
        var accessError = RequireWritableAdmin();
        if (accessError != null)
        {
            return accessError;
        }

        var result = _productService.UpdateProductById(id, updated);
        if (result == null)
            return NotFound("Produktas nerastas");

        return Ok(result);
    }

    [HttpDelete("Produktai/{id}")]
    public IActionResult DeleteProductById(int id)
    {
        var accessError = RequireWritableAdmin();
        if (accessError != null)
        {
            return accessError;
        }

        var deleted = _productService.DeleteProductById(id);
        if (!deleted)
            return NotFound("Produktas nerastas");

        return Ok("Produktas istrintas");
    }

    private IActionResult? RequireWritableAdmin()
    {
        if (!Request.Headers.TryGetValue(AdminUserIdHeader, out var rawUserId) ||
            !int.TryParse(rawUserId, out var userId) ||
            userId <= 0)
        {
            return Unauthorized("Administratoriaus sesija nerasta.");
        }

        var user = _db.Users.Find(userId);
        if (user == null)
        {
            return Unauthorized("Vartotojas nerastas.");
        }

        if (!user.IsAdmin)
        {
            return StatusCode(StatusCodes.Status403Forbidden, "Tik administratorius gali keisti produktus.");
        }

        if (user.IsReadOnlyAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Si administratoriaus paskyra turi tik perziuros teises."
            );
        }

        return null;
    }
}
