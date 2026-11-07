using System;
using System.ComponentModel.DataAnnotations;

namespace TDevElectronics.Models.Entities
{
    public class AdminInvite
    {
        public int Id { get; set; }

        // Lưu chuỗi băm SHA-256 của mã mời
        [Required, MaxLength(64)]
        public string CodeHash { get; set; } = string.Empty;

        // Lưu 4 ký tự cuối để hiển thị trên danh sách quản trị
        [Required, MaxLength(4)]
        public string LastFourChars { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? TargetEmail { get; set; }

        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime? UsedAt { get; set; }
        public int? UsedByUserId { get; set; }

        public int CreatedByAdminId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}