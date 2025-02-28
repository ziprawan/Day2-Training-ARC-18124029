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
 * Convert date into id-ID format
 * @param {number} num
 */
function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID").format(new Date(date));
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
 * @returns {HTMLElement[]}
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

function appendProduct(products) {
  const created = createTreeElement(
    products.map((product) => {
      const { id, thumbnail, title, brand, price, discountPercentage, rating, availabilityStatus } = product;
      const actualPrice = price * USD_TO_IDR;
      const afterDiscount = (actualPrice * (100 - discountPercentage)) / 100;
      const discount = Math.ceil(discountPercentage);

      return {
        name: "div",
        attrs: {
          class: "product-container",
          product_id: id,
          onclick: "openProduct(event)",
        },
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
                  {
                    name: "span",
                    attrs: { "data-lucide": "star", fill: STAR_COLOR, stroke: STAR_COLOR, class: "star icon" },
                  },
                  rating,
                  " - ",
                  availabilityStatus,
                ],
              },
            ],
          },
        ],
      };
    })
  );

  const productListElement = document.getElementById("product-list");
  created.forEach((elem) => productListElement.append(elem));
}

function closeProductInfo() {
  document.getElementById("overlay")?.remove();
}

function showProductInfo(product) {
  if (document.getElementById("overlay")) {
    throw new Error(`Overlay already created!`);
  }

  const {
    images,
    title,
    rating,
    stock,
    price,
    discountPercentage,
    description,
    brand,
    dimensions,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    reviews,
    meta,
  } = product;

  const actualPrice = price * USD_TO_IDR;
  const afterDiscount = (actualPrice * (100 - discountPercentage)) / 100;
  const discount = Math.ceil(discountPercentage);

  const created = createTreeElement([
    {
      name: "div",
      attrs: { id: "overlay", class: "overlay", onclick: "utils.closeProductInfo()" },
      childs: [
        {
          name: "div",
          attrs: { class: "popup", onclick: "event.stopPropagation()" },
          childs: [
            {
              name: "div",
              attrs: { class: "popup-image-container" },
              childs: [{ name: "img", attrs: { src: images[0] } }],
            },
            {
              name: "div",
              attrs: { class: "popup-info-container" },
              childs: [
                { name: "h1", attrs: { class: "bold 3xl" }, childs: [title] },
                {
                  name: "div",
                  attrs: { class: "popup-rating sm" },
                  childs: [
                    { name: "span", attrs: { "data-lucide": "star", fill: STAR_COLOR, stroke: STAR_COLOR, class: "star" } },
                    `${rating} - Available stock(s): ${stock}`,
                  ],
                },
                {
                  name: "div",
                  attrs: { class: "popup-price" },
                  childs: [
                    { name: "div", attrs: { class: "semibold xl" }, childs: [formatCurrency(afterDiscount)] },
                    {
                      name: "div",
                      attrs: { class: "popup-actual-price sm" },
                      childs: [
                        { name: "span", attrs: { class: "popup-discount-percent" }, childs: [`-${discount}%`] },
                        { name: "span", attrs: { class: "strikethrough" }, childs: [formatCurrency(actualPrice)] },
                      ],
                    },
                  ],
                },
                { name: "p", childs: [description] },
                {
                  name: "div",
                  attrs: { class: "popup-brand semibold xl" },
                  childs: [{ name: "span", attrs: { "data-lucide": "store" } }, brand ?? "No brand."],
                },
                {
                  name: "div",
                  childs: [
                    { name: "div", attrs: { class: "semibold lg" }, childs: ["Additional Informations"] },
                    {
                      name: "div",
                      attrs: { class: "additional-info sm" },
                      childs: [
                        {
                          name: "div",
                          childs: [
                            { name: "span", attrs: { class: "semibold" }, childs: ["Dimensions: "] },
                            `${dimensions.width} x ${dimensions.height} x ${dimensions.depth} cm`,
                          ],
                        },
                        {
                          name: "div",
                          childs: [
                            { name: "span", attrs: { class: "semibold" }, childs: ["Warranty Information: "] },
                            warrantyInformation,
                          ],
                        },
                        {
                          name: "div",
                          childs: [
                            { name: "span", attrs: { class: "semibold" }, childs: ["Shipping Information: "] },
                            shippingInformation,
                          ],
                        },
                        {
                          name: "div",
                          childs: [
                            { name: "span", attrs: { class: "semibold" }, childs: ["Return Policy: "] },
                            returnPolicy,
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "div",
                  childs: [
                    { name: "div", attrs: { class: "semibold lg" }, childs: ["Reviews"] },
                    {
                      name: "div",
                      attrs: { class: "popup-review" },
                      childs: reviews.map((review) => ({
                        name: "div",
                        childs: [
                          {
                            name: "div",
                            attrs: { class: "review-header" },
                            childs: [
                              { name: "span", attrs: { "data-lucide": "circle-user", class: "user" } },
                              {
                                name: "div",
                                attrs: { class: "xs" },
                                childs: [
                                  { name: "div", childs: [`${review.reviewerName} - ${formatDate(review.date)}`] },
                                  {
                                    name: "div",
                                    attrs: { class: "review-star" },
                                    childs: [
                                      ...Array(review.rating)
                                        .fill(undefined)
                                        .map(() => ({
                                          name: "span",
                                          attrs: {
                                            "data-lucide": "star",
                                            class: "star",
                                            fill: STAR_COLOR,
                                            stroke: STAR_COLOR,
                                          },
                                        })),
                                      ...Array(5 - review.rating)
                                        .fill(undefined)
                                        .map(() => ({
                                          name: "span",
                                          attrs: {
                                            "data-lucide": "star",
                                            class: "star",
                                          },
                                        })),
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                          { name: "div", attrs: { class: "review-comment sm" }, childs: [review.comment] },
                          { name: "hr" },
                        ],
                      })),
                    },
                  ],
                },
                {
                  name: "div",
                  attrs: { class: "another-info" },
                  childs: [
                    { name: "span", childs: [`Created at: ${formatDate(meta.createdAt)}`] },
                    { name: "span", childs: [` | `] },
                    { name: "span", childs: [`Updated at: ${formatDate(meta.updatedAt)}`] },
                  ],
                },
              ],
            },
            {
              name: "div",
              childs: [
                {
                  name: "span",
                  attrs: { class: "close-button", "data-lucide": "circle-x", onclick: "utils.closeProductInfo()" },
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  document.body.append(created[0]);
}

utils = {
  formatCurrency,
  createElement,
  createTreeElement,
  appendProduct,
  showProductInfo,
  closeProductInfo,
};
