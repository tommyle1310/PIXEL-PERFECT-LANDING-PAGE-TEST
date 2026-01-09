// ACCORDION TOGGLE (for generic accordions)
function toggleAccordion(id) {
  const content = document.getElementById(`${id}-content`);
  const icon = document.getElementById(`${id}-icon`);
  const button = document.querySelector(`button[onclick="toggleAccordion('${id}')"]`);

  if (!content || !icon) return;

  // Check if currently open (visible and has height)
  const isCurrentlyOpen = !content.classList.contains('hidden') && content.style.maxHeight !== '0px';

  if (isCurrentlyOpen) {
    // Close it
    content.style.maxHeight = '0px';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease-in-out';
    setTimeout(() => {
      content.classList.add('hidden');
    }, 300);
    icon.classList.remove('rotate-45');
    button?.setAttribute('aria-expanded', 'false');
  } else {
    // Open it
    content.classList.remove('hidden');
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease-in-out';
    content.style.maxHeight = content.scrollHeight + 'px';
    icon.classList.add('rotate-45');
    button?.setAttribute('aria-expanded', 'true');
  }
}

// Initialize generic accordions on page load
function initGenericAccordions() {
  // Set initial state for acc-1 (open by default based on HTML)
  const acc1Content = document.getElementById('acc-1-content');
  if (acc1Content && !acc1Content.classList.contains('hidden')) {
    acc1Content.style.maxHeight = acc1Content.scrollHeight + 'px';
    acc1Content.style.overflow = 'hidden';
    acc1Content.style.transition = 'max-height 0.3s ease-in-out';
  }
  
  // Set initial state for closed accordions (acc-2, acc-3)
  ['acc-2', 'acc-3'].forEach(id => {
    const content = document.getElementById(`${id}-content`);
    if (content && content.classList.contains('hidden')) {
      content.style.maxHeight = '0px';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease-in-out';
    }
  });
}

// DONUT CHART INITIALIZATION
function initDonutCharts() {
  document.querySelectorAll('.donut').forEach(donut => {
    const percent = donut.dataset.percent;
    const circle = donut.querySelector('.progress');
    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset =
      circumference - (percent / 100) * circumference;
  });
}

// FAQ SECTION
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
    <div id="${item.id}" class="group">
      <button
        class="w-full flex items-center justify-between text-left px-6 py-5 focus:outline-none"
        onclick="toggleFaqAccordion('${item.id}')"
        aria-expanded="false">
        <span class="text-gray-800 font-medium text-lg pr-4">${item.question}</span>
        <svg id="${item.id}-icon"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 flex-shrink-0 text-gray-800 transform transition-transform duration-300"
          fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div id="${item.id}-content" class="accordion-closed overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0px;">
        <div class="px-6 pb-5 text-gray-600 leading-relaxed">
          ${item.answer}
        </div>
      </div>
    </div>
  `).join('');
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
      ${index !== ingredientsData.length - 1 ? "border-b" : ""}
      ${!isLastCol ? "md:border-r" : ""}
      ${!isLastRow ? "md:border-b" : ""}
    `;

    return `
      <div class="p-4 ${borderClass}">
        <button
          onclick="toggleIngredientAccordion('${item.id}')"
          aria-expanded="false"
          class="w-full flex items-center justify-between text-left gap-3"
        >
          <div class="flex items-center gap-3">
            <span class="text-green-600 text-xl">✔</span>
            <span class="text-green-600 text-lg font-medium">
              ${item.title}
            </span>
          </div>
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
        </button>
        <div
          id="${item.id}-content"
          class="accordion-closed overflow-hidden transition-all duration-300 ease-in-out"
          style="max-height: 0px;"
        >
          <div class="mt-4 space-y-3">
            <div class="flex items-start gap-3">
              <img
                src="${item.image}"
                class="w-10 h-10 object-contain"
              />
              <div>
                <p class="font-bold text-black">${item.name}</p>
                <p class="text-sm leading-relaxed text-black">${item.desc}</p>
                ${item.note ? `<p class="text-sm mt-2">${item.note}</p>` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
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

  icon.classList.toggle("rotate-180", isOpen);
  button?.setAttribute("aria-expanded", String(isOpen));
}

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
    const starsHTML = Array(review.rating).fill('<span class="jdgm-star"></span>').join('');
    
    return `
      <div class="border-b-[1px] border-[#fef3f3] flex flex-col py-4 gap-4">
        <div class="flex gap-4 justify-between">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-1">
              ${starsHTML}
            </div>
            <div class="flex gap-2 items-start">
              <div class="w-12 h-12 bg-[#efefef] relative">
                <div class="absolute w-4 h-4 bottom-0 right-0 bg-[#fa8a8a] flex items-center justify-center">
                  <span class="text-white text-xs">${review.avatarInitial}</span>
                </div>
              </div>
              <p class="text-[#fa8a8a]">${review.author}</p>
              ${review.isVerified ? '<p class="py-[2px] px-[6px] flex-shrink text-white bg-[#FA8A8A]">Verified</p>' : ''}
            </div>
          </div>
          <p class="text-[#7b7b7b]">${review.date}</p>
        </div>
        <p>${review.content}</p>
        <div class="flex">
          <p class="px-2 py-1 border">${review.source}</p>
        </div>
      </div>
    `;
  }).join('');

  const paginationHTML = renderPagination(totalPages);

  container.innerHTML = reviewsHTML + paginationHTML;
}

function renderPagination(totalPages) {
  if (totalPages <= 1) return '';

  let pages = [];
  const current = currentReviewPage;

  // Calculate range around current page (max 2 on each side)
  let rangeStart = Math.max(1, current - 2);
  let rangeEnd = Math.min(totalPages, current + 2);

  // Only show first page if it's within range or adjacent to range
  if (rangeStart > 1) {
    // Don't show first page separately, it's not adjacent
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  const prevButton = current > 1 
    ? `<button onclick="changeReviewPage(${current - 1})" class="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>`
    : '';

  const nextButton = current < totalPages 
    ? `<button onclick="changeReviewPage(${current + 1})" class="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100 transition-colors">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>`
    : '';

  // Progress bar pagination
  const progressPercent = ((current - 1) / (totalPages - 1)) * 100;
  const progressBar = `
    <div class="flex-1 h-1 bg-gray-300 rounded-full mx-4 relative">
      <div class="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
      <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full transition-all duration-300" style="left: ${progressPercent}%"></div>
    </div>
  `;

  return `
    <div class="flex justify-center items-center gap-2 mt-6 py-4">
      ${prevButton}
      ${progressBar}
      ${nextButton}
    </div>
  `;
}

