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

        json.products.forEach((product) => utils.appendProduct(product));
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

fetchProducts();
