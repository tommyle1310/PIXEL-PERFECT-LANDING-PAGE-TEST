
// REVIEWS SECTION WITH PAGINATION
let reviewsData = [];
let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 5;

async function loadReviewsData() {
    try {
        const response = await fetch('./data/reviews.json');
        reviewsData = await response.json();
        renderReviews();
    } catch (error) {
        console.error('Error loading reviews data:', error);
    }
}

function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const totalPages = Math.ceil(reviewsData.length / REVIEWS_PER_PAGE);
    const startIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    const currentReviews = reviewsData.slice(startIndex, endIndex);

    const reviewsHTML = currentReviews.map(review => {
        const starsHTML = Array(review.rating).fill('<i class="fa-solid fa-star"></i>').join('');

        return `
      <div class="border-b-[1px] border-[#fef3f3] flex flex-col py-4 gap-4">

        <!-- ROW: STARS + DATE -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[1px]">
            ${starsHTML}
          </div>
          <p class="text-[#7b7b7b] text-sm">${review.date}</p>
        </div>

        <!-- ROW: AVATAR + NAME -->
        <div class="flex gap-2 items-start">
          <div class="w-12 h-12 bg-[#efefef] relative">
            <div class="absolute w-4 h-4 bottom-0 right-0 bg-[#fa8a8a] flex items-center justify-center">
              <i class="fa-solid fa-check text-white text-[8px]"></i>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <p class="text-[#fa8a8a]">${review.author}</p>
            ${review.isVerified ? '<p class="py-[2px] px-[6px] text-xs text-white bg-[#FA8A8A]">Verified</p>' : ''}
          </div>
        </div>

        <!-- CONTENT -->
        <p>${review.content}</p>

        <!-- SOURCE -->
        <div class="hidden md:flex">
          <p class="px-2 py-1">${review.source}</p>
        </div>

      </div>
    `;
    }).join('');

    const paginationHTML = renderPagination(totalPages);

    container.innerHTML = reviewsHTML + paginationHTML;
}

function renderPagination(totalPages) {
    if (totalPages <= 1) return '';

    const current = currentReviewPage;

    const firstButton = `<button onclick="changeReviewPage(1)" class="text-[#fa8a8a] text-lg px-1 hover:opacity-70 transition-opacity"><svg
class="w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa8a8a"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m17 18-6-6 6-6" />
    <path d="M7 6v12" /></svg></button>`;
    const prevButton = `<button onclick="changeReviewPage(${Math.max(1, current - 1)})"
  class="text-[#fa8a8a] text-lg px-1 hover:opacity-70 transition-opacity"><svg class="w-4" xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa8a8a" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round">
    <path d="m15 18-6-6 6-6" /></svg></button>`;
    let pagesHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (i === current) {
            pagesHTML += `<span class="text-[#7b7b7b] text-2xl font-bold px-1">${i}</span>`;
        } else {
            pagesHTML += `<button onclick="changeReviewPage(${i})" class=" text-[#fa8a8a] text-lg px-1 hover:opacity-70 transition-opacity">${i}</button>`;
        }
    }

    const nextButton = `<button onclick="changeReviewPage(${Math.min(totalPages, current + 1)})"
   class="text-[#fa8a8a] text-lg px-1 hover:opacity-70 transition-opacity"><svg class="w-4" xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa8a8a" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
     <path d="m9 18 6-6-6-6" /></svg></button>`;
    const lastButton = `<button onclick="changeReviewPage(${totalPages})"
   class="text-[#fa8a8a] text-lg px-1 hover:opacity-70 transition-opacity"><svg class="w-4" xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fa8a8a" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
     <path d="m7 18 6-6-6-6" />
     <path d="M17 6v12" /></svg></button>`;
    return `
    <div class="flex flex-wrap justify-center items-center gap-2 mt-6 py-4 pb-16 md:pb-[4.5rem]">
    <div class="flex items-center gap-2">   
    ${firstButton}
      ${prevButton}
      </div>
      ${pagesHTML}
    <div class="flex items-center gap-2">
      ${nextButton}
      ${lastButton}
    </div>
    </div>
  `;
}

function changeReviewPage(page) {
    currentReviewPage = page;
    renderReviews();
    document.getElementById('reviews-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// INITIALIZE ALL ON DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", async () => {
    await loadReviewsData()

});