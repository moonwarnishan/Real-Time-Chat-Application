using Microsoft.AspNetCore.Mvc;
using UserRegistration.Dtos;
using UserRegistration.Services;

namespace UserRegistration.Controllers
{
    [Route("api/[controller]")]
    public class OnlineUsersController : Controller
    {
        private readonly RedisCacheService _RedisService;
        public OnlineUsersController(RedisCacheService RedisService)
        {
            _RedisService = RedisService;
        }
        [HttpGet]
        public IActionResult GetOnlineUsers()
        {
            var onlineUsers = _RedisService.OnlineUsers();
            return Ok(onlineUsers);
        }
    }
}
