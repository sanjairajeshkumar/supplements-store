const products = [
  { brand: "Wellcore", name: "Creatine", fullName: "Wellcore Creatine", category: "performance", categoryName: "Performance", pack: "tub", accent: "lime", mark: "PURE", note: "Creatine supplement" },
  { brand: "YogaBar", name: "Protein Oats", fullName: "YogaBar Protein Oats", category: "nutrition", categoryName: "Everyday nutrition", pack: "pouch", accent: "oat", mark: "OATS", note: "Protein oats" },
  { brand: "Wellcore", name: "Fish Oil", fullName: "Wellcore Fish Oil", category: "wellness", categoryName: "Wellness", pack: "bottle", accent: "blue", mark: "OMEGA", note: "Fish oil supplement" },
  { brand: "MuscleBlaze", name: "Whey Protein", fullName: "MuscleBlaze Whey Protein", category: "protein", categoryName: "Protein", pack: "pouch", accent: "red", mark: "WHEY", note: "Whey protein" },
  { brand: "MuscleBlaze", name: "Whey Protein Isolate", fullName: "MuscleBlaze Whey Protein Isolate", category: "protein", categoryName: "Protein", pack: "tub", accent: "red", mark: "ISO", note: "Whey protein isolate" },
  { brand: "GNC", name: "Multivitamin", fullName: "GNC Multivitamin", category: "wellness", categoryName: "Wellness", pack: "bottle", accent: "gold", mark: "VITS", note: "Multivitamin" },
  { brand: "Training essentials", name: "Pre-workout", fullName: "Pre-workout", category: "performance", categoryName: "Performance", pack: "tub", accent: "orange", mark: "PRE", note: "Pre-workout supplement" },
  { brand: "Training essentials", name: "BCAA", fullName: "BCAA", category: "performance", categoryName: "Performance", pack: "tub", accent: "purple", mark: "BCAA", note: "BCAA supplement" },
  { brand: "Training essentials", name: "Electrolytes", fullName: "Electrolytes", category: "wellness", categoryName: "Wellness", pack: "pouch", accent: "blue", mark: "HYDRATE", note: "Electrolyte supplement" },
  { brand: "Training essentials", name: "Mass Gainer", fullName: "Mass Gainer", category: "protein", categoryName: "Protein", pack: "pouch", accent: "orange", mark: "GAIN", note: "Mass gainer" }
];

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[character]));

function createProductCard(product, index, featured = false) {
  const productName = escapeHtml(product.fullName);
  const label = escapeHtml(product.mark);
  const packArt = `
    <div class="product-art art-${product.accent}" role="img" aria-label="Illustrative ${escapeHtml(product.note)} pack artwork">
      <span class="pack-shadow" aria-hidden="true"></span>
      <div class="pack pack-${product.pack}">
        <span class="pack-cap" aria-hidden="true"></span>
        <span class="pack-brand">${escapeHtml(product.brand)}</span>
        <span class="pack-mark">${label}</span>
        <span class="pack-divider" aria-hidden="true"></span>
        <span class="pack-name">${escapeHtml(product.name)}</span>
        <span class="pack-note">HORROR FITNESS / ILLUSTRATIVE</span>
      </div>
      <span class="art-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
    </div>`;
  const action = featured
    ? `<a class="card-link" href="products.html#product-catalogue">Explore range <span aria-hidden="true">↗</span></a>`
    : `<a class="card-link" href="contact.html?product=${encodeURIComponent(product.fullName)}">Ask about this <span aria-hidden="true">↗</span></a>`;

  return `
    <article class="product-card reveal">
      <a class="product-card-visual-link" href="${featured ? "products.html#product-catalogue" : `contact.html?product=${encodeURIComponent(product.fullName)}`}" aria-label="${featured ? "Explore" : "Enquire about"} ${productName}">
        ${packArt}
      </a>
      <div class="product-card-info">
        <div class="product-meta"><span>${escapeHtml(product.brand)}</span><span>${escapeHtml(product.categoryName)}</span></div>
        <h3>${productName}</h3>
        <p class="product-variant">Pack size &amp; variant: <strong>confirm on enquiry</strong></p>
        <div class="product-card-bottom"><span class="product-price">Price on request</span>${action}</div>
      </div>
    </article>`;
}

function setupProductCatalogue() {
  const productList = document.querySelector("[data-product-list]");
  const featuredList = document.querySelector("[data-featured-products]");
  const search = document.querySelector("#product-search");
  const category = document.querySelector("#category-filter");
  const count = document.querySelector("[data-results-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  if (featuredList) {
    featuredList.innerHTML = [products[0], products[1], products[3]]
      .map((product) => createProductCard(product, products.indexOf(product), true)).join("");
  }

  if (!productList) return;

  const render = () => {
    const query = search.value.trim().toLocaleLowerCase();
    const chosenCategory = category.value;
    const filtered = products.filter((product) => {
      const matchesQuery = `${product.brand} ${product.fullName} ${product.categoryName} ${product.note}`.toLocaleLowerCase().includes(query);
      return matchesQuery && (chosenCategory === "all" || product.category === chosenCategory);
    });
    productList.innerHTML = filtered.map((product) => createProductCard(product, products.indexOf(product))).join("");
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "product" : "products"} shown`;
    emptyState.hidden = filtered.length > 0;
    observeReveals(productList);
  };

  search.addEventListener("input", render);
  category.addEventListener("change", render);
  render();
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

function observeReveals(root = document) {
  const targets = root.querySelectorAll(".reveal:not([data-reveal-ready])");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((target) => {
      target.dataset.revealReady = "true";
      target.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  targets.forEach((target) => {
    target.dataset.revealReady = "true";
    observer.observe(target);
  });
}

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const feedback = document.querySelector("[data-form-feedback]");
  const product = new URLSearchParams(window.location.search).get("product");
  const subject = form.elements.namedItem("subject");
  if (product && subject instanceof HTMLInputElement) {
    subject.value = `Product enquiry: ${product.slice(0, 80)}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.classList.remove("is-error");

    const invalidField = Array.from(form.elements).find((field) =>
      field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
        ? !field.checkValidity()
        : false
    );

    if (invalidField) {
      invalidField.focus();
      feedback.textContent = invalidField.validationMessage || "Please check this field and try again.";
      feedback.classList.add("is-error");
      return;
    }

    const name = form.elements.namedItem("name").value.trim();
    feedback.textContent = `Thanks, ${name}. Your message has not been sent because this demo has no backend. Please contact the store using its contact details once available.`;
    form.reset();
  });
}

function setupYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

document.documentElement.classList.add("js");
setupNavigation();
setupProductCatalogue();
setupContactForm();
setupYear();
observeReveals();
