using TDevElectronics.Models.ViewModels;

namespace TDevElectronics.Data
{
    public static class SampleData
    {
        public static List<CategoryItem> Categories = new()
        {
            new CategoryItem
            {
                Name = "Phones",
                Slug = "phones",
                HeroTitle = "Phones that keep up with you",
                HeroDescription = "Big screens, long days and cameras that make everyday moments look good.",
                HeroImageClass = "phone",
                Highlights = new()
                {
                    "5G ready",
                    "256GB storage",
                    "Everyday performance"
                },
                TipsTitle = "Find the right phone",
                Tips = new()
                {
                    "Choose storage based on how many photos and apps you use.",
                    "Compare battery life and camera features.",
                    "Check network compatibility before purchasing."
                }
            },

            new CategoryItem
            {
                Name = "Laptops",
                Slug = "laptops",
                HeroTitle = "Power for the way you work",
                HeroDescription = "Light enough for every commute, strong enough for the whole day.",
                HeroImageClass = "laptop",
                Highlights = new()
                {
                    "Everyday computing",
                    "Business ready",
                    "Portable performance"
                },
                TipsTitle = "How to choose a laptop",
                Tips = new()
                {
                    "Compare processor performance.",
                    "Check RAM and storage capacity.",
                    "Consider screen size and portability."
                }
            },

            new CategoryItem
            {
                Name = "Audio",
                Slug = "audio",
                HeroTitle = "Hear more. Hear less noise.",
                HeroDescription = "Over-ear comfort, pocket-sized buds or a speaker for the desk.",
                HeroImageClass = "headphones",
                Highlights = new()
                {
                    "Noise cancelling",
                    "All-day battery",
                    "Wireless audio"
                },
                TipsTitle = "Choose your audio device",
                Tips = new()
                {
                    "Over-ear headphones are useful for focused listening.",
                    "Earbuds are compact and easy to carry.",
                    "Check battery life and connectivity."
                }
            },

            new CategoryItem
            {
                Name = "Office Furniture",
                Slug = "office-furniture",
                HeroTitle = "Comfortable desks and chairs",
                HeroDescription = "Ergonomic chairs, standing desks and storage for offices.",
                HeroImageClass = "chair",
                Highlights = new()
                {
                    "Ergonomic design",
                    "Standing desks",
                    "Office organization"
                },
                TipsTitle = "Plan your workspace",
                Tips = new()
                {
                    "Check desk dimensions before purchasing.",
                    "Look for adjustable features.",
                    "Consider available workspace."
                }
            },

            new CategoryItem
            {
                Name = "Printers",
                Slug = "printers",
                HeroTitle = "Find the right printer",
                HeroDescription = "Reliable printing for home, office and business.",
                HeroImageClass = "printer",
                Highlights = new()
                {
                    "Laser printing",
                    "Ink tank",
                    "Wireless connectivity"
                },
                TipsTitle = "Compare printers",
                Tips = new()
                {
                    "Consider printing volume.",
                    "Compare ink or toner costs.",
                    "Check duplex and wireless features."
                }
            },

            new CategoryItem
            {
                Name = "Accessories",
                Slug = "accessories",
                HeroTitle = "Complete your setup",
                HeroDescription = "Hubs, chargers and cables, picked to work with your devices.",
                HeroImageClass = "hub",
                Highlights = new()
                {
                    "Fast charging",
                    "USB-C connectivity",
                    "Device compatibility"
                },
                TipsTitle = "Choose compatible accessories",
                Tips = new()
                {
                    "Check charging power requirements.",
                    "Compare available connection ports.",
                    "Check compatibility with your devices."
                }
            }
        };

