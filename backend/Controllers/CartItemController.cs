using Microsoft.AspNetCore.Mvc;
using web_api.model;
using web_api.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/cart")]
public class CartItemController : ControllerBase
{
    private readonly CartItemService _cartItemService;

    public CartItemController(CartItemService cartItemService)
    {
        _cartItemService = cartItemService;
    }

    [HttpPost]
    public IActionResult Post([FromBody] AddToCartRequest request)
    {
        var result = _cartItemService.AddToCart(request);

        if (result.Error != null)
        {
            return StatusCode(result.StatusCode, new { message = result.Error });
        }

        return Ok(result.Item);
    }

    [HttpGet]
    public IActionResult GetAllCartItems()
    {
        var result = _cartItemService.GetAllCartItems();

        return Ok(result);
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeleteCartItem(int id)
    {
        var result   = _cartItemService.DeleteCartItem(id);
        return Ok(result);
    }

    public class UpdateQuantityRequest
    {
        public int Quantity { get; set; }
    }
    
    [HttpPatch("update/quantity/{id}")]
    public IActionResult? UpdateQuantity(int id, UpdateQuantityRequest request)
    {
        if (request == null || request.Quantity < 0)
        {
            return BadRequest("Quantity cannot be negative");
        }

        var result = _cartItemService.UpdateQuantity(id, request);
        return Ok(result);
    }

    [HttpDelete("clear/{userid}")]
    public IActionResult ClearCart(int userid)
    {
        if (userid <= 0)
        {
            return BadRequest("UserID cannot be negative");
        }
        var result = _cartItemService.ClearCart(userid);
        return Ok(result);
    }
    
}
