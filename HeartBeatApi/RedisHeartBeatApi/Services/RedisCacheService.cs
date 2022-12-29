using StackExchange.Redis;

namespace RedisHeartBeatApi.Services
{
    public class RedisCacheService
    {
        private readonly IConnectionMultiplexer _connection;

        public RedisCacheService(IConnectionMultiplexer connection)
        {
            _connection = connection;
        }


        public async Task SetCacheValueAsync(string key)
        {
            var db = _connection.GetDatabase();
            await db.StringSetAsync("dopamine_onlineUser:"+key,"OnlineUsers", TimeSpan.FromMinutes(1));
        }
    }
}
