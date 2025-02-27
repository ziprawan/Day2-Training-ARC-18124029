const USD_TO_IDR = 16370;

/**
 * Convert number into IDR Currency
 * @param {number} num
 */
function formatCurrency(num) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
}

/**
 * Idk, I use this for autocomplete only
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {Record<string, string>} attrs
 * @param {Array<HTMLElement> | undefined} [childs=undefined]
 */
function createElement(tagName, attrs, childs = undefined) {
  const elem = document.createElement(tagName);

  Object.entries(attrs).forEach(([key, val]) => {
    elem.setAttribute(key, val);
  });

  if (childs && Array.isArray(childs)) {
    childs.forEach((child) => {
      elem.append(child);
    });
  }

  return elem;
}

function appendProduct(product) {
  const { thumbnail, title, brand, price, discountPercentage, rating, availabilityStatus } = product;
  const actualPrice = price * USD_TO_IDR;
  const afterDiscount = (actualPrice * (100 - discountPercentage)) / 100;
  const discount = Math.ceil(discountPercentage);

  const container = createElement("div", { class: "product-container" }, [
    createElement("div", { class: "product-image-container" }, [
      createElement("img", { class: "thumbnail", src: thumbnail }),
    ]),
    createElement("div", { class: "product-summary" }, [
      createElement("div", { class: "product-face" }, [
        createElement("p", { class: "title truncate semibold" }, [title]),
        createElement("p", { class: "brand truncate" }, [brand ?? "Common Items"]),
      ]),
      createElement("div", {}, [
        createElement("p", { class: "product-discount" }, [
          createElement("span", { class: "strikethrough" }, [formatCurrency(actualPrice)]),
          createElement("span", { class: "discount-label" }, [`-${discount}%`]),
        ]),
        createElement("p", { class: "product-price semibold" }, [formatCurrency(afterDiscount)]),
      ]),
      createElement("p", { class: "product-review truncate" }, [
        createElement("span", { "data-lucide": "star", fill: "#ffc400", stroke: "#ffc400", class: "star icon" }),
        rating,
        "-",
        availabilityStatus,
      ]),
    ]),
  ]);

  document.getElementById("product-list")?.append(container);
}

utils = {
  formatCurrency,
  createElement,
  appendProduct,
};
