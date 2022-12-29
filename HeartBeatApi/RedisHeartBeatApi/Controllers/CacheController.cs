using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedisHeartBeatApi.Services;

namespace RedisHeartBeatApi.Controllers
{
    [Route("api/[controller]")]
    public class CacheController : Controller
    {

        private readonly RedisCacheService _redisCacheService;

        public CacheController(RedisCacheService redisCacheService)
        {
            _redisCacheService = redisCacheService;
        }

        
        [HttpPost]
        public IActionResult Post([FromBody]string key)
        {
            _redisCacheService.SetCacheValueAsync(key);
            return Ok();
        }
    }
}
