namespace web_api.model;

public class Product
{
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int ProductId { get; set; }
    public int Stock { get; set; }
    
    public string Description { get; set; } = string.Empty;
}
