const LIMIT = 24;
const url = new URL("https://dummyjson.com/products");

const productListElement = document.getElementById("product-list");
const loadingElement = document.getElementById("loading");
const loadMoreButton = document.getElementById("load-more");
const endOfProductElement = document.getElementById("end");

if (typeof utils === "undefined") {
  alert("utils.js is not loaded!");
  throw new Error("utils.js is not loaded!");
}

if (!productListElement || !loadingElement || !loadMoreButton || !endOfProductElement || !lucide) {
  console.log(productListElement);
  throw new Error(`Unable to initialize script!`);
}

lucide.createIcons();

function fetchProducts() {
  const skipParams = parseInt(url.searchParams.get("skip"), 10);

  url.searchParams.set("limit", LIMIT);
  url.searchParams.set("skip", isNaN(skipParams) ? 0 : skipParams + LIMIT);

  loadingElement.style.display = "block";
  loadMoreButton.style.display = "none";

  fetch(url)
    .then((resp) => {
      if (resp.status !== 200) {
        console.warn(`Expected response status: 200. Got: ${resp.status}`);
        return Promise.resolve(null);
      } else {
        return resp.json();
      }
    })
    .then((json) => {
      if (!json) {
        console.error("Unexpected response status!");
      } else {
        console.log(json);

        loadingElement.style.display = "none";

        if (json.limit !== 0) {
          loadMoreButton.style.display = "block";
        } else {
          console.log("Or here?");
          endOfProductElement.style.display = "block";
        }

        utils.appendProduct(json.products);

        lucide.createIcons();
      }
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        console.error(`Response body is not a JSON format`);
      } else {
        console.error(`Unknown error. Maybe this was your internet connection`);
        console.error(err);
      }
    });
}

function openProduct(event) {
  /**
   * @type {HTMLDivElement}
   */
  const target = event.target.closest(".product-container");

  const rect = event.target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const id = target.getAttribute("product_id");

  if (!id) {
    throw new Error(`Unable to get product id`);
  }

  const waitElm = document.getElementById("wait");
  // const popupElm = document.getElementById("wait-popup");

  // popupElm.classList.add("show");
  waitElm.classList.add("show");

  fetch(`https://dummyjson.com/products/${id}`)
    .then((resp) => {
      if (resp.status !== 200) {
        return null;
      } else {
        return resp.json();
      }
    })
    .then((json) => {
      if (!json) {
        console.error("Unexpected response status!");
      } else {
        utils.showProductInfo(json);
      }

      // document.getElementById("wait").style.display = "none";
      waitElm.classList.remove("show");
      // popupElm.classList.remove("show");
      lucide.createIcons();
    })
    .catch((err) => {
      waitElm.classList.remove("show");
      // popupElm.classList.remove("show");
      // document.getElementById("wait").style.display = "none";
      lucide.createIcons();
      console.error(err);
    });
}

fetchProducts();
