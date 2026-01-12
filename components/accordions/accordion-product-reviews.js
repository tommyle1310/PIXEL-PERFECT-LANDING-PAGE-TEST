document.addEventListener("DOMContentLoaded", () => {
  const data = [
    {
      id: "acc-1",
      title: "Ingredients proven by science",
      open: true,
      content: `
        <strong class="text-[16px] mb-3">Sculptique Ingredients:</strong>
        <ul style="padding-left: 30px;" class="text-[16px] mt-4 list-disc list-outside">
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Echinacea purpurea Extract</strong> – Known for its anti-inflammatory properties, it may support skin health.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Dandelion Extract</strong> – Traditionally used as a diuretic, it may help reduce water retention.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Burdock Powder</strong> – Contains antioxidants that may promote skin clarity.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Cleavers Extract</strong> – Believed to support lymphatic drainage and detoxification.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Rutin</strong> – A flavonoid that may strengthen blood vessels and improve circulation.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Bromelain Powder</strong> – An enzyme from pineapple that may reduce inflammation and support tissue repair.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Lemon Powder</strong> – Rich in vitamin C, it may aid in collagen production and skin rejuvenation.</li>
          <li class="font-mont leading-[1.8em] text-[15px]"><strong class="tracking-[0.06rem]">Kelp Extract</strong> – A source of iodine and minerals that may support skin metabolism.</li>
        </ul>
        <p class="text-md leading-[1.3em]">These natural ingredients work together to reduce puffiness, bloating, fluid retention.</p>
      `,
    },
    {
      id: "acc-2",
      title: "How does it actually work?",
      open: false,
      content: `
        <p class="text-md leading-[1.3em]">
          Sculptique works by improving blood flow and supporting lymphatic drainage
          to reduce fluid buildup that causes puffiness, inflammation, and water retention.
          It also reduces inflammation and boosts collagen production to help skin become
          firmer and smoother.
        </p>
      `,
    },
    {
      id: "acc-3",
      title: "Shipping and returns",
      open: false,
      content: `
        <p class="text-md leading-[1.3em]">
         All of Sculptique orders get FREE shipping straight from our USA warehouse. Orders are usually shipped out within 1-2 working days, and you should receive the order within 3-7 working days for domestic USA orders, and within 10 working days for International orders.
        </p>
        <p class="text-md leading-[1.3em]">
          We also offer a 60-day money back guarantee - if you are unsatisfied with our product, you can take advantage of our guarantee and ship back the product to us to get your return within 60 days of receiving your order.
        </p>
      `,
    },
  ];

  const root = document.getElementById("accordion-product-preview");

  root.innerHTML = `
    <div class="flex flex-col gap-4">
      ${data
        .map(
          (item) => `
        <div
          id="${item.id}"
          data-accordion
          aria-expanded="${item.open}"
          class="border ${
            item.open ? "border-[#039869]" : "border-[#d2d2d2]"
          } p-[16px] cursor-pointer transition-colors duration-300"
          style="border-radius:32px"
        >
          <div class="w-full flex items-center gap-[12px] justify-between text-left">
            <span class="text-[16px] flex-1 font-medium">${item.title}</span>
            <span
              id="${item.id}-icon"
              class="flex w-[24px] aspect-square items-center justify-center rounded-full bg-[#f4f0e8] transition-transform duration-300 ${
                item.open ? "rotate-45" : ""
              }"
            >
              <img src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/Button_To_Expand_1_8a6027c0-281a-4c6b-8881-60673c7255ec.png?v=1758716844" />
            </span>
          </div>

          <div
            id="${item.id}-content"
            class="mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
              item.open ? "" : "hidden"
            }"
            style="max-height:${item.open ? "none" : "0px"}"
          >
            ${item.content}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  document.querySelectorAll("[data-accordion]").forEach((acc) => {
    acc.addEventListener("click", () => toggleAccordion(acc.id));
  });
});

function toggleAccordion(id) {
  const acc = document.getElementById(id);
  const content = document.getElementById(`${id}-content`);
  const icon = document.getElementById(`${id}-icon`);

  const isOpen = acc.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    acc.setAttribute("aria-expanded", "false");
    acc.classList.remove("border-[#039869]");
    acc.classList.add("border-[#d2d2d2]");
    icon.classList.remove("rotate-45");
    content.style.maxHeight = "0px";
    setTimeout(() => content.classList.add("hidden"), 300);
  } else {
    acc.setAttribute("aria-expanded", "true");
    acc.classList.remove("border-[#d2d2d2]");
    acc.classList.add("border-[#039869]");
    icon.classList.add("rotate-45");
    content.classList.remove("hidden");
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
