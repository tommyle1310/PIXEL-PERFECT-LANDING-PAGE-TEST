const productImages = [
  "https://trysculptique.com/cdn/shop/files/LymoPDPImagesArtboard1_8e287aa1-576e-42b1-9a87-ce2fcdaded3a.jpg?v=1760103674",
  "https://trysculptique.com/cdn/shop/files/LymphDrainageREWAMPEDvisualsArtboard2.jpg?v=1760103684",
  "https://trysculptique.com/cdn/shop/files/LymphDrainageREWAMPEDvisualsArtboard3copy.jpg?v=1760103684",
  "https://trysculptique.com/cdn/shop/files/LymphDrainageREWAMPEDvisualsArtboard4.jpg?v=1760103685",
  "https://trysculptique.com/cdn/shop/files/LymphDrainageREWAMPEDvisualsArtboard5_1.jpg?v=1760103685",
  "https://trysculptique.com/cdn/shop/files/LymphDrainageREWAMPEDvisualsArtboard5_2.jpg?v=1760103685",
];

const badgeImg =
  "https://cdn.shopify.com/s/files/1/0917/5649/5191/files/nysale.png?v=1766822224";

class ProductImageSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.images = productImages;
    this.currentIndex = 0;
    this.isAnimating = false;

    this.render();
    this.bindEvents();
  }

  // Get index with infinite loop wrapping
  getWrappedIndex(index) {
    const len = this.images.length;
    return ((index % len) + len) % len;
  }

  // Get 6 images for thumbnail slider: 1 prev + 4 visible + 1 next
  // This allows sliding 1 image at a time
  getThumbnailSliderImages() {
    const result = [];
    // 1 previous image + 4 current visible + 1 next image = 6 total
    for (let i = -1; i <= 4; i++) {
      const idx = this.getWrappedIndex(this.currentIndex + i);
      result.push({ src: this.images[idx], index: idx });
    }
    return result;
  }

  // Get prev, current, next images for main slider
  getSliderImages() {
    return {
      prev: this.images[this.getWrappedIndex(this.currentIndex - 1)],
      current: this.images[this.currentIndex],
      next: this.images[this.getWrappedIndex(this.currentIndex + 1)],
    };
  }

  render() {
    const sliderImages = this.getSliderImages();
    const thumbImages = this.getThumbnailSliderImages(); // 6 images

    this.container.innerHTML = `
      <!-- MAIN IMAGE WITH CHEVRONS (Mobile only) -->
      <div class="relative flex items-center">
        <!-- Left Chevron (Mobile only) -->
        <button id="slider-prev" class="md:hidden absolute left-[24px] mt-4 z-10 w-[32px] aspect-square flex items-center justify-center transition-all">
          <img loading="lazy"alt="left arrow" class="object-cover w-full h-full" src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin_1.png?v=1752126281" draggable="false">
        </button>

        <!-- Main Image Slider (Mobile) -->
        <div id="main-slider-container" class="md:hidden w-full aspect-square rounded-[8px] md:rounded-[12px] overflow-hidden bg-gray-200 relative cursor-grab active:cursor-grabbing select-none">
          <div id="main-slider-track" class="flex h-full transition-transform duration-300 ease-out" style="width: 300%; transform: translateX(-33.333%);">
            <div class="w-1/3 h-full flex-shrink-0">
              <img loading="lazy"src="${
                sliderImages.prev
              }" class="w-full h-full object-cover pointer-events-none" alt="Previous" draggable="false">
            </div>
            <div class="w-1/3 h-full flex-shrink-0">
              <img loading="lazy"src="${
                sliderImages.current
              }" class="w-full h-full object-cover pointer-events-none" alt="Current" draggable="false">
            </div>
            <div class="w-1/3 h-full flex-shrink-0">
              <img loading="lazy"src="${
                sliderImages.next
              }" class="w-full h-full object-cover pointer-events-none" alt="Next" draggable="false">
            </div>
          </div>
          <div class="absolute top-[16px] right-[16px] w-[80px] aspect-square pointer-events-none">
            <img loading="lazy"src="${badgeImg}" alt="new year sale badge" draggable="false">
          </div>
        </div>

        <!-- Main Image Static (Tablet+) -->
        <div class="hidden md:block w-full aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
          <img loading="lazy"src="${
            this.images[0]
          }" class="w-full h-full object-cover" alt="Product image">
          <div class="absolute top-4 right-4 max-w-[80px] lg:max-w-[120px] aspect-square pointer-events-none">
            <img loading="lazy"src="${badgeImg}" alt="new year sale badge">
          </div>
        </div>

        <!-- Right Chevron (Mobile only) -->
        <button id="slider-next" class="md:hidden absolute right-[24px] mt-4 z-10 w-[32px] aspect-square flex items-center justify-center transition-all">
          <img loading="lazy"alt="right arrow" class="object-cover w-full h-full" src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/iconamoon_arrow-up-2-thin.png?v=1752126281" draggable="false">
        </button>

        <!-- Nutrition In4 -->
        <button
            onclick="openModal()"
            style=" font-family: 'Montserrat', sans-serif;"
            class="absolute bottom-[32px] left-1/2 -translate-x-1/2
                    inline-flex items-center gap-[8px]
                    rounded-[24px]
                    bg-[#ffffffd9]
                    px-[24px] py-[8px]
                    max-w-[290px]
                    text-[#383938]
                    border border-black
                    hover:opacity-70 duration-200"
            >
            <img
                src="https://cdn.shopify.com/s/files/1/0917/5649/5191/files/leaves_1247958_1.png?v=1752126615"
                class="w-[24px] h-[24px] object-cover shrink-0"
                alt=""
            />
            <span class="text-[14px] leading-[1.2] font-mont font-[400]">Nutritional Information
            </span>
        </button>


      </div>

      <!-- THUMBNAILS: MOBILE (slides 1 image at a time) -->
      <!-- 6 images total: 1 prev + 4 visible + 1 next. Show 4 at a time, each = 25% of container -->
      <div id="thumbnails-mobile" class="relative mt-[8px] mb-4 mx-1 md:hidden overflow-hidden cursor-grab active:cursor-grabbing select-none">
        <div id="thumbnails-track" class="flex gap-2 transition-transform duration-300 ease-out" style="width: calc(150% + 10px); transform: translateX(calc(-16.666% - 1.333px));">
          ${thumbImages
            .map(
              (thumb, i) => `
            <div class="aspect-square rounded-lg overflow-hidden cursor-pointer thumbnail-item hover:border-[#039869] transition-all flex-shrink-0" style="width: calc((100% - 45px) / 6);" data-index="${thumb.index}">
              <img loading="lazy"src="${thumb.src}" class="w-full h-full object-cover pointer-events-none" alt="Product thumbnail" draggable="false">
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <!-- THUMBNAILS: TABLET+ (Static, no interaction) -->
      <div class="hidden md:block space-y-3 mt-4">
        <div class="grid grid-cols-2 gap-3">
          ${this.images
            .slice(1, 3)
            .map(
              (src) => `
            <div class="aspect-square rounded-md overflow-hidden">
              <img loading="lazy"src="${src}" class="w-full h-full object-cover" alt="Product thumbnail">
            </div>
          `
            )
            .join("")}
        </div>
        <div class="grid grid-cols-3 gap-3">
          ${this.images
            .slice(3, 6)
            .map(
              (src) => `
            <div class="aspect-square rounded-md overflow-hidden">
              <img loading="lazy"src="${src}" class="w-full h-full object-cover" alt="Product thumbnail">
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Only bind events on mobile
    const prevBtn = this.container.querySelector("#slider-prev");
    const nextBtn = this.container.querySelector("#slider-next");

    // Prev/Next buttons (Mobile only - they're hidden on md+)
    if (prevBtn) prevBtn.addEventListener("click", () => this.prev());
    if (nextBtn) nextBtn.addEventListener("click", () => this.next());

    // Mobile thumbnail clicks
    this.container.querySelectorAll(".thumbnail-item").forEach((thumb) => {
      thumb.addEventListener("click", (e) => {
        if (this.isAnimating) return;
        const index = parseInt(e.currentTarget.dataset.index);
        this.goTo(index);
      });
    });

    // Touch/Pan events for main slider (Mobile only)
    const mainSlider = this.container.querySelector("#main-slider-container");
    if (mainSlider) {
      this.bindPanEvents(mainSlider, "main");
    }

    // Touch/Pan events for mobile thumbnails
    const thumbsContainer = this.container.querySelector("#thumbnails-mobile");
    if (thumbsContainer) {
      this.bindPanEvents(thumbsContainer, "thumbs");
    }
  }

  bindPanEvents(element, type) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const getClientX = (e) => {
      if (e.type.includes("touch")) {
        return e.touches && e.touches[0]
          ? e.touches[0].clientX
          : e.changedTouches[0].clientX;
      }
      return e.clientX;
    };

    // Thumbnail track: 6 items, showing 4. Each item = 16.666% of track.
    // Base position shows items 1-4 (index 1 to 4), so translateX(-16.666%)
    const thumbBaseOffset = -16.666;
    const thumbItemWidth = 16.666;

    const onStart = (e) => {
      if (this.isAnimating) return;
      isDragging = true;
      startX = getClientX(e);
      currentX = startX;

      // Disable transition during drag
      if (type === "main") {
        const track = this.container.querySelector("#main-slider-track");
        if (track) track.style.transition = "none";
      } else {
        const track = this.container.querySelector("#thumbnails-track");
        if (track) track.style.transition = "none";
      }
    };

    const onMove = (e) => {
      if (!isDragging || this.isAnimating) return;
      currentX = getClientX(e);
      const diff = currentX - startX;
      const containerWidth = element.offsetWidth;

      if (type === "main") {
        const track = this.container.querySelector("#main-slider-track");
        if (track) {
          const baseOffset = -33.333;
          const dragPercent = (diff / containerWidth) * 33.333;
          track.style.transform = `translateX(${baseOffset + dragPercent}%)`;
        }
      } else {
        const track = this.container.querySelector("#thumbnails-track");
        if (track) {
          // For thumbnails, drag moves by 1 item width relative to container
          const dragPercent = (diff / containerWidth) * (thumbItemWidth * 4); // scale to visible area
          track.style.transform = `translateX(calc(${
            thumbBaseOffset + dragPercent
          }% - 1.333px))`;
        }
      }
    };

    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;

      const diff = currentX - startX;
      const containerWidth = element.offsetWidth;
      const threshold = containerWidth * 0.25;

      if (type === "main") {
        const track = this.container.querySelector("#main-slider-track");
        if (track) {
          track.style.transition = "transform 0.3s ease-out";

          if (diff > threshold) {
            this.animateSlide("prev");
          } else if (diff < -threshold) {
            this.animateSlide("next");
          } else {
            track.style.transform = "translateX(-33.333%)";
          }
        }
      } else {
        const track = this.container.querySelector("#thumbnails-track");
        if (track) {
          track.style.transition = "transform 0.3s ease-out";

          // Threshold for thumbs: 25% of one thumbnail width
          const thumbThreshold = (containerWidth / 4) * 0.25;

          if (diff > thumbThreshold) {
            this.animateSlide("prev");
          } else if (diff < -thumbThreshold) {
            this.animateSlide("next");
          } else {
            track.style.transform = `translateX(calc(-16.666% - 1.333px))`;
          }
        }
      }
    };

    // Mouse events
    element.addEventListener("mousedown", onStart);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);

    // Touch events
    element.addEventListener("touchstart", onStart, { passive: true });
    element.addEventListener("touchmove", onMove, { passive: true });
    element.addEventListener("touchend", onEnd);
  }

  animateSlide(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const mainTrack = this.container.querySelector("#main-slider-track");
    const thumbsTrack = this.container.querySelector("#thumbnails-track");

    // Apply transition to both tracks
    if (mainTrack) mainTrack.style.transition = "transform 0.3s ease-out";
    if (thumbsTrack) thumbsTrack.style.transition = "transform 0.3s ease-out";

    // Main slider: slides by 33.333% (1 full image)
    const mainTarget =
      direction === "next" ? "translateX(-66.666%)" : "translateX(0%)";

    // Thumbnail slider: slides by 16.666% (1 thumbnail)
    // Base is -16.666%, next goes to -33.333%, prev goes to 0%
    const thumbTarget =
      direction === "next"
        ? "translateX(calc(-33.333% - 1.333px))"
        : "translateX(-1.333px)";

    if (mainTrack) mainTrack.style.transform = mainTarget;
    if (thumbsTrack) thumbsTrack.style.transform = thumbTarget;

    setTimeout(() => {
      if (direction === "next") {
        this.currentIndex = this.getWrappedIndex(this.currentIndex + 1);
      } else {
        this.currentIndex = this.getWrappedIndex(this.currentIndex - 1);
      }
      this.isAnimating = false;
      this.render();
      this.bindEvents();
    }, 300);
  }

  prev() {
    if (this.isAnimating) return;
    this.animateSlide("prev");
  }

  next() {
    if (this.isAnimating) return;
    this.animateSlide("next");
  }

  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;

    this.isAnimating = true;

    const len = this.images.length;

    // Always animate 'next' (right) direction since thumbnails are always
    // positioned to the right of the active image. Calculate forward steps,
    // wrapping around if needed.
    const direction = "next";
    const steps = (index - this.currentIndex + len) % len;

    const mainContainer = this.container.querySelector(
      "#main-slider-container"
    );
    const thumbsContainer = this.container.querySelector("#thumbnails-mobile");
    const mainTrack = mainContainer
      ? mainContainer.querySelector("#main-slider-track")
      : null;
    const thumbsTrack = thumbsContainer
      ? thumbsContainer.querySelector("#thumbnails-track")
      : null;

    const duration = Math.min(250 + steps * 50, 400);

    // === STEP 1: BUILD BOTH TRACKS (no transition) ===

    // Main track: [current, next1, next2, ..., target] for 'next'
    // Main track: [target, ..., prev1, current] for 'prev'
    let mainImagesArr = [];
    if (direction === "next") {
      for (let i = 0; i <= steps; i++) {
        mainImagesArr.push(
          this.images[this.getWrappedIndex(this.currentIndex + i)]
        );
      }
    } else {
      for (let i = -steps; i <= 0; i++) {
        mainImagesArr.push(
          this.images[this.getWrappedIndex(this.currentIndex + i)]
        );
      }
    }

    // Thumbs track: build array that shows 4 visible + slides by 'steps'
    let thumbsArr = [];
    if (direction === "next") {
      // [current+0, current+1, current+2, current+3, ..., target+3]
      for (let i = 0; i <= steps + 3; i++) {
        const idx = this.getWrappedIndex(this.currentIndex + i);
        thumbsArr.push({ src: this.images[idx], index: idx });
      }
    } else {
      // [target+0, target+1, target+2, target+3, ..., current+3]
      for (let i = -steps; i <= 3; i++) {
        const idx = this.getWrappedIndex(this.currentIndex + i);
        thumbsArr.push({ src: this.images[idx], index: idx });
      }
    }

    // === STEP 2: SET UP MAIN TRACK ===
    if (mainTrack) {
      const numItems = mainImagesArr.length;
      const itemWidthPercent = 100 / numItems;

      mainTrack.style.transition = "none";
      mainTrack.style.width = `${numItems * 100}%`;
      mainTrack.innerHTML = mainImagesArr
        .map(
          (src) => `
        <div class="h-full flex-shrink-0" style="width: ${itemWidthPercent}%;">
          <img loading="lazy"src="${src}" class="w-full h-full object-cover pointer-events-none" alt="" draggable="false">
        </div>
      `
        )
        .join("");

      // Start position: show first item (index 0) for both directions
      if (direction === "next") {
        mainTrack.style.transform = "translateX(0%)";
      } else {
        // For prev, start showing last item (current), which is at index 'steps'
        mainTrack.style.transform = `translateX(-${steps * itemWidthPercent}%)`;
      }
    }

    // === STEP 3: SET UP THUMBS TRACK ===
    if (thumbsTrack) {
      const numItems = thumbsArr.length;
      const trackWidthPercent = (numItems / 4) * 100; // 4 visible items
      const itemWidthPercent = 100 / numItems;
      const gapPx = 8;
      const totalGapPx = gapPx * (numItems - 1);
      const gapPerItem = totalGapPx / numItems;

      thumbsTrack.style.transition = "none";
      thumbsTrack.style.width = `${trackWidthPercent}%`;
      thumbsTrack.innerHTML = thumbsArr
        .map(
          (thumb) => `
        <div class="aspect-square rounded-lg overflow-hidden cursor-pointer thumbnail-item hover:border-[#039869] transition-colors flex-shrink-0" style="width: calc(${itemWidthPercent}% - ${gapPerItem}px);" data-index="${thumb.index}">
          <img loading="lazy"src="${thumb.src}" class="w-full h-full object-cover pointer-events-none" alt="" draggable="false">
        </div>
      `
        )
        .join("");

      // Start position
      if (direction === "next") {
        thumbsTrack.style.transform = "translateX(0%)";
      } else {
        thumbsTrack.style.transform = `translateX(-${
          steps * itemWidthPercent
        }%)`;
      }
    }

    // === STEP 4: FORCE REFLOW ===
    if (mainTrack) mainTrack.getBoundingClientRect();
    if (thumbsTrack) thumbsTrack.getBoundingClientRect();

    // === STEP 5: ANIMATE BOTH AT SAME TIME ===
    // Use setTimeout 0 to ensure styles are applied before animation starts
    setTimeout(() => {
      const mainNumItems = mainImagesArr.length;
      const mainItemWidth = 100 / mainNumItems;
      const thumbNumItems = thumbsArr.length;
      const thumbItemWidth = 100 / thumbNumItems;

      if (mainTrack) {
        mainTrack.style.transition = `transform ${duration}ms linear`;
        if (direction === "next") {
          // Slide to show last item (target)
          mainTrack.style.transform = `translateX(-${steps * mainItemWidth}%)`;
        } else {
          // Slide to show first item (target)
          mainTrack.style.transform = "translateX(0%)";
        }
      }

      if (thumbsTrack) {
        thumbsTrack.style.transition = `transform ${duration}ms linear`;
        if (direction === "next") {
          thumbsTrack.style.transform = `translateX(-${
            steps * thumbItemWidth
          }%)`;
        } else {
          thumbsTrack.style.transform = "translateX(0%)";
        }
      }

      // === STEP 6: CLEANUP AFTER ANIMATION ===
      setTimeout(() => {
        this.currentIndex = index;
        this.isAnimating = false;
        this.render();
        this.bindEvents();
      }, duration + 20);
    }, 0);
  }
}

// Initialize slider
document.addEventListener("DOMContentLoaded", () => {
  new ProductImageSlider("product-images-slider");
});
