namespace TDevElectronics.Models.ViewModels
{
    public class CategoryItem
    {
        public string Name { get; set; } = string.Empty;

        public string Slug { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string HeroTitle { get; set; } = string.Empty;

        public string HeroDescription { get; set; } = string.Empty;

        public string HeroImageClass { get; set; } = string.Empty;

        public List<string> Highlights { get; set; } = new();

        public string TipsTitle { get; set; } = string.Empty;

        public List<string> Tips { get; set; } = new();
    }
}