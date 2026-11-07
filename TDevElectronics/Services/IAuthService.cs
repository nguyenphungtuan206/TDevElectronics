using TDevElectronics.Models.Entities;

namespace TDevElectronics.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message, User? User)> AuthenticateAsync(string email, string password, string requiredRole);
        Task<(bool Success, string Message, User? User)> RegisterCustomerAsync(string fullName, string email, string password);
        Task<(bool Success, string Message, User? User)> RegisterAdminByInviteAsync(string fullName, string email, string password, string inviteCode);
    }
}