namespace TDevElectronics.Models.ViewModels
{
    public class ProductItem
    {
        public string Sku { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Brand { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string CategorySlug { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string ImageClass { get; set; } = string.Empty;

        public List<string> GalleryImages { get; set; } = new();

        public decimal Price { get; set; }

        public double Rating { get; set; }

        public int ReviewCount { get; set; }

        public int Stock { get; set; }

        public string Overview { get; set; } = string.Empty;

        public List<string> Specifications { get; set; } = new();

        public string Warranty { get; set; } = string.Empty;

        public List<PriceTier> PriceTiers { get; set; } = new();
    }

    public class PriceTier
    {
        public string QuantityLabel { get; set; } = string.Empty;

        public decimal UnitPrice { get; set; }

        public string SavingLabel { get; set; } = string.Empty;
    }
}