function changeReviewPage(page) {
  currentReviewPage = page;
  renderReviews();
  document.getElementById('reviews-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// STORIES VIDEO CAROUSEL
let storiesData = [];
let currentStoryIndex = 0;
let isDragging = false;
let dragStartX = 0;
let dragCurrentTranslate = 0;
let dragPrevTranslate = 0;

async function loadStoriesData() {
  try {
    const response = await fetch('./data/stories.json');
    storiesData = await response.json();
    renderStoriesCarousel();
    window.addEventListener('resize', renderStoriesCarousel);
  } catch (error) {
    console.error('Error loading stories data:', error);
  }
}

function getStoriesPerView() {
  return window.innerWidth < 768 ? 1 : 4;
}

function getSlideWidthPercent() {
  // Mobile: each slide is 83.33% of container (shows 1 + 0.2 of next)
  // Desktop: each slide is 25% of container (shows 4)
  return window.innerWidth < 768 ? 83.33 : 25;
}

function getMaxStoryIndex() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    // On mobile, we can scroll through each individual slide
    return storiesData.length - 1;
  } else {
    // On desktop, we scroll in groups of 4, so max index allows last 4 to be visible
    return Math.max(0, storiesData.length - 4);
  }
}

function renderStoriesCarousel() {
  const container = document.getElementById('stories-container');
  if (!container) return;

  const isMobile = window.innerWidth < 768;
  const slideWidth = getSlideWidthPercent();
  const maxIndex = getMaxStoryIndex();
  
  // Clamp currentStoryIndex to valid range
  currentStoryIndex = Math.max(0, Math.min(currentStoryIndex, maxIndex));
  
  // Calculate translation based on current index
  const translateX = currentStoryIndex * slideWidth;

  const videosHTML = storiesData.map((story, index) => `
    <div class="stories-slide flex-shrink-0 px-2" style="width: ${slideWidth}%;">
      <div class="aspect-[9/16] rounded-xl overflow-hidden bg-gray-200 relative group cursor-pointer" onclick="playStoryVideo(${index})">
        <img 
          src="${story.poster}" 
          alt="Story ${index + 1}" 
          class="w-full h-full object-cover"
          id="story-poster-${index}"
        />
        <video 
          id="story-video-${index}"
          class="absolute inset-0 w-full h-full object-cover hidden"
          src="${story.video_url}"
          playsinline
          loop
        ></video>
        <div id="story-play-btn-${index}" class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Calculate progress for pagination
  const progressPercent = maxIndex > 0 ? (currentStoryIndex / maxIndex) * 100 : 0;

  const paginationHTML = `
    <div class="flex justify-center items-center gap-4 mt-6 py-4 px-4">
      <button onclick="prevStorySlide()" class="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-white/50 transition-colors ${currentStoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentStoryIndex === 0 ? 'disabled' : ''}>
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 max-w-md h-1 bg-gray-400 rounded-full relative">
        <div class="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
        <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full transition-all duration-300" style="left: calc(${progressPercent}% - 6px)"></div>
      </div>
      <button onclick="nextStorySlide()" class="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-white/50 transition-colors ${currentStoryIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''}" ${currentStoryIndex >= maxIndex ? 'disabled' : ''}>
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `;

  container.innerHTML = `
    <div class="overflow-hidden">
      <div 
        id="stories-track" 
        class="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing select-none"
        style="transform: translateX(-${translateX}%)"
      >
        ${videosHTML}
      </div>
    </div>
    ${paginationHTML}
  `;

  // Setup drag handlers
  const track = document.getElementById('stories-track');
  if (track) {
    track.addEventListener('mousedown', startStoriesDrag);
    track.addEventListener('touchstart', startStoriesDrag, { passive: true });
    document.addEventListener('mousemove', handleStoriesDrag);
    document.addEventListener('touchmove', handleStoriesDrag, { passive: false });
    document.addEventListener('mouseup', endStoriesDrag);
    document.addEventListener('touchend', endStoriesDrag);
  }
}

function startStoriesDrag(e) {
  isDragging = true;
  const track = document.getElementById('stories-track');
  if (track) {
    track.style.transition = 'none';
  }
  dragStartX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  dragPrevTranslate = currentStoryIndex * getSlideWidthPercent();
  dragCurrentTranslate = dragPrevTranslate;
}

function handleStoriesDrag(e) {
  if (!isDragging) return;
  
  const track = document.getElementById('stories-track');
  if (!track) return;
  
  const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const diff = dragStartX - currentX;
  const containerWidth = track.parentElement.offsetWidth;
  const diffPercent = (diff / containerWidth) * 100;
  
  dragCurrentTranslate = dragPrevTranslate + diffPercent;
  
  // Clamp to valid range with some rubber-band effect
  const maxTranslate = getMaxStoryIndex() * getSlideWidthPercent();
  if (dragCurrentTranslate < 0) {
    dragCurrentTranslate = dragCurrentTranslate * 0.3; // Rubber band at start
  } else if (dragCurrentTranslate > maxTranslate) {
    dragCurrentTranslate = maxTranslate + (dragCurrentTranslate - maxTranslate) * 0.3; // Rubber band at end
  }
  
  track.style.transform = `translateX(-${dragCurrentTranslate}%)`;
  
  if (e.cancelable) {
    e.preventDefault();
  }
}

function endStoriesDrag(e) {
  if (!isDragging) return;
  isDragging = false;
  
  const track = document.getElementById('stories-track');
  if (track) {
    track.style.transition = 'transform 0.3s ease-out';
  }
  
  const slideWidth = getSlideWidthPercent();
  const maxIndex = getMaxStoryIndex();
  
  // Determine which slide to snap to based on drag distance
  const dragDistance = dragCurrentTranslate - dragPrevTranslate;
  const threshold = slideWidth * 0.2; // 20% threshold to change slide
  
  if (Math.abs(dragDistance) > threshold) {
    if (dragDistance > 0 && currentStoryIndex < maxIndex) {
      // Dragged left, go to next
      currentStoryIndex++;
    } else if (dragDistance < 0 && currentStoryIndex > 0) {
      // Dragged right, go to previous
      currentStoryIndex--;
    }
  }
  
  // Snap to the current index
  const finalTranslate = currentStoryIndex * slideWidth;
  if (track) {
    track.style.transform = `translateX(-${finalTranslate}%)`;
  }
  
  // Update pagination after animation
  setTimeout(() => {
    renderStoriesCarousel();
  }, 300);
}

function prevStorySlide() {
  if (currentStoryIndex > 0) {
    currentStoryIndex--;
    renderStoriesCarousel();
  }
}

function nextStorySlide() {
  const maxIndex = getMaxStoryIndex();
  if (currentStoryIndex < maxIndex) {
    currentStoryIndex++;
    renderStoriesCarousel();
  }
}

function playStoryVideo(index) {
  // Pause all other videos first
  storiesData.forEach((_, i) => {
    if (i !== index) {
      const otherVideo = document.getElementById(`story-video-${i}`);
      const otherPoster = document.getElementById(`story-poster-${i}`);
      const otherPlayBtn = document.getElementById(`story-play-btn-${i}`);
      if (otherVideo && otherPoster && otherPlayBtn) {
        otherVideo.pause();
        otherVideo.classList.add('hidden');
        otherPoster.classList.remove('hidden');
        otherPlayBtn.classList.remove('hidden');
      }
    }
  });

  const video = document.getElementById(`story-video-${index}`);
  const poster = document.getElementById(`story-poster-${index}`);
  const playBtn = document.getElementById(`story-play-btn-${index}`);

  if (video && poster && playBtn) {
    if (video.paused) {
      video.classList.remove('hidden');
      poster.classList.add('hidden');
      playBtn.classList.add('hidden');
      video.play();
    } else {
      video.pause();
      video.classList.add('hidden');
      poster.classList.remove('hidden');
      playBtn.classList.remove('hidden');
    }
  }
}

// INITIALIZE ALL ON DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", async () => {
  initDonutCharts();
  initGenericAccordions();
  await Promise.all([
    loadFaqData(),
    loadIngredientsData(),
    loadReviewsData(),
    loadStoriesData()
  ]);
});
