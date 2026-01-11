document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      id: "acc-1",
      title: "Ingredients proven by science",
      open: true,
      content: `
        <strong class="text-[16px] mb-3">Sculptique Ingredients:</strong>
        <ul style="padding-left: 40px;" class="text-[16px] list-disc list-inside">
          <li class="text-[16px]"><strong>Echinacea purpurea Extract</strong> – Known for its anti-inflammatory properties, it may support skin health.</li>
          <li class="text-[16px]"><strong>Dandelion Extract</strong> – Traditionally used as a diuretic, it may help reduce water retention.</li>
          <li class="text-[16px]"><strong>Burdock Powder</strong> – Contains antioxidants that may promote skin clarity.</li>
          <li class="text-[16px]"><strong>Cleavers Extract</strong> – Believed to support lymphatic drainage and detoxification.</li>
          <li class="text-[16px]"><strong>Rutin</strong> – A flavonoid that may strengthen blood vessels and improve circulation.</li>
          <li class="text-[16px]"><strong>Bromelain Powder</strong> – An enzyme from pineapple that may reduce inflammation and support tissue repair.</li>
          <li class="text-[16px]"><strong>Lemon Powder</strong> – Rich in vitamin C, it may aid in collagen production and skin rejuvenation.</li>
          <li class="text-[16px]"><strong>Kelp Extract</strong> – A source of iodine and minerals that may support skin metabolism.</li>
        </ul>
        <p class="text-[16px]">These natural ingredients work together to reduce puffiness, bloating, fluid retention.</p>
      `
    },
    {
      id: "acc-2",
      title: "How does it actually work?",
      open: false,
      content: `
        <p class="text-[16px]">
          Sculptique works by improving blood flow and supporting lymphatic drainage
          to reduce fluid buildup that causes puffiness, inflammation, and water retention.
          It also reduces inflammation and boosts collagen production to help skin become
          firmer and smoother.
        </p>
      `
    },
    {
      id: "acc-3",
      title: "Shipping and returns",
      open: false,
      content: `
        <p class="text-[16px]">
          All Sculptique orders get FREE shipping straight from our USA warehouse.
          Orders ship within 1–2 working days and arrive in 3–7 days (USA),
          or within 10 days internationally.
        </p>
        <p class="text-[16px]">
          We offer a 60-day money-back guarantee if you’re not satisfied.
        </p>
      `
    }
  ];

  const root = document.getElementById("accordion-product-preview");

  root.innerHTML = `
    <div class="flex flex-col gap-4">
      ${data.map(item => `
        <div
          id="${item.id}"
          class="border border-gray-300 p-4 cursor-pointer"
          style="border-radius:32px"
          data-accordion
        >
          <div class="w-full flex items-center justify-between text-left">
            <span class="text-[16px] font-medium">${item.title}</span>
            <span
              id="${item.id}-icon"
              class="flex w-6 aspect-square items-center justify-center rounded-full bg-[#f4f0e8] transition-transform duration-300 ${item.open ? "rotate-45" : ""}"
            >
              <img src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/Button_To_Expand_1_8a6027c0-281a-4c6b-8881-60673c7255ec.png?v=1758716844" />
            </span>
          </div>

          <div
            id="${item.id}-content"
            class="mt-4 overflow-hidden transition-all duration-300 ease-in-out ${item.open ? "" : "hidden"}"
            style="max-height:${item.open ? "none" : "0px"}"
          >
            ${item.content}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll("[data-accordion]").forEach(acc => {
    acc.addEventListener("click", () => {
      toggleAccordion(acc.id);
    });
  });
});

function toggleAccordion(id) {
  const content = document.getElementById(`${id}-content`);
  const icon = document.getElementById(`${id}-icon`);
  const acc = document.getElementById(id);

  const isOpen = !content.classList.contains("hidden");

  if (isOpen) {
    content.style.maxHeight = "0px";
    setTimeout(() => content.classList.add("hidden"), 300);
    icon.classList.remove("rotate-45");
    acc.setAttribute("aria-expanded", "false");
  } else {
    content.classList.remove("hidden");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.add("rotate-45");
    acc.setAttribute("aria-expanded", "true");
  }

}
