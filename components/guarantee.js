document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll("[data-guarantee]");

  targets.forEach(el => {
    const isCenter = el.hasAttribute("data-center");

    const template = `
      <p class="flex items-center font-semibold gap-4 ${isCenter ? "justify-center" : ""}">
        <img
          src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/60-days_11622780_1_1.png?v=1752388395"
          alt="60 days logo"
          class="w-4 md:w-6"
        />
        <span>60 day money-back guarantee</span>
      </p>
    `;

    el.innerHTML = template;
  });
});
