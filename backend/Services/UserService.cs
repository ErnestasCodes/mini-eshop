using web_api.Data;
using web_api.model;

namespace web_api.Services;

public class UserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public User? Create(User user)
    {
        if (string.IsNullOrWhiteSpace(user.Name) ||
            string.IsNullOrWhiteSpace(user.Email) ||
            string.IsNullOrWhiteSpace(user.Password))
        {
            return null;
        }

        var normalizedEmail = user.Email.Trim().ToLowerInvariant();
        var users = _db.Users.ToList();
        var exists = false;

        for (int i = 0; i < users.Count; i++)
        {
            var existingEmail = users[i].Email;
            if (existingEmail != null && existingEmail.ToLower() == normalizedEmail)
            {
                exists = true;
                break;
            }
        }

        if (exists)
        {
            return null;
        }

        user.Email = normalizedEmail;
        user.Password = PasswordHasher.Hash(user.Password);

        _db.Users.Add(user);
        _db.SaveChanges();
        return user;
    }

    public User? Login(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var users = _db.Users.ToList();
        User? user = null;

        for (int i = 0; i < users.Count; i++)
        {
            var existingEmail = users[i].Email;
            if (existingEmail != null && existingEmail.ToLower() == normalizedEmail)
            {
                user = users[i];
                break;
            }
        }

        if (user == null)
        {
            return null;
        }

        if (PasswordHasher.Verify(password, user.Password))
        {
            return user;
        }

        // Legacy support: if old records were stored as plain text, upgrade to hash after successful login.
        if (user.Password == password)
        {
            user.Password = PasswordHasher.Hash(password);
            _db.SaveChanges();
            return user;
        }

        return null;
    }

    public string? GetNameById(int id)
    {
        var users = _db.Users.ToList();

        for (int i = 0; i < users.Count; i++)
        {
            if (users[i].Id == id)
            {
                return users[i].Name;
            }
        }

        return null;
    }



    public List<User> GetAllUsers()
    {
        return _db.Users.ToList();
    }

    public int GetUserByName(string search)
    {
        var users = _db.Users.ToList();

        for (int i = 0; i < users.Count; i++)
        {
            if (users[i].Name == search)
            {
                return users[i].Age + users[i].Id ;
            }
        }

        return 0;
    }

    public List<string> CheckIsAdmin()
    {
        var users = _db.Users.ToList();
        List<string> admins = new List<string>();
        for (int i = 0; i < users.Count; i++)
        {
            if (users[i].IsAdmin)
            {
                admins.Add(users[i].Name);
            }
        }

        return admins;
    }
}
