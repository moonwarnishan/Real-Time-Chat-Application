using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Newtonsoft.Json;
using UserRegistration.Models;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;
using System.IdentityModel.Tokens.Jwt;
using UserRegistration.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;

namespace UserRegistration.Services
{
    public class UserService
    {

        private readonly IMongoCollection<User> _usersCollection;
        public UserService(IOptions<DatabaseSetting> DBsetting)
        {
            var client = new MongoClient(DBsetting.Value.ConnectionString);
            var db = client.GetDatabase(DBsetting.Value.DatabaseName);
            _usersCollection = db.GetCollection<User>(DBsetting.Value.UserCollectionName);
            
        }

        public IMongoCollection<User> Users()
        {
            return _usersCollection;
        }
        public async Task CreateAsync(User newuser)
        {
            await _usersCollection.InsertOneAsync(newuser);
        }

        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetAsync(string id) =>
            await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();


        public async Task UpdateAsync(User updatedUser) =>
            await _usersCollection.ReplaceOneAsync(x => x.Id == updatedUser.Id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _usersCollection.DeleteOneAsync(x => x.Id == id);

        public User FindByNameAsync(string userName) =>
              _usersCollection.Find(x => x.UserName.ToLower() == userName).FirstOrDefault();

        public User LoginValidation(LoginModel M) =>
            _usersCollection.Find(x => x.UserName.ToLower() == M.UserName.ToLower() && x.Password == PasswordHash.HashPassword(M.Password)).FirstOrDefault();



    }
}
