using Microsoft.EntityFrameworkCore;
using TDevElectronics.Data;
using TDevElectronics.Helpers;
using TDevElectronics.Models.Entities;

namespace TDevElectronics.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private const int MaxFailedAttempts = 8;
        private const int LockoutMinutes = 15;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string Message, User? User)> AuthenticateAsync(string email, string password, string requiredRole)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.Trim().ToLower());
            if (user == null)
            {
                return (false, "Email hoặc mật khẩu không chính xác.", null);
            }

            if (!user.IsActive)
            {
                return (false, "Tài khoản của bạn đã bị vô hiệu hóa.", null);
            }

            // Kiểm tra trạng thái khóa tài khoản sau 8 lần sai trong 15 phút
            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
            {
                var remaining = Math.Ceiling((user.LockoutEnd.Value - DateTime.UtcNow).TotalMinutes);
                return (false, $"Tài khoản bị tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau {remaining} phút.", null);
            }

            // Kiểm tra mật khẩu bằng PasswordHelper (PBKDF2)
            bool isPasswordValid = PasswordHelper.VerifyPassword(password, user.PasswordHash, user.PasswordSalt);
            if (!isPasswordValid)
            {
                user.FailedLoginAttempts++;
                if (user.FailedLoginAttempts >= MaxFailedAttempts)
                {
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(LockoutMinutes);
                    user.FailedLoginAttempts = 0; // Reset số lần sau khi đã kích hoạt khóa
                }
                await _context.SaveChangesAsync();

                int leftAttempts = MaxFailedAttempts - user.FailedLoginAttempts;
                string warn = leftAttempts > 0 ? $" Bạn còn {leftAttempts} lần thử." : " Tài khoản đã bị tạm khóa 15 phút.";
                return (false, "Email hoặc mật khẩu không chính xác." + warn, null);
            }

            // Kiểm tra quyền truy cập (Admin hay Customer)
            if (requiredRole == "Admin" && user.Role != "Admin")
            {
                return (false, "Bạn không có quyền truy cập vào trang quản trị.", null);
            }

            // Đăng nhập thành công -> Reset số lần đăng nhập sai
            user.FailedLoginAttempts = 0;
            user.LockoutEnd = null;
            await _context.SaveChangesAsync();

            return (true, "Đăng nhập thành công.", user);
        }

        public async Task<(bool Success, string Message, User? User)> RegisterCustomerAsync(string fullName, string email, string password)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email.ToLower() == email.Trim().ToLower());
            if (exists)
            {
                return (false, "Email này đã được sử dụng.", null);
            }

            var (hash, salt) = PasswordHelper.HashPassword(password);
            var newUser = new User
            {
                FullName = fullName.Trim(),
                Email = email.Trim().ToLower(),
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = "Customer",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return (true, "Đăng ký thành công.", newUser);
        }

        public async Task<(bool Success, string Message, User? User)> RegisterAdminByInviteAsync(string fullName, string email, string password, string inviteCode)
        {
            // Kiểm tra mật khẩu admin tối thiểu 12 ký tự theo yêu cầu
            if (string.IsNullOrWhiteSpace(password) || password.Length < 12)
            {
                return (false, "Mật khẩu Admin yêu cầu tối thiểu 12 ký tự.", null);
            }

            // Kiểm tra mã mời bằng chuỗi băm SHA-256
            string codeHash = PasswordHelper.ComputeSha256(inviteCode.Trim().ToUpperInvariant());
            var invite = await _context.AdminInvites.FirstOrDefaultAsync(i => i.CodeHash == codeHash);

            if (invite == null || invite.IsRevoked || invite.ExpiresAt < DateTime.UtcNow || invite.UsedAt != null)
            {
                return (false, "Mã mời không hợp lệ, đã hết hạn hoặc đã được sử dụng.", null);
            }

            if (!string.IsNullOrEmpty(invite.TargetEmail) &&
                !invite.TargetEmail.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase))
            {
                return (false, "Mã mời này chỉ áp dụng cho đúng email được chỉ định.", null);
            }

            var (hash, salt) = PasswordHelper.HashPassword(password);
            var newAdmin = new User
            {
                FullName = fullName.Trim(),
                Email = email.Trim().ToLower(),
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(newAdmin);
            await _context.SaveChangesAsync();

            // Đánh dấu mã mời đã dùng
            invite.UsedAt = DateTime.UtcNow;
            invite.UsedByUserId = newAdmin.Id;
            await _context.SaveChangesAsync();

            return (true, "Đăng ký tài khoản Admin thành công.", newAdmin);
        }
    }
}