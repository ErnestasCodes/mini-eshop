using Microsoft.AspNetCore.Mvc;
using web_api.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var user = _userService.Login(request.Email, request.Password);

        if (user == null)
        {
            return Unauthorized("Neteisingas email arba password");
        }

        return Ok(new
        {
            message = "Prisijungimas sekmingas",
            user = new
            {
                user.Id,
                user.Name,
                user.Surname,
                user.Email,
                user.Phone,
                user.Age,
                user.IsAdmin
            }
        });
    }
}
