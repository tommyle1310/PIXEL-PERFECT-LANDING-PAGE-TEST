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
    const totalItems = ingredientsData.length;
    const mdCols = 4;

    // Mobile (1 col): last item = no border-b, no one gets border-r
    const isLastItemMobile = index === totalItems - 1;

    // MD+ (4 cols): last column = no border-r, last row = no border-b
    const isLastColMd = (index + 1) % mdCols === 0;
    const itemsInLastRowMd = totalItems % mdCols || mdCols;
    const isLastRowMd = index >= totalItems - itemsInLastRowMd;

    // Build border classes
    let borderClasses = ['border-black'];

    // Border-right: ONLY on md+ for non-last columns (mobile has 1 col, no border-r)
    if (!isLastColMd) {
      borderClasses.push('md:border-r');
    }

    // Border-bottom logic:
    // - Mobile: all except last item need border-b
    // - MD+: all except last row need border-b
    if (!isLastItemMobile && !isLastRowMd) {
      // Both breakpoints need border-b
      borderClasses.push('border-b');
    } else if (!isLastItemMobile && isLastRowMd) {
      // Mobile needs border-b, MD+ doesn't
      borderClasses.push('border-b md:border-b-0');
    }
    // else: neither needs border-b (last item is always in last row)

    const borderClass = borderClasses.join(' ');

    return `
      <div
        id="${item.id}"
        data-ingredient
        class="p-6 md:p-[24px] cursor-pointer ${borderClass}"
        aria-expanded="false"
      >
        <div class="w-full flex flex-col text-left gap-3">

          <div class="flex items-center justify-center gap-2 w-full">
          <div class="max-w-[16px] md:max-w-[11px] lg:max-w-[16px]">
              <img
              src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/check-mark_17013456_2.png?v=1760698419"
              class="w-full aspect-square object-fit"
            />
          </div>
            <span class="text-green-600 md:leading-[1.8] text-[16px] font-medium">
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
                style="font-family: 'Trirong', serif;"
                class="font-semibold text-sm md:text-md leading-[1.3]  text-black"
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