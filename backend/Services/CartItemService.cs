using web_api.Controllers;
using web_api.Data;
using web_api.model;

namespace web_api.Services;

public class AddToCartResult
{
    public CartItem? Item { get; set; }
    public string? Error { get; set; }
    public int StatusCode { get; set; } = 200;
}

public class CartItemService
{
    private readonly AppDbContext _db;

    public CartItemService(AppDbContext db)
    {
        _db = db;
    }

    public AddToCartResult AddToCart(AddToCartRequest request)
    {
        if (request.Quantity <= 0)
        {
            return new AddToCartResult
            {
                Error = "Quantity must be greater than 0.",
                StatusCode = 400
            };
        }

        var user = _db.Users.Find(request.UserId);
        if (user == null)
        {
            return new AddToCartResult
            {
                Error = "User not found.",
                StatusCode = 404
            };
        }

        var product = _db.Products.Find(request.ProductId);
        if (product == null)
        {
            return new AddToCartResult
            {
                Error = "Product not found.",
                StatusCode = 404
            };
        }

        if (product.Stock < request.Quantity)
        {
            return new AddToCartResult
            {
                Error = "Not enough stock.",
                StatusCode = 400
            };
        }

        var cartItems = _db.CartItems.ToList();
        CartItem? existing = null;

        for (int i = 0; i < cartItems.Count; i++)
        {
            if (cartItems[i].UserId == request.UserId && cartItems[i].ProductId == request.ProductId)
            {
                existing = cartItems[i];
                break;
            }
        }

        if (existing != null)
        {
            existing.Quantity += request.Quantity;
            _db.SaveChanges();

            return new AddToCartResult
            {
                Item = existing,
                StatusCode = 200
            };
        }

        var cartItem = new CartItem
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            Quantity = request.Quantity
        };

        _db.CartItems.Add(cartItem);
        _db.SaveChanges();

        return new AddToCartResult
        {
            Item = cartItem,
            StatusCode = 200
        };
    }

    public CartItem Create(CartItem cartItem)
    {
        _db.CartItems.Add(cartItem);
        _db.SaveChanges();
        return cartItem;
    }

    public List<CartItem> GetAllCartItems()
    {
        return _db.CartItems.ToList();
    }

    public bool DeleteCartItem(int id)
    {
        var item = _db.CartItems.Find(id);
        if (item == null)
        {
            return false;
        }

        _db.CartItems.Remove(item);
        _db.SaveChanges();
        return true;
    }

    public CartItem? UpdateQuantity(int id, CartItemController.UpdateQuantityRequest request)
    {
        var item = _db.CartItems.Find(id);
        if (item == null)
        {
            return null;
        }

        var product = _db.Products.Find(item.ProductId);
        if (product == null || product.Stock < request.Quantity)
        {
            return null;
        }

        item.Quantity = request.Quantity;
        _db.SaveChanges();
        return item;
    }

    public int ClearCart(int userId)
    {
        var allItems = _db.CartItems.ToList();
        var cart = new List<CartItem>();

        for (int i = 0; i < allItems.Count; i++)
        {
            if (allItems[i].UserId == userId)
            {
                cart.Add(allItems[i]);
            }
        }

        _db.CartItems.RemoveRange(cart);
        _db.SaveChanges();
        return cart.Count;
    }
}
