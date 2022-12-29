namespace UserRegistration.Dtos
{
    public class UserResponseDto
    {
        public string? Id { get; set; }
        public string UserName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
    }
}
