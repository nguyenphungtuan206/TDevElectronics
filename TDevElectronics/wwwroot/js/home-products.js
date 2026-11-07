(() => {
    "use strict";

    const DEFAULT_PRODUCTS = [
        "laptop",
        "headphones",
        "hub",
        "phone",
        "airpods",
        "printer",
        "chair",
        "iphone-16-pro",
        "macbook-pro-14",
        "wf-1000xm5",
        "power-bank-737",
        "nano-65w"
    ];

    const source = document.querySelector("#pc-src");
    const grid = document.querySelector("#home .g4");

    if (!source || !grid) return;

    const products = new Map();

    source.querySelectorAll(".pc[data-k]").forEach((card) => {
        products.set(card.dataset.k, card);
    });

    grid.innerHTML = "";

    DEFAULT_PRODUCTS.forEach((sku) => {
        const card = products.get(sku);

        if (!card) return;

        const clone = card.cloneNode(true);

        clone.removeAttribute("style");

        grid.appendChild(clone);
    });

})();