/* ================= STATE ================= */
let reviewsData = [];
let filteredReviews = [];
let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 5;
let activeRatingFilter = null;
let activeSortFilter = null;

// Review image modal state
let currentReviewImages = [];
let currentImageIndex = 0;

/* ================= LOAD ================= */
async function loadReviewsData() {
  const res = await fetch("./data/reviews.json");
  reviewsData = await res.json();
  filteredReviews = [...reviewsData];

  setupRatingRows(); // IMPORTANT: setup + disable rows based on data
  renderReviews();
  updateSeeAllVisibility();
}

/* ================= HELPERS ================= */
function updateSeeAllVisibility() {
  const seeAllEl = document.getElementById("see-all-reviews");
  if (!seeAllEl) return;

  const isFiltered =
    activeRatingFilter !== null ||
    activeSortFilter !== null ||
    filteredReviews.length !== reviewsData.length;

  seeAllEl.classList.toggle("hidden", !isFiltered);
}

function setupRatingRows() {
  document.querySelectorAll(".rating-row").forEach((row) => {
    const rating = Number(row.dataset.rating);
    const count = reviewsData.filter((r) => r.rating === rating).length;

    // disable row if no result
    if (count === 0) {
      row.classList.add( "pointer-events-none");
      row.setAttribute("aria-disabled", "true");
      return;
    }

    // enable row
    row.classList.remove("opacity-30", "pointer-events-none");
    row.removeAttribute("aria-disabled");

    // remove old listener (safe rebind)
    row.onclick = null;
    row.addEventListener("click", () => {
      applyRatingFilter(rating);
    });
  });
}

/* ================= FILTERS ================= */
function applyRatingFilter(rating) {
  const result = reviewsData.filter((r) => r.rating === rating);
  if (result.length === 0) return; // safety

  activeRatingFilter = rating;
  currentReviewPage = 1;
  filteredReviews = result;

  renderReviews();
  updateSeeAllVisibility();

  document
    .getElementById("reviews-container")
    ?.scrollIntoView({ behavior: "smooth" });
}

