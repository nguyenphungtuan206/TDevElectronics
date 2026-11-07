using TDevElectronics.Helpers;
using TDevElectronics.Models.Entities;

namespace TDevElectronics.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Tự động kiểm tra và tạo database nếu chưa có
            await context.Database.EnsureCreatedAsync();

            // Chỉ tạo admin mặc định nếu bảng Users chưa có admin nào
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                var (hash, salt) = PasswordHelper.HashPassword("Admin@12345678");

                var defaultAdmin = new User
                {
                    FullName = "Quản trị viên hệ thống",
                    Email = "admin@tdevelectronics.local",
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(defaultAdmin);
                await context.SaveChangesAsync();
            }
        }
    }
}