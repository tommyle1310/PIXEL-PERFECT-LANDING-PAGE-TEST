export function toggleAccordion(id) {
    const allIds = ["acc-1", "acc-2", "acc-3"];

    allIds.forEach(accId => {
      const content = document.getElementById(`${accId}-content`);
      const icon = document.getElementById(`${accId}-icon`);
      const button = document.querySelector(
        `button[onclick="toggleAccordion('${accId}')"]`
      );

      if (accId === id) {
        const isOpen = !content.classList.contains("hidden");

        content.classList.toggle("hidden", isOpen);
        icon.classList.toggle("rotate-45", !isOpen);
        button?.setAttribute("aria-expanded", String(!isOpen));
      } else {
        content.classList.add("hidden");
        icon.classList.remove("rotate-45");
        button?.setAttribute("aria-expanded", "false");
      }
    });
  }
