using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserRegistration.Dtos;
using UserRegistration.Helpers;
using UserRegistration.Models;
using UserRegistration.Services;

namespace UserRegistration.Controllers
{
    [ApiController]
    [Route("api/[Controller]/[Action]")]
    public class UserController : Controller
    { 
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public UserController(UserService userService, JwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }
        [HttpPost]
        public IActionResult Register([FromBody] User NewUser)
        {

            NewUser.Password = PasswordHash.HashPassword(NewUser.Password);
            _ = _userService.CreateAsync(NewUser);
            return Ok();
        }


        [HttpPost]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            var token = _jwtService.Authenticate(loginModel);
            if (token == null)
            {
                return NotFound();
            }
            return Ok(token);
        }


        [HttpPost]
        public IActionResult RefreshToken([FromBody] Tokens token)
        {
            var tken = _jwtService.TokenRefresh(token);
            if (tken == null)
            {
                return BadRequest("Please provide solid Information");
            }
            else
                return Ok(tken);

        }


        


        [Authorize]
        [HttpGet]
        public async Task<List<UserResponseDto>> Get()
        {
            var users = await _userService.GetAsync();
            var result = users.Select(x => new UserResponseDto
            {
                Id=x.Id,
                UserName=x.UserName,
                DateOfBirth=x.DateOfBirth,
                Email=x.Email

            }).ToList();
            return result;
        }

        [Authorize]
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<UserResponseDto>> Get(string id)
        {
            var userDto = new UserResponseDto();
            var user=await _userService.GetAsync(id);
            if (user is null)
            {
                return NotFound();
            }
            userDto.DateOfBirth = user.DateOfBirth;
            userDto.UserName = user.UserName;
            userDto.Email = user.Email;
            return userDto;
        }
        [Authorize]
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetAsync(id);
            if (user is null)
            {
                return NotFound();
            }
            await _userService.RemoveAsync(id);
            return NoContent();
        }
        [Authorize]
        [HttpPut("{id:length(24)}")]
        public async Task<ActionResult> Update(string id,[FromBody] UpdateUserRequestDto userUpdateObj )
        {
            var user=await _userService.GetAsync(id);
            if (user is null)
            {
                return NotFound();
            }
            user.Email = userUpdateObj.Email;
            user.DateOfBirth= userUpdateObj.DateOfBirth;
            await _userService.UpdateAsync(user);
            return NoContent();
        }

    }
}
