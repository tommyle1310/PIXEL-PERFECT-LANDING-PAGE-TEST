// INGREDIENTS ACCORDION SECTION
let ingredientsData = [];

async function loadIngredientsData() {
    try {
        const response = await fetch('./data/ingredients-accordion.json');
        const data = await response.json();
        ingredientsData = data.map((item, index) => ({
            id: `ing-${index + 1}`,
            title: item.title,
            image: item.avatar,
            name: item.subtitle,
            desc: item.expandedContent[0] || '',
            note: item.expandedContent[1] || ''
        }));
        renderIngredientAccordion();
    } catch (error) {
        console.error('Error loading ingredients data:', error);
    }
}

function renderIngredientAccordion() {
  const container = document.getElementById("ingredient-accordion");
  if (!container) return;

  container.innerHTML = ingredientsData.map((item, index) => {
    const isLastRow = index >= ingredientsData.length - 4;
    const isLastCol = (index + 1) % 4 === 0;

    const borderClass = `
      border-black
      ${!isLastCol ? "md:border-r" : ""}
      ${!isLastRow ? "md:border-b" : ""}
    `;

    return `
      <div
        id="${item.id}"
        data-ingredient
        class="p-6 cursor-pointer ${borderClass}"
        aria-expanded="false"
      >
        <div class="w-full flex flex-col text-left gap-3">

          <div class="flex items-center justify-center gap-2 w-full">
            <img
              src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/check-mark_17013456_2.png?v=1760698419"
              class="w-[9px] aspect-square object-contain"
            />
            <span class="text-green-600 text-[16px] font-medium">
              ${item.title}
            </span>
          </div>

          <div class="flex flex-row md:flex-col gap-3 items-center md:items-start">
            <img
              src="${item.image}"
              class="w-[20%] md:w-auto object-contain self-center"
              style="max-height: 80px;"
            />

            <div class="flex items-center gap-2 justify-between w-full flex-1">
              <p
                style="font-family: 'Trirong';"
                class="font-semibold text-[16px] text-black"
              >
                ${item.name}
              </p>

              <svg
                id="${item.id}-icon"
                class="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div
          id="${item.id}-content"
          class="accordion-closed overflow-hidden transition-all duration-300 ease-in-out"
          style="max-height: 0px;"
        >
          <div class="mt-3">
            <p class="text-sm leading-relaxed text-black">${item.desc}</p>
            ${item.note ? `<p class="text-sm mt-2">${item.note}</p>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll('[data-ingredient]').forEach(el => {
    el.addEventListener('click', () => {
      toggleIngredientAccordion(el.id);
    });
  });
}


function toggleIngredientAccordion(id) {
    const content = document.getElementById(`${id}-content`);
    const icon = document.getElementById(`${id}-icon`);
    const button = document.querySelector(`button[onclick="toggleIngredientAccordion('${id}')"]`);

    if (!content || !icon) return;

    const isOpen = !content.classList.contains("accordion-open");

    if (isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add("accordion-open");
        content.classList.remove("accordion-closed");
    } else {
        content.style.maxHeight = "0px";
        content.classList.remove("accordion-open");
        content.classList.add("accordion-closed");
    }

    // icon.classList.toggle("rotate-180", isOpen);
    button?.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadIngredientsData()
});