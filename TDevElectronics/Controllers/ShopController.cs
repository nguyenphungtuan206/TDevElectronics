using Microsoft.AspNetCore.Mvc;
using TDevElectronics.Data;
using TDevElectronics.Models.ViewModels;

namespace TDevElectronics.Controllers
{
    public class ShopController : Controller
    {
        public IActionResult Index(
            string? q,
            string? sort,
            string[]? brands,
            decimal? minPrice,
            decimal? maxPrice,
            string? category)
        {
            var categoryItem = SampleData.Categories.FirstOrDefault(
                c => c.Slug.Equals(category, StringComparison.OrdinalIgnoreCase)
                  || c.Name.Equals(category, StringComparison.OrdinalIgnoreCase)
            );

            var model = BuildViewModel(
                q, sort, brands, minPrice, maxPrice, categoryItem
            );

            if (categoryItem != null)
                return View("Category", model);

            return View(model);
        }

        public IActionResult Category(
            string slug,
            string? q,
            string? sort,
            string[]? brands,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var category = SampleData.Categories.FirstOrDefault(
                c => c.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase)
            );

            if (category == null)
                return NotFound();

            var model = BuildViewModel(
                q, sort, brands, minPrice, maxPrice, category
            );

            return View(model);
        }

        private ShopViewModel BuildViewModel(
            string? q,
            string? sort,
            string[]? brands,
            decimal? minPrice,
            decimal? maxPrice,
            CategoryItem? category)
        {
            var items = SampleData.Products.AsEnumerable();

            if (category != null)
            {
                items = items.Where(p => p.CategorySlug == category.Slug);
            }

            if (!string.IsNullOrWhiteSpace(q))
            {
                items = items.Where(p =>
                    p.Name.Contains(q, StringComparison.OrdinalIgnoreCase)
                    || p.Brand.Contains(q, StringComparison.OrdinalIgnoreCase)
                );
            }

            if (brands != null && brands.Length > 0)
            {
                items = items.Where(p => brands.Contains(p.Brand));
            }

            if (minPrice.HasValue)
                items = items.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                items = items.Where(p => p.Price <= maxPrice.Value);

            items = sort switch
            {
                "price-asc" => items.OrderBy(p => p.Price),
                "price-desc" => items.OrderByDescending(p => p.Price),
                "rating" => items.OrderByDescending(p => p.Rating),
                _ => items.OrderBy(p => p.Name)
            };

            var result = items.ToList();

            var brandsInCategory = SampleData.Products
                .Where(p => category == null || p.CategorySlug == category.Slug)
                .Select(p => p.Brand)
                .Distinct()
                .OrderBy(b => b)
                .ToList();

            return new ShopViewModel
            {
                Items = result,
                Brands = brandsInCategory,
                Query = q ?? string.Empty,
                Sort = sort ?? "recommended",
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                SelectedBrands = brands ?? Array.Empty<string>(),
                Category = category,
                TotalResults = result.Count
            };
        }
    }
}