function applySort(value) {
  currentReviewPage = 1;

  // reset-only options
  if (
    value === "with-pictures" ||
    value === "pictures-first" ||
    value === "videos-first" ||
    value === "most-helpful"
  ) {
    activeRatingFilter = null;
    activeSortFilter = null;
    filteredReviews = [...reviewsData];
    renderReviews();
    updateSeeAllVisibility();
    return;
  }

  // track active sort
  activeSortFilter = value;

  // base dataset
  if (activeRatingFilter !== null) {
    filteredReviews = reviewsData.filter(
      (r) => r.rating === activeRatingFilter
    );
  } else {
    filteredReviews = [...reviewsData];
  }

  if (value === "highest-rating") {
    filteredReviews.sort((a, b) => b.rating - a.rating);
  }
  if (value === "lowest-rating") {
    filteredReviews.sort((a, b) => a.rating - b.rating);
  }
  if (value === "most-recent") {
    filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  renderReviews();
  updateSeeAllVisibility();
}

/* ================= RENDER ================= */
function renderReviews() {
  const container = document.getElementById("reviews-container");
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const start = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
  const pageData = filteredReviews.slice(start, start + REVIEWS_PER_PAGE);

  container.innerHTML =
    pageData
      .map((r) => {
        const solidStars = '<i class="fa-solid fa-scale fa-star"></i>'.repeat(
          r.rating
        );
        const regularStars =
          '<i class="fa-regular fa-scale fa-star"></i>'.repeat(5 - r.rating);

        return `
      <div class="border-b font-mont border-[#fef3f3] pt-8 pb-[3.8rem] flex flex-col gap-2">
       <div class="flex justify-between">
         <div class="flex">
           ${solidStars}${regularStars}
         </div>
         <p style="
          font-size: calc(16px * 0.8)
          " class="text-[#7b7b7b] text-sm">${r.date}</p>
       </div>

       <div class="flex gap-2">
         <div style="
          width: 36px; height: 36px;
          " class=" bg-[#efefef] flex items-center relative justify-center">
           <i class="fa-regular fa-user text-[24px] text-[#fa8a8a]"></i>
           <div class="absolute bottom-0 right-0
         w-[14px] h-[14px]
         bg-[#fa8a8a]
         flex items-center justify-center">
             <i class="fa-solid fa-check text-[8px] text-white"></i>
           </div>
         </div>
         <div class="flex gap-2">
           <p class="text-[#fa8a8a] text-[16px]">${r.author}</p>
            ${
              r.isVerified
                ? '<div><span class="bg-[#FA8A8A] text-white text-xs px-2">Verified</span></div>'
                : ""
            }
          </div>
        </div>

        <p class="font-nunito text-[15px] md:text-md">${r.content}</p>
        
        ${r.images && r.images.length > 0 ? `
          <div class="flex flex-wrap gap-4 mt-2">
            ${r.images.map((img, idx) => `
              <div
                style="width: 94px; height: 94px;"
              class="cursor-pointer overflow-hidden" onclick="openReviewImageModal(${JSON.stringify(r.images).replace(/"/g, '&quot;')}, ${idx})">
                <img src="${img}" alt="Review image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
      })
      .join("") + renderPagination(totalPages);
}

/* ================= PAGINATION ================= */
function renderPagination(totalPages) {
  if (totalPages <= 1) return "";

  const current = currentReviewPage;

  const firstButton = `<button onclick="changeReviewPage(1)" class="text-[#fa8a8a] px-1 hover:opacity-70">«</button>`;
  const prevButton = `<button onclick="changeReviewPage(${Math.max(
    1,
    current - 1
  )})" class="text-[#fa8a8a] px-1 hover:opacity-70">‹</button>`;

  let pagesHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    pagesHTML +=
      i === current
        ? `<span
        style="
        font-size: 150%;
        "
        class="text-[#7b7b7b] font-mont text-md font-bold px-1">${i}</span>`
        : `<button onclick="changeReviewPage(${i})" class="text-[#fa8a8a] font-mont px-1 text-[15px] hover:opacity-70">${i}</button>`;
  }

  const nextButton = `<button onclick="changeReviewPage(${Math.min(
    totalPages,
    current + 1
  )})" class="text-[#fa8a8a] px-1 hover:opacity-70">›</button>`;
  const lastButton = `<button onclick="changeReviewPage(${totalPages})" class="text-[#fa8a8a] px-1 hover:opacity-70">»</button>`;

  return `
    <div class="flex justify-center gap-2 mt-6 py-4">
      ${firstButton}
      ${prevButton}
      ${pagesHTML}
      ${nextButton}
      ${lastButton}
    </div>
  `;
}

function changeReviewPage(p) {
  currentReviewPage = p;
  renderReviews();
  document
    .getElementById("reviews-container")
    ?.scrollIntoView({ behavior: "smooth" });
}

/* ================= REVIEW IMAGE MODAL ================= */
function updateImagePagination() {
  const paginationEl = document.getElementById("review-image-pagination");
  if (paginationEl) {
    paginationEl.textContent = `${currentImageIndex + 1} / ${currentReviewImages.length}`;
  }
}

function openReviewImageModal(images, index) {
  currentReviewImages = images;
  currentImageIndex = index;
  
  const modal = document.getElementById("review-image-modal-overlay");
  const imgEl = document.getElementById("review-modal-image");
  
  if (modal && imgEl) {
    imgEl.src = currentReviewImages[currentImageIndex];
    updateImagePagination();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
}

function closeReviewImageModal() {
  const modal = document.getElementById("review-image-modal-overlay");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }
}

function prevReviewImage() {
  if (currentReviewImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + currentReviewImages.length) % currentReviewImages.length;
  document.getElementById("review-modal-image").src = currentReviewImages[currentImageIndex];
  updateImagePagination();
}

function nextReviewImage() {
  if (currentReviewImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentReviewImages.length;
  document.getElementById("review-modal-image").src = currentReviewImages[currentImageIndex];
  updateImagePagination();
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", async () => {
  await loadReviewsData();

  // SORT — now ALWAYS updates see-all correctly
  document.getElementById("review-sort")?.addEventListener("change", (e) => {
    applySort(e.target.value);
  });

  // SEE ALL → reset
  document.getElementById("see-all-reviews")?.addEventListener("click", () => {
    activeRatingFilter = null;
    activeSortFilter = null;
    filteredReviews = [...reviewsData];
    currentReviewPage = 1;
    renderReviews();
    updateSeeAllVisibility();

    // Reset sort dropdown to default
    const sortDropdown = document.getElementById("review-sort");
    if (sortDropdown) sortDropdown.value = "most-recent";

    document
      .getElementById("reviews-container")
      ?.scrollIntoView({ behavior: "smooth" });
  });
});
