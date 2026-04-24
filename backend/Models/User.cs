namespace web_api.model;

public class User
{
    public int Age { get; set; }
    public string Name { get; set; } = "";
    public int Id { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsReadOnlyAdmin { get; set; }
    public string? Surname { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Password { get; set; } = "";
}
