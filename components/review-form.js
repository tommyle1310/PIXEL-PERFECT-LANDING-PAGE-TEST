document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("btn-toggle-review-form");
  const form = document.getElementById("review-form");
  const emailInput = document.getElementById("email-input");
  const emailErrorBox = emailInput?.nextElementSibling;
  const stars = document.querySelectorAll(".review-stars i");

  document.getElementById("cancelReview").addEventListener("click", closeForm);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit Review clicked");
  });

  document.getElementById("cancelReview").addEventListener("click", closeForm);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit Review clicked");
  });

  if (!toggleBtn || !form) return;

  let isOpen = false;
  let selectedRating = 0;

  /* ---------- PREVENT FORM REFRESH ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  /* ---------- FORM TOGGLE (SLIDE ANIMATION) ---------- */
  function openForm() {
    isOpen = true;
    toggleBtn.textContent = "Cancel Review";

    form.classList.remove("hidden");
    form.style.overflow = "hidden";
    form.style.maxHeight = "0px";
    form.style.opacity = "0";
    form.style.transition = "max-height 0.4s ease, opacity 0.3s ease";

    requestAnimationFrame(() => {
      form.style.maxHeight = form.scrollHeight + "px";
      form.style.opacity = "1";
    });
  }

  function closeForm() {
    isOpen = false;
    toggleBtn.textContent = "Write a review";

    form.style.maxHeight = "0px";
    form.style.opacity = "0";

    setTimeout(() => {
      form.classList.add("hidden");
    }, 400);
  }

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    isOpen ? closeForm() : openForm();
  });

  /* ---------- CANCEL / SUBMIT BUTTONS ---------- */
  form.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    e.preventDefault();

    const text = btn.textContent.trim();

    if (text === "Cancel Review") {
      closeForm();
    }

    if (text === "Submit Review") {
      console.log("Submit Review clicked");
      // add submit logic here later
    }
  });

  /* ---------- EMAIL VALIDATION (ON INPUT) ---------- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (emailErrorBox) emailErrorBox.classList.add("hidden");

  emailInput?.addEventListener("input", () => {
    if (!emailInput.value) {
      emailErrorBox.classList.add("hidden");
      return;
    }

    if (!isValidEmail(emailInput.value)) {
      emailErrorBox.classList.remove("hidden");
    } else {
      emailErrorBox.classList.add("hidden");
    }
  });

  /* ---------- STAR RATING (HOVER + CLICK) ---------- */
  stars.forEach((star, index) => {
    star.style.cursor = "pointer";

    star.addEventListener("mouseenter", () => {
      highlightStars(index + 1);
    });

    star.addEventListener("mouseleave", () => {
      highlightStars(selectedRating);
    });

    star.addEventListener("click", () => {
      selectedRating = index + 1;
      highlightStars(selectedRating);
    });
  });

  function highlightStars(count) {
    stars.forEach((star, i) => {
      if (i < count) {
        star.classList.remove("fa-regular");
        star.classList.add("fa-solid");
      } else {
        star.classList.remove("fa-solid");
        star.classList.add("fa-regular");
      }
    });
  }
});