        public static List<ProductItem> Products = new()
        {
            new ProductItem
            {
                Sku = "laptop",
                Name = "MacBook Air M4",
                Brand = "Apple",
                Category = "Laptops",
                CategorySlug = "laptops",
                Description = "13.6-inch · 16GB / 256GB · Sky blue",
                ImageClass = "laptop",
                GalleryImages = new() { "laptop", "laptop", "laptop" },
                Price = 1099,
                Rating = 4.9,
                ReviewCount = 128,
                Stock = 120,
                Overview = "The MacBook Air M4 combines portable design with powerful everyday performance.",
                Specifications = new()
                {
                    "Display: 13.6-inch Liquid Retina",
                    "Processor: Apple M4",
                    "Memory: 16GB unified memory",
                    "Storage: 256GB SSD",
                    "Connectivity: Thunderbolt 4 and MagSafe"
                },
                Warranty = "1-year Apple limited warranty",
                PriceTiers = new()
                {
                    new() { QuantityLabel = "1–9 units", UnitPrice = 1099, SavingLabel = "Retail" },
                    new() { QuantityLabel = "10–24 units", UnitPrice = 1049, SavingLabel = "$50 / unit" },
                    new() { QuantityLabel = "25+ units", UnitPrice = 999, SavingLabel = "$100 / unit" }
                }
            },

            new ProductItem
            {
                Sku = "headphones",
                Name = "Sony WH-1000XM5",
                Brand = "Sony",
                Category = "Audio",
                CategorySlug = "audio",
                Description = "Wireless · Noise cancelling · Black",
                ImageClass = "headphones",
                GalleryImages = new() { "headphones", "headphones", "headphones" },
                Price = 249,
                Rating = 4.8,
                ReviewCount = 246,
                Stock = 50,
                Overview = "Wireless over-ear headphones with noise cancelling and comfortable listening.",
                Specifications = new()
                {
                    "Type: Over-ear wireless",
                    "Noise cancelling: Yes",
                    "Connectivity: Bluetooth",
                    "Color: Black"
                },
                Warranty = "Manufacturer warranty",
                PriceTiers = new()
                {
                    new() { QuantityLabel = "1+ units", UnitPrice = 249, SavingLabel = "Retail" }
                }
            },

            new ProductItem
            {
                Sku = "hub",
                Name = "Anker 565 USB-C Hub",
                Brand = "Anker",
                Category = "Accessories",
                CategorySlug = "accessories",
                Description = "11-in-1 · 100W pass-through · Gray",
                ImageClass = "hub",
                GalleryImages = new() { "hub", "hub", "hub" },
                Price = 79,
                Rating = 4.7,
                ReviewCount = 92,
                Stock = 80,
                Overview = "A multi-port USB-C hub for connecting everyday devices.",
                Specifications = new()
                {
                    "Ports: 11-in-1",
                    "Power: 100W pass-through",
                    "Connection: USB-C",
                    "Color: Gray"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "phone",
                Name = "Galaxy S25",
                Brand = "Samsung",
                Category = "Phones",
                CategorySlug = "phones",
                Description = "256GB · 5G · Icy blue",
                ImageClass = "phone",
                GalleryImages = new() { "phone", "phone", "phone" },
                Price = 799,
                Rating = 4.8,
                ReviewCount = 174,
                Stock = 60,
                Overview = "A modern smartphone designed for everyday communication and entertainment.",
                Specifications = new()
                {
                    "Storage: 256GB",
                    "Network: 5G",
                    "Color: Icy blue"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "printer",
                Name = "HP LaserJet Pro M404dn",
                Brand = "HP",
                Category = "Printers",
                CategorySlug = "printers",
                Description = "Mono laser · 38 ppm · Duplex · Ethernet",
                ImageClass = "printer",
                GalleryImages = new() { "printer", "printer", "printer" },
                Price = 249,
                Rating = 4.9,
                ReviewCount = 63,
                Stock = 35,
                Overview = "A monochrome laser printer designed for office document printing.",
                Specifications = new()
                {
                    "Type: Monochrome laser",
                    "Speed: Up to 38 ppm",
                    "Printing: Automatic duplex",
                    "Connection: Ethernet"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "chair",
                Name = "Ergohuman Elite Mesh Chair",
                Brand = "Ergohuman",
                Category = "Office Furniture",
                CategorySlug = "office-furniture",
                Description = "Mesh back · Headrest · 4D armrests",
                ImageClass = "chair",
                GalleryImages = new() { "chair", "chair", "chair" },
                Price = 529,
                Rating = 4.6,
                ReviewCount = 112,
                Stock = 8,
                Overview = "An office chair with mesh back support and adjustable armrests.",
                Specifications = new()
                {
                    "Back: Mesh",
                    "Headrest: Included",
                    "Armrests: 4D adjustable"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "airpods",
                Name = "AirPods Pro 2",
                Brand = "Apple",
                Category = "Audio",
                CategorySlug = "audio",
                Description = "USB-C · Active noise cancellation",
                ImageClass = "airpods",
                GalleryImages = new() { "airpods", "airpods", "airpods" },
                Price = 199,
                Rating = 4.9,
                ReviewCount = 318,
                Stock = 90,
                Overview = "Compact wireless earbuds with active noise cancellation.",
                Specifications = new()
                {
                    "Connection: Bluetooth",
                    "Charging: USB-C",
                    "Noise cancelling: Active"
                },
                Warranty = "1-year Apple limited warranty"
            },

            new ProductItem
            {
                Sku = "iphone-16-pro",
                Name = "iPhone 16 Pro",
                Brand = "Apple",
                Category = "Phones",
                CategorySlug = "phones",
                Description = "256GB · Titanium · 48MP camera",
                ImageClass = "phone",
                GalleryImages = new() { "phone", "phone", "phone" },
                Price = 999,
                Rating = 4.9,
                ReviewCount = 101,
                Stock = 40,
                Overview = "A smartphone with a titanium design and advanced camera system.",
                Specifications = new()
                {
                    "Storage: 256GB",
                    "Material: Titanium",
                    "Camera: 48MP"
                },
                Warranty = "1-year Apple limited warranty"
            },

            new ProductItem
            {
                Sku = "macbook-pro-14",
                Name = "MacBook Pro 14 M4",
                Brand = "Apple",
                Category = "Laptops",
                CategorySlug = "laptops",
                Description = "14.2-inch · 16GB / 512GB · Space black",
                ImageClass = "laptop",
                GalleryImages = new() { "laptop", "laptop", "laptop" },
                Price = 1599,
                Rating = 4.9,
                ReviewCount = 138,
                Stock = 25,
                Overview = "A powerful laptop for demanding everyday work.",
                Specifications = new()
                {
                    "Display: 14.2-inch",
                    "Memory: 16GB",
                    "Storage: 512GB SSD",
                    "Color: Space black"
                },
                Warranty = "1-year Apple limited warranty"
            },

            new ProductItem
            {
                Sku = "wf-1000xm5",
                Name = "Sony WF-1000XM5",
                Brand = "Sony",
                Category = "Audio",
                CategorySlug = "audio",
                Description = "Noise cancelling · 8h battery",
                ImageClass = "airpods",
                GalleryImages = new() { "airpods", "airpods", "airpods" },
                Price = 299,
                Rating = 4.8,
                ReviewCount = 200,
                Stock = 45,
                Overview = "Compact wireless earbuds with noise cancelling.",
                Specifications = new()
                {
                    "Type: Wireless earbuds",
                    "Noise cancelling: Yes",
                    "Battery: Up to 8 hours"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "power-bank-737",
                Name = "Anker 737 Power Bank",
                Brand = "Anker",
                Category = "Accessories",
                CategorySlug = "accessories",
                Description = "24,000mAh · 140W · Smart display",
                ImageClass = "hub",
                GalleryImages = new() { "hub", "hub", "hub" },
                Price = 109,
                Rating = 4.7,
                ReviewCount = 138,
                Stock = 70,
                Overview = "A high-capacity portable power bank for compatible devices.",
                Specifications = new()
                {
                    "Capacity: 24,000mAh",
                    "Output: 140W",
                    "Display: Smart display"
                },
                Warranty = "Manufacturer warranty"
            },

            new ProductItem
            {
                Sku = "nano-65w",
                Name = "Anker Nano 65W Charger",
                Brand = "Anker",
                Category = "Accessories",
                CategorySlug = "accessories",
                Description = "GaN · 2 USB-C + 1 USB-A",
                ImageClass = "hub",
                GalleryImages = new() { "hub", "hub", "hub" },
                Price = 35,
                Rating = 4.8,
                ReviewCount = 85,
                Stock = 100,
                Overview = "A compact charger with multiple ports for compatible devices.",
                Specifications = new()
                {
                    "Technology: GaN",
                    "Ports: 2 USB-C and 1 USB-A",
                    "Power: 65W"
                },
                Warranty = "Manufacturer warranty"
            }
        };
    }
}