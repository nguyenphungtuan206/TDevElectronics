(() => {
    "use strict";

    // Product detail tabs
    document.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-tab]");

        if (tab) {
            const container = tab.closest(".product-tabs");

            if (!container) return;

            const name = tab.dataset.tab;

            container.querySelectorAll("[data-tab]").forEach((item) => {
                item.classList.toggle("on", item === tab);
            });

            container.querySelectorAll("[data-tab-panel]").forEach((panel) => {
                panel.hidden = panel.dataset.tabPanel !== name;
            });

            return;
        }

        // Product gallery thumbnails
        const thumbnail = event.target.closest("[data-image]");

        if (thumbnail) {
            const gallery = thumbnail.closest(".product-gallery");

            if (!gallery) return;

            const mainImage = gallery.querySelector("#product-main-image");

            if (!mainImage) return;

            mainImage.className =
                "ph " + thumbnail.dataset.image + " product-main-image";

            gallery.querySelectorAll("[data-image]").forEach((item) => {
                item.classList.toggle("active", item === thumbnail);
            });
        }
    });

})();