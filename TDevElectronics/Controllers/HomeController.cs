
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TDevElectronics.Models;
using TDevElectronics.Data;

namespace TDevElectronics.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View(SampleData.Products);
        }

        public IActionResult About() => View();
        public IActionResult Support() => View();
        public IActionResult Privacy() => View();
        public IActionResult Terms() => View();
        public IActionResult BusinessBuying() => View();

        public IActionResult NotFoundPage() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier
            });
        }
    }
}
    