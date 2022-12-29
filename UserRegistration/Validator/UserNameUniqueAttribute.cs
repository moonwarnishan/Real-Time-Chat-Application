using System.ComponentModel.DataAnnotations;
using MongoDB.Driver;
using UserRegistration.Services;

namespace UserRegistration.Validator
{
    public class UserNameUniqueAttribute:ValidationAttribute
    {
        protected override ValidationResult? IsValid(
            object value, ValidationContext validationContext)
        {
            UserService? _context = validationContext.GetService(serviceType: typeof(UserService)) as UserService;
            var entity = _context?.Users().Find(x => x.UserName.ToUpper() == value.ToString().ToUpper()).FirstOrDefault();
            if (entity != null)
            {
                return new ValidationResult(GetErrorMessage(UserName: value.ToString()));
            }
            return ValidationResult.Success;
        }

        public string GetErrorMessage(string UserName)
        {
            return $"User Name {UserName} is already in use.";
        }
    }
}
