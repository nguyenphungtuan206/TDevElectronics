using Microsoft.EntityFrameworkCore;
using TDevElectronics.Models.Entities;

namespace TDevElectronics.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Bảng thuộc phạm vi phụ trách của bạn
        public DbSet<User> Users => Set<User>();
        public DbSet<AdminInvite> AdminInvites => Set<AdminInvite>();

        // Sau này B, C, D sẽ ghép thêm:
        // public DbSet<Product> Products => Set<Product>();
        // public DbSet<Order> Orders => Set<Order>();
        // public DbSet<Quote> Quotes => Set<Quote>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ràng buộc duy nhất cho Email của User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Ràng buộc tra cứu nhanh mã mời
            modelBuilder.Entity<AdminInvite>(entity =>
            {
                entity.HasIndex(i => i.CodeHash);
            });
        }
    }
}