using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using MongoDB.Driver.Encryption;
using UserRegistration.Services;
using UserRegistration.Validator;

namespace UserRegistration.Models
{
    public class User
    {
  
        [BsonRepresentation(BsonType.ObjectId), BsonId]
        public string? Id { get; set; }


        [Required, BsonElement,UserNameUnique]
        public string? UserName { get; set; }


        [RegularExpression(@"^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).+$"), Required, MinLength(8), BsonElement]
        public string? Password { get; set; }

        
        
        [Required, MinimumAgeValidator(18, ErrorMessage = "Age Must be 18+"), BsonElement] 
        public DateTime DateOfBirth { get; set; }

        [Required, DataType(DataType.EmailAddress,ErrorMessage = "Please Enter Valid Email"),EmailUserUnique] 
        public string? Email { get; set; }


        public RefreshToken? refreshToken { get; set; }=new RefreshToken()
        {
            Token=null,
            ExpireDate=DateTime.Now.AddDays(7),
        };
    }
}
