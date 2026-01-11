// STORIES VIDEO CAROUSEL
let storiesData = [];
let currentStoryIndex = 0;
let isDragging = false;
let dragStartX = 0;
let dragCurrentTranslate = 0;
let dragPrevTranslate = 0;
let isStoriesAnimating = false;

async function loadStoriesData() {
  try {
    const response = await fetch("./data/stories.json");
    storiesData = await response.json();
    renderStoriesCarousel();
    window.addEventListener("resize", renderStoriesCarousel);
  } catch (error) {
    console.error("Error loading stories data:", error);
  }
}

function getStoriesPerView() {
  return window.innerWidth < 768 ? 1.2 : 4;
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
  const container = document.getElementById("stories-container");
  if (!container) return;

  const isMobile = window.innerWidth < 768;
  const slideWidth = getSlideWidthPercent();
  const maxIndex = getMaxStoryIndex();

  // Clamp currentStoryIndex to valid range
  currentStoryIndex = Math.max(0, Math.min(currentStoryIndex, maxIndex));

  // Calculate translation based on current index
  const translateX = currentStoryIndex * slideWidth;

  const videosHTML = storiesData
    .map(
      (story, index) => `
    <div class="stories-slide flex-shrink-0 px-2" style="width: ${slideWidth}%;">
        <div class="aspect-[9/16] rounded-[4px] overflow-hidden bg-gray-200 relative group cursor-pointer"
            onclick="playStoryVideo(${index})">
            <img src="${story.poster}" alt="Story ${
        index + 1
      }" class="w-full h-full object-cover" id="story-poster-${index}" />
            <video id="story-video-${index}" class="absolute inset-0 w-full h-full object-cover hidden"
                src="${story.video_url}" playsinline loop></video>
            <div id="story-play-btn-${index}"
                class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <img alt="play icon" class="w-8 h-8 object-cover" src="
         https://cdn.shopify.com/s/files/1/0917/5649/5191/files/mingcute_play-fill.png?v=1752485519
" />
            </div>
        </div>
    </div>
  `
    )
    .join("");

  // Calculate progress bar width: visible items / total items
  const visibleItems = getStoriesPerView(); // 4 for desktop, 1.2 for mobile
  const totalItems = storiesData.length;
  const progressBarWidthPercent = (visibleItems / totalItems) * 100;

  // Calculate progress bar position based on current index
  // The bar can move from 0% to (100% - barWidth%)
  const maxScrollableItems = totalItems - (isMobile ? 1 : 4);
  const scrollProgress =
    maxScrollableItems > 0 ? currentStoryIndex / maxScrollableItems : 0;
  const maxLeftPosition = 100 - progressBarWidthPercent;
  const progressBarLeft = scrollProgress * maxLeftPosition;

  const paginationHTML = `
    <div class="flex items-center gap-4 mt-6 py-4 px-4">
      <div id="stories-progress-track" class="flex-1 h-1 bg-[#D4D4C9] rounded-full relative cursor-pointer" onclick="onStoriesProgressClick(event)">
        <div class="absolute top-0 h-full bg-[#039869] rounded-full transition-all duration-300" style="width: ${progressBarWidthPercent}%; left: ${progressBarLeft}%"></div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="prevStorySlide()" class="w-10 h-10 bg-white flex items-center justify-center border border-[#D4D4C9] rounded-full hover:bg-white/50 transition-colors ${
          currentStoryIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
        }" ${currentStoryIndex === 0 ? "disabled" : ""}>
     <img class="w-full h-full" src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin_55aa38bb-cb5e-4608-9097-927814968771.png?v=1758716845" alt="chevron left"/>  
        </button>
        <button onclick="nextStorySlide()" class="w-10 h-10 bg-white flex items-center justify-center border border-[#D4D4C9] rounded-full hover:bg-white/50 transition-colors ${
          currentStoryIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : ""
        }" ${currentStoryIndex >= maxIndex ? "disabled" : ""}>
     <img class="rotate-180 w-full h-full" src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin_55aa38bb-cb5e-4608-9097-927814968771.png?v=1758716845" alt="chevron left"/>  
      
        </button>
      </div>
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
  const track = document.getElementById("stories-track");
  if (track) {
    track.addEventListener("mousedown", startStoriesDrag);
    track.addEventListener("touchstart", startStoriesDrag, { passive: true });
    document.addEventListener("mousemove", handleStoriesDrag);
    document.addEventListener("touchmove", handleStoriesDrag, {
      passive: false,
    });
    document.addEventListener("mouseup", endStoriesDrag);
    document.addEventListener("touchend", endStoriesDrag);
  }
}

// Click on progress bar to jump to position
function onStoriesProgressClick(e) {
  if (isStoriesAnimating) return;

  const progressTrack = e.currentTarget;
  const rect = progressTrack.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const trackWidth = rect.width;
  const clickPercent = clickX / trackWidth;

  const maxIndex = getMaxStoryIndex();
  const targetIndex = Math.round(clickPercent * maxIndex);

  if (targetIndex !== currentStoryIndex) {
    animateStoriesToIndex(targetIndex);
  }
}

// Animation to target index
function animateStoriesToIndex(targetIndex) {
  if (isStoriesAnimating || targetIndex === currentStoryIndex) return;
  isStoriesAnimating = true;

  const track = document.getElementById("stories-track");
  if (!track) {
    isStoriesAnimating = false;
    return;
  }

  const slideWidth = getSlideWidthPercent();
  const maxIndex = getMaxStoryIndex();

  // Clamp target index
  targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

  const steps = Math.abs(targetIndex - currentStoryIndex);
  const duration = Math.min(200 + steps * 50, 400);

  const startTranslate = currentStoryIndex * slideWidth;
  const endTranslate = targetIndex * slideWidth;

  // Apply linear transition
  track.style.transition = `transform ${duration}ms linear`;
  track.style.transform = `translateX(-${endTranslate}%)`;

  // Update progress bar smoothly
  updateStoriesProgressBar(targetIndex, duration);

  setTimeout(() => {
    currentStoryIndex = targetIndex;
    isStoriesAnimating = false;
    renderStoriesCarousel();
  }, duration + 20);
}

// Update progress bar position during animation
function updateStoriesProgressBar(targetIndex, duration) {
  const progressBar = document.querySelector("#stories-progress-track > div");
  if (!progressBar) return;

  const isMobile = window.innerWidth < 768;
  const visibleItems = getStoriesPerView();
  const totalItems = storiesData.length;
  const progressBarWidthPercent = (visibleItems / totalItems) * 100;

  const maxScrollableItems = totalItems - (isMobile ? 1 : 4);
  const scrollProgress =
    maxScrollableItems > 0 ? targetIndex / maxScrollableItems : 0;
  const maxLeftPosition = 100 - progressBarWidthPercent;
  const progressBarLeft = scrollProgress * maxLeftPosition;

  progressBar.style.transition = `left ${duration}ms linear`;
  progressBar.style.left = `${progressBarLeft}%`;
}

function startStoriesDrag(e) {
  if (isStoriesAnimating) return;
  isDragging = true;
  const track = document.getElementById("stories-track");
  if (track) {
    track.style.transition = "none";
  }
  dragStartX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  dragPrevTranslate = currentStoryIndex * getSlideWidthPercent();
  dragCurrentTranslate = dragPrevTranslate;
}

function handleStoriesDrag(e) {
  if (!isDragging || isStoriesAnimating) return;

  const track = document.getElementById("stories-track");
  if (!track) return;

  const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
  const diff = dragStartX - currentX;
  const containerWidth = track.parentElement.offsetWidth;
  const diffPercent = (diff / containerWidth) * 100;

  dragCurrentTranslate = dragPrevTranslate + diffPercent;

  // Clamp to valid range with some rubber-band effect
  const maxTranslate = getMaxStoryIndex() * getSlideWidthPercent();
  if (dragCurrentTranslate < 0) {
    dragCurrentTranslate = dragCurrentTranslate * 0.3; // Rubber band at start
  } else if (dragCurrentTranslate > maxTranslate) {
    dragCurrentTranslate =
      maxTranslate + (dragCurrentTranslate - maxTranslate) * 0.3; // Rubber band at end
  }

  track.style.transform = `translateX(-${dragCurrentTranslate}%)`;

  if (e.cancelable) {
    e.preventDefault();
  }
}

function endStoriesDrag(e) {
  if (!isDragging) return;
  isDragging = false;

  const track = document.getElementById("stories-track");
  if (track) {
    track.style.transition = "transform 0.3s ease-out";
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
  if (isStoriesAnimating) return;
  if (currentStoryIndex > 0) {
    animateStoriesToIndex(currentStoryIndex - 1);
  }
}

function nextStorySlide() {
  if (isStoriesAnimating) return;
  const maxIndex = getMaxStoryIndex();
  if (currentStoryIndex < maxIndex) {
    animateStoriesToIndex(currentStoryIndex + 1);
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
        otherVideo.classList.add("hidden");
        otherPoster.classList.remove("hidden");
        otherPlayBtn.classList.remove("hidden");
      }
    }
  });

  const video = document.getElementById(`story-video-${index}`);
  const poster = document.getElementById(`story-poster-${index}`);
  const playBtn = document.getElementById(`story-play-btn-${index}`);

  if (video && poster && playBtn) {
    if (video.paused) {
      video.classList.remove("hidden");
      poster.classList.add("hidden");
      playBtn.classList.add("hidden");
      video.play();
    } else {
      video.pause();
      video.classList.add("hidden");
      poster.classList.remove("hidden");
      playBtn.classList.remove("hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadStoriesData();
});
