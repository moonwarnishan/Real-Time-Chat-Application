using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using UserRegistration.Models;
using UserRegistration.Services;

namespace UserRegistration.Validator
{
    public class EmailUserUniqueAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(
            object value, ValidationContext validationContext)
        {
            UserService? _context = validationContext.GetService(typeof(UserService)) as UserService;
            var entity = _context?.Users().Find(x => x.Email == value.ToString()).FirstOrDefault();

            if (entity != null)
            {
                return new ValidationResult(GetErrorMessage(value.ToString()));
            }
            return ValidationResult.Success;
        }

        public string GetErrorMessage(string email)
        {
            return $"Email {email} is already in use.";
        }
    }
}
