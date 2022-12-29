using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using UserRegistration.Validator;

namespace UserRegistration.Dtos
{
    public class UpdateUserRequestDto
    {
        [Required]
        public string UserName { get; set; }

        [Required, DataType(DataType.EmailAddress, ErrorMessage = "Please Enter Valid Email"), EmailUserUniqueDto]
        public string Email { get; set; }

        [Required, MinimumAgeValidator(18)]
        public DateTime DateOfBirth { get; set; }
    }
}
