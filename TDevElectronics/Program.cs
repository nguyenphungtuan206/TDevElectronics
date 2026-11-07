using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using TDevElectronics.Data;
using TDevElectronics.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Controller & Views
builder.Services.AddControllersWithViews();

// 2. CSDL SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. Đăng ký Cookie Authentication với phân quyền Customer và Admin
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.LogoutPath = "/Account/Logout";
        options.AccessDeniedPath = "/Home/NotFound";
        options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true;
        options.Cookie.Name = "TDevElectronics.Auth";
    });

// 4. Đăng ký dịch vụ xác thực
builder.Services.AddScoped<IAuthService, AuthService>();

// 5. Cấu hình Session
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/Home/NotFound");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Thứ tự Middleware quan trọng: Authentication trước Authorization
app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

// Mock API /api/me cung cấp thông tin người dùng đang đăng nhập
app.MapGet("/api/me", (HttpContext context) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        return Results.Ok(new
        {
            authenticated = true,
            name = context.User.Identity.Name,
            role = context.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "Customer"
        });
    }

    return Results.Ok(new
    {
        authenticated = false,
        name = "Khách thử nghiệm",
        email = "guest@tdevelectronics.local",
        role = "Guest"
    });
});

// Route cho Area Admin (ưu tiên chạy trước route mặc định)
app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Tự động nạp dữ liệu mẫu ban đầu trong môi trường Development
if (app.Environment.IsDevelopment())
{
    try
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await DbSeeder.SeedAsync(dbContext);
    }
    catch
    {
        // Bỏ qua lỗi kết nối CSDL nếu chạy ở máy không có SQL Server local
    }
}

app.Run();