// Constants
const USD_TO_IDR = 16370;
const STAR_COLOR = "#ffc400";

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

/**
 * @typedef {Object} ElementTree
 * @property {keyof HTMLElementTagNameMap} name - The tag name of the element.
 * @property {Record<string, string>} attrs - The attributes of the element.
 * @property {(ElementTree|string|number)[]} [childs] - The children elements or text nodes.
 */

/**
 * Processes an ElementTree structure.
 *
 * @param {(ElementTree|string|number)[]} elements - The root element of the tree.
 */
function createTreeElement(elements) {
  if (!Array.isArray(elements)) {
    throw new TypeError(`elements parameters is not an Array`);
  }

  return elements.map((e) =>
    typeof e === "object"
      ? createElement(e.name, typeof e.attrs === "object" ? e.attrs : {}, e.childs ? createTreeElement(e.childs) : undefined)
      : document.createTextNode(e)
  );
}

function appendProduct(product) {
  const { thumbnail, title, brand, price, discountPercentage, rating, availabilityStatus } = product;
  const actualPrice = price * USD_TO_IDR;
  const afterDiscount = (actualPrice * (100 - discountPercentage)) / 100;
  const discount = Math.ceil(discountPercentage);

  const created = createTreeElement([
    {
      name: "div",
      attrs: { class: "product-container" },
      childs: [
        {
          name: "div",
          attrs: { class: "product-image-container" },
          childs: [{ name: "img", attrs: { class: "thumbnail", src: thumbnail } }],
        },
        {
          name: "div",
          attrs: { class: "product-summary" },
          childs: [
            {
              name: "div",
              attrs: { class: "product-face" },
              childs: [
                { name: "p", attrs: { class: "title truncate semibold" }, childs: [title] },
                { name: "p", attrs: { class: "brand truncate" }, childs: [brand ?? "No brand."] },
              ],
            },
            {
              name: "div",
              childs: [
                {
                  name: "p",
                  attrs: { class: "product-discount" },
                  childs: [
                    { name: "span", attrs: { class: "discount-label semibold" }, childs: [`-${discount}%`] },
                    { name: "span", attrs: { class: "strikethrough" }, childs: [formatCurrency(actualPrice)] },
                  ],
                },
                { name: "p", attrs: { class: "product-price semibold" }, childs: [formatCurrency(afterDiscount)] },
              ],
            },
            {
              name: "p",
              attrs: { class: "product-review truncate" },
              childs: [
                { name: "span", attrs: { "data-lucide": "star", fill: STAR_COLOR, stroke: STAR_COLOR, class: "star icon" } },
                rating,
                " - ",
                availabilityStatus,
              ],
            },
          ],
        },
      ],
    },
  ]);

  document.getElementById("product-list")?.append(created[0]);
}

utils = {
  formatCurrency,
  createElement,
  createTreeElement,
  appendProduct,
};
