namespace TDevElectronics.Models.ViewModels
{
    public class ShopViewModel
    {
        public List<ProductItem> Items { get; set; } = new();

        public List<string> Brands { get; set; } = new();

        public string Query { get; set; } = string.Empty;

        public string Sort { get; set; } = "recommended";

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public string[] SelectedBrands { get; set; } = Array.Empty<string>();

        public CategoryItem? Category { get; set; }

        public int TotalResults { get; set; }
    }
}