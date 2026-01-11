let faqData = [];

async function loadFaqData() {
    try {
        const response = await fetch('./data/faq.json');
        const data = await response.json();
        faqData = data.map((item, index) => ({
            id: `faq-${index + 1}`,
            question: item.question,
            answer: item.answer
        }));
        renderFaqs();
    } catch (error) {
        console.error('Error loading FAQ data:', error);
    }
}

function renderFaqs() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  container.innerHTML = faqData.map(item => `
    <div
      id="${item.id}"
      data-faq
      class="group border-b border-white cursor-pointer"
      aria-expanded="false"
    >
      <div class="w-full flex items-center justify-between text-left px-6 py-5">
        <span class="text-gray-800 font-medium font-nunito text-lg pr-4">
          ${item.question}
        </span>
        <svg
          id="${item.id}-icon"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 flex-shrink-0 text-gray-800 transform transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div
        id="${item.id}-content"
        class="accordion-closed overflow-hidden transition-all duration-300 ease-in-out"
        style="max-height: 0px;"
      >
        <div class="px-6 pb-5 font-nunito">
          ${item.answer}
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-faq]').forEach(el => {
    el.addEventListener('click', () => {
      toggleFaqAccordion(el.id);
    });
  });
}


function toggleFaqAccordion(id) {
    const content = document.getElementById(`${id}-content`);
    const icon = document.getElementById(`${id}-icon`);
    const button = document.querySelector(`button[onclick="toggleFaqAccordion('${id}')"]`);

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

    icon.classList.toggle("rotate-180", isOpen);
    button?.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadFaqData();

});