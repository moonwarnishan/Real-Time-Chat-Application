using StackExchange.Redis;
using UserRegistration.Dtos;

namespace UserRegistration.Services
{
    public class RedisCacheService
    {
        private readonly IConnectionMultiplexer _connection;
        private readonly UserService _userService;

        public RedisCacheService(IConnectionMultiplexer connection, UserService userService)
        {
            _connection = connection;
            _userService = userService;
        }

        public async Task<List<UserResponseDto>> OnlineUsers()
        {
            List<UserResponseDto> OnlineUsers = new List<UserResponseDto>();
            var db = _connection.GetServer("127.0.0.1:6379");
            RedisKey[]? OnlineUsersList = db.Keys(pattern: "dopamine_onlineUser:*").ToArray();
            foreach (string UserKey in OnlineUsersList)
            {
                var UserName = UserKey?.Split(":")[1];
                var user = _userService.FindByNameAsync(UserName.ToLower());
                var userDto = new UserResponseDto();
                try
                {
                    if (user != null)
                    {
                        userDto.Id = user.Id;
                        userDto.UserName = user.UserName;
                        userDto.DateOfBirth = user.DateOfBirth;
                        userDto.Email = user.Email;
                        OnlineUsers.Add(userDto);
                    }
                }
                catch (Exception)
                {
                    continue;
                }

            }

            return OnlineUsers.ToList();
        }

    }
}
