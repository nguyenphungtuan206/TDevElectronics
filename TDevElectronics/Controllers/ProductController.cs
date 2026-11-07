
using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TDevElectronics.Data;

namespace TDevElectronics.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Detail(string sku)
        {
            // Kiểm tra SKU đầu vào
            if (string.IsNullOrWhiteSpace(sku))
            {
                return NotFound();
            }

            // Tìm sản phẩm theo SKU, không phân biệt chữ hoa/chữ thường
            var product = SampleData.Products.FirstOrDefault(
                p => !string.IsNullOrWhiteSpace(p.Sku) &&
                     p.Sku.Equals(
                         sku,
                         StringComparison.OrdinalIgnoreCase
                     )
            );

            // Không tìm thấy sản phẩm
            if (product == null)
            {
                return NotFound();
            }

            // Trả về trang chi tiết sản phẩm
            return View(product);
        }
    }
}
