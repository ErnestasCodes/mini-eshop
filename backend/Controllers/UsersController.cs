using Microsoft.AspNetCore.Mvc;
using web_api.model;
using web_api.Services;

namespace web_api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public IActionResult Post([FromBody] User user)
    {
        var created = _userService.Create(user);

        if (created == null)
            return BadRequest("Name, email ir password privalomi. Email turi buti unikalus.");

        return Ok(new
        {
            created.Id,
            created.Name,
            created.Surname,
            created.Email,
            created.Phone,
            created.Age,
            created.IsAdmin
        });
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var name = _userService.GetNameById(id);
        return name == null ? NotFound() : Ok(name);
    }

    [HttpGet]
    public IActionResult GetAllUsers()
    {
        return Ok(_userService.GetAllUsers());
    }

    [HttpGet("search")]
    public IActionResult GetUserByName(string search)
    {
        return Ok(_userService.GetUserByName(search));
    }

    [HttpGet("isadmin")]
    public IActionResult CheckIsAdmin()
    {
        return Ok(_userService.CheckIsAdmin());
    }
}
