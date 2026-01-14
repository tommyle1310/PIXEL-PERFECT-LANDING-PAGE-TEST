// cta-buttons.js
document.addEventListener("DOMContentLoaded", () => {
  const presets = {
    "1": "bg-[#000] leading-[1.3] font-bold mx-auto md:px-[80px] md:py-[18px] p-4 rounded-[4px] text-white hover:bg-[#333] duration-300",
    "2": "bg-[#000] text-lg leading-[1.3] mx-auto md:px-[80px] md:py-[18px] p-4 rounded-[4px] text-white hover:bg-[#333] duration-300",
    "3": "bg-[#000] text-lg leading-[1.3] mx-auto md:px-[80px] md:py-[18px] p-4 rounded-[4px] text-white hover:bg-[#333] duration-300",
    "4": "bg-[#000] leading-[1.3] mx-auto p-4 md:px-[80px] md:py-[18px] rounded-[4px] text-white hover:bg-[#333] duration-300 text-md md:text-lg",
    "5": "bg-[#000] w-full mt-8 mx-auto py-[18px] leading-[1.3] md:px-[80px] text-md md:text-lg md:py-[18px] px-20 rounded-[4px] text-white hover:bg-[#333] duration-300",
    "6": "bg-[#000] font-mont w-full mx-auto p-[18px] leading-[1.3] md:p-[20px] rounded-lg text-white hover:bg-[#333] duration-300"
  };

  // Select buttons that want to be replaced/initialized
  const els = document.querySelectorAll("[data-cta]");

  els.forEach(el => {
    // Read variant (1..6). If missing, try data-variant attribute; default to "1".
    const variant = (el.getAttribute("data-variant") || "1").trim();

    // If user passed full custom class string (override), use it; otherwise use preset.
    // NOTE: per your request presets contain the full CSS; override is optional.
    const usePreset = presets[variant] || presets["1"];

    // Text content: data-text if present, else existing innerText (trimmed), else fallback.
    const text = el.getAttribute("data-text") ?? (el.textContent && el.textContent.trim()) ?? "Click";

    // Optional extra classes to append (use sparingly; defaults to empty)
    const extra = el.getAttribute("data-extra") ?? "";

    // Preserve type attribute if present, otherwise default to "button"
    const typeAttr = el.getAttribute("type") ? `type="${el.getAttribute("type")}"` : 'type="button"';

    // Preserve id/name/aria attributes if already present on the element
    const idAttr = el.id ? `id="${el.id}"` : "";
    const nameAttr = el.getAttribute("name") ? `name="${el.getAttribute("name")}"` : "";
    const ariaAttrs = Array.from(el.attributes)
      .filter(a => a.name.startsWith("aria-"))
      .map(a => `${a.name}="${a.value}"`)
      .join(" ");

    // Apply classes and text directly to the existing element (do not replace node to keep event listeners if any)
    el.className = usePreset + (extra ? " " + extra : "");
    el.textContent = text || "Try Lymphatic Drainage Risk-Free";

    // Ensure type, id, name, aria preserved/set — set via properties when possible
    if (!el.getAttribute("type")) el.setAttribute("type", "button");
    if (idAttr && !el.id) el.id = el.getAttribute("id");
    if (nameAttr && !el.getAttribute("name")) el.setAttribute("name", el.getAttribute("name"));
    if (ariaAttrs) {
      // re-apply aria attributes already present (they were read from attributes so they remain)
    }

    // Keep disabled attribute if user set it in HTML
  });
});
