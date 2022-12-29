using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using UserRegistration.Helpers;
using UserRegistration.Models;

namespace UserRegistration.Services
{
    public class JwtService
    {
        private readonly UserService _userService;
        private readonly string Key;
        public JwtService(UserService userService, IConfiguration configuration)
        {
            _userService = userService;
            Key = configuration.GetSection("JWTKey").ToString();
        }

        public Tokens Authenticate(LoginModel M)
        {

            var tken = new Tokens();
            var user = _userService.LoginValidation(M);
            if (user == null)
            {
                return null;
            }
            var refreshToken = GenerateRefreshToken();
            user.refreshToken.Token = refreshToken;
            user.refreshToken.ExpireDate = DateTime.Now.AddDays(7);
            _userService.UpdateAsync(user);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(Key);
            var claim = new List<Claim>
            {
                    new Claim("Id", user.Id),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Email,user.Email)
            };
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claim),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature
            )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            tken.AccessToken = tokenHandler.WriteToken(token);
            tken.RefreshToken = refreshToken;

            return tken;
        }
        public Tokens TokenRefresh(Tokens token)
        {
            if (token is null)
            {
                return null;
            }

            string? accessToken = token.AccessToken.ToString();
            string? refreshToken = token.RefreshToken.ToString();
            var principal = GetPrincipalFromExpiredToken(accessToken);
            if (principal == null)
            {
                return null;
            }

            string username = principal.Identity.Name;
            var user = _userService.FindByNameAsync(username);
            if (user == null || user.refreshToken.Token != refreshToken || user.refreshToken.ExpireDate <= DateTime.Now)
            {
                return null;
            }

            var newAccessToken = CreateToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();
            user.refreshToken.Token = newRefreshToken;
            user.refreshToken.ExpireDate = DateTime.Now.AddDays(7);
            _userService.UpdateAsync(user);
            var tok = new Tokens();

            tok.AccessToken = newAccessToken;
            tok.RefreshToken = newRefreshToken;
            return tok;
        }



        private string CreateToken(List<Claim> Claim)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(Key);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(Claim),
                Expires = DateTime.UtcNow.AddSeconds(15),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature
            )
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tken = tokenHandler.WriteToken(token);
            return tken;
        }




        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Key)),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken)
                throw new SecurityTokenException("Invalid token");

            return principal;

        }




        public static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
