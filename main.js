import { initProductImagesSlider } from "./components/sliders/product-images-slider.js";
import { initStoriesSlider } from "./components/sliders/stories-slider.js";
import { initRadio } from "./components/radio.js";
import { initGuarantee } from "./components/guarantee.js";
import { initReviews } from "./components/reviews.js";
import { initProductAccordion } from "./components/accordions/accordion-product-reviews.js";
import { initFaqAccordion } from "./components/accordions/accordion-faq.js";
import { initIngredientAccordion } from "./components/accordions/accordion-ingredients.js";
import { initModal } from "./components/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  initProductImagesSlider();
  initStoriesSlider();
  initRadio();
  initGuarantee();
  initReviews();
  initProductAccordion();
  initFaqAccordion();
  initIngredientAccordion();
  initModal();
});
