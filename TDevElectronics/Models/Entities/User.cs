using System;
using System.ComponentModel.DataAnnotations;

namespace TDevElectronics.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, MaxLength(150), EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string PasswordSalt { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Role { get; set; } = "Customer"; // "Customer" hoặc "Admin"

        public bool IsActive { get; set; } = true;

        public int FailedLoginAttempts { get; set; } = 0;
        public DateTime? LockoutEnd { get; set; }

        // Lưu ảnh đại diện base64 và thông số cắt cúp/xoay/lật theo yêu cầu
        public string? AvatarJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}