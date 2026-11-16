/**
 * 21st.dev ScrollGallery implementation for K.N. Bhandari Legacy Archive
 * Powered by GSAP ScrollTrigger with horizontal strip-mask wipe transitions.
 */

(function initScrollGallery() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[ScrollGallery] GSAP or ScrollTrigger not loaded yet.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const MASK_HIDDEN = "linear-gradient(to bottom, transparent 0%, transparent 100%)";
  const MASK_REVEALED = "linear-gradient(to bottom, black 0%, black 100%)";

  const MASKED_IMAGE_STYLE =
    "width:100%;height:100%;object-fit:cover;transform-origin:center center;backface-visibility:hidden;mask-size:100% 100%;-webkit-mask-size:100% 100%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;will-change:transform,mask-image;";

  const IMAGE_CONTAINER_STYLE =
    "position:absolute;top:0;left:0;width:100%;height:100%;transform:translateZ(0);backface-visibility:hidden;";

  function createStripBounds(stripsCount) {
    return Array.from({ length: stripsCount }, (_, j) => {
      const posFromBottom = stripsCount - j - 1;
      const step = 100 / stripsCount;
      const lower = (posFromBottom + 1) * step;
      const upper = posFromBottom * step;
      return {
        lower,
        upperGap: upper - 0.1,
        delay: (j / stripsCount) * 0.5,
      };
    });
  }

  function mergeIntervals(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a.top - b.top);
    const merged = [{ ...intervals[0] }];
    for (let i = 1; i < intervals.length; i++) {
      const last = merged[merged.length - 1];
      const next = intervals[i];
      if (next.top <= last.bottom) {
        last.bottom = Math.max(last.bottom, next.bottom);
      } else {
        merged.push({ ...next });
      }
    }
    return merged;
  }

  function buildStripMask(stripBounds, getAdj) {
    const intervals = [];
    for (let j = 0; j < stripBounds.length; j++) {
      const bounds = stripBounds[j];
      const adj = Math.max(0, Math.min(1, getAdj(j, bounds)));
      if (adj <= 0) continue;
      const sliceHeight = bounds.lower - bounds.upperGap;
      intervals.push({
        top: bounds.lower - adj * sliceHeight,
        bottom: bounds.lower,
      });
    }
    const merged = mergeIntervals(intervals);
    if (!merged.length) return MASK_HIDDEN;
    const stops = [];
    let cursor = 0;
    for (const { top, bottom } of merged) {
      if (top > cursor) {
        stops.push(`transparent ${cursor}%`, `transparent ${top}%`);
      }
      stops.push(`black ${top}%`, `black ${bottom}%`);
      cursor = bottom;
    }
    if (cursor < 100) {
      stops.push(`transparent ${cursor}%`, "transparent 100%");
    }
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
  }

  function setMaskImage(el, value) {
    el.style.maskImage = value;
    el.style.webkitMaskImage = value;
  }

  function createScaleSetter(el, initialScale) {
    const apply = (val) => {
      el.style.transform = `translate3d(0, 0, 0) scale(${val})`;
    };
    apply(initialScale);
    return apply;
  }

  window.setup21DevScrollGallery = function (containerSelector, slidesData, options = {}) {
    const section = document.querySelector(containerSelector);
    if (!section || !slidesData || slidesData.length === 0) return;

    const stripsCount = options.stripsCount || 20;
    const scrollPerTransition = options.scrollPerTransition || 800;
    const initialDelay = options.initialDelay || 200;
    const finalDelay = options.finalDelay || 200;
    const scaleFrom = options.scaleFrom || 1.25;
    const scaleTo = options.scaleTo || 1.0;
    const scaleRange = scaleFrom - scaleTo;
    const scaleStep = scaleRange / 2;
    const stripRevealSpeed = options.stripRevealSpeed || 2;
    const titleDuration = options.titleDuration || 0.3;
    const titleEase = options.titleEase || "power2.out";

    const slideImages = section.querySelector('.sg-slide-images');
    const firstSlideImg = section.querySelector('.sg-first-image');
    const titleEl = section.querySelector('.sg-title-text');
    const exploreLinkEl = section.querySelector('.sg-explore-link');

    if (!slideImages || !firstSlideImg) return;

    const totalSlides = slidesData.length;
    const stripBounds = createStripBounds(stripsCount);
    const setFirstImgScale = createScaleSetter(firstSlideImg, scaleFrom);

    const slideLayers = [];

    // Dynamically generate slide layers 1..N
    for (let i = 1; i < totalSlides; i++) {
      const imgContainer = document.createElement('div');
      imgContainer.style.cssText = IMAGE_CONTAINER_STYLE;

      const img = document.createElement('img');
      img.style.cssText = MASKED_IMAGE_STYLE;
      img.src = slidesData[i].image;
      img.alt = slidesData[i].title || "";
      img.decoding = "async";
      setMaskImage(img, MASK_HIDDEN);

      imgContainer.appendChild(img);
      slideImages.appendChild(imgContainer);

      slideLayers.push({
        transitionIndex: i - 1,
        img,
        setScale: createScaleSetter(img, scaleFrom),
        revealState: "hidden"
      });
    }

    const transitionCount = totalSlides - 1;
    const totalScrollDistance =
      transitionCount * scrollPerTransition + initialDelay + finalDelay;

    const transitionRanges = [];
    let pos = initialDelay;
    for (let i = 0; i < transitionCount; i++) {
      const start = pos;
      const end = start + scrollPerTransition;
      transitionRanges.push({
        startPercent: start / totalScrollDistance,
        endPercent: end / totalScrollDistance,
      });
      pos = end;
    }

    function calculateImageProgress(scrollProgress) {
      const firstRange = transitionRanges[0];
      const lastRange = transitionRanges[transitionRanges.length - 1];
      if (!firstRange || !lastRange) return 0;
      if (scrollProgress < firstRange.startPercent) return 0;
      if (scrollProgress > lastRange.endPercent) return transitionRanges.length;

      for (let i = 0; i < transitionRanges.length; i++) {
        const { startPercent, endPercent } = transitionRanges[i];
        if (scrollProgress >= startPercent && scrollProgress <= endPercent) {
          const norm = (scrollProgress - startPercent) / (endPercent - startPercent);
          return i + norm;
        }
      }
      return transitionRanges.length;
    }

    function getScaleForImage(imageIndex, currentImageIndex, progress) {
      const continuousProgress = currentImageIndex + progress;
      const diff = continuousProgress - imageIndex;
      if (diff <= 0) return scaleFrom;
      if (diff >= 2) return scaleTo;
      return scaleFrom - scaleStep * diff;
    }

    let currentTitleIndex = 0;
    let queuedTitleIndex = null;
    let isAnimating = false;
    let lastImageProgress = 0;

    function updateLinkForSlide(index) {
      if (!exploreLinkEl) return;
      exploreLinkEl.href = slidesData[index].url || "#archive";
      const label = slidesData[index].linkLabel || options.linkLabel || "View Record";
      exploreLinkEl.textContent = label;
    }

    function animateTitleChange(index, direction) {
      if (!titleEl || index === currentTitleIndex || index < 0 || index >= slidesData.length) return;
      if (isAnimating) {
        queuedTitleIndex = index;
        return;
      }
      isAnimating = true;
      const offset = "120%";
      const outY = direction === "down" ? `-${offset}` : offset;
      const inY = direction === "down" ? offset : `-${offset}`;

      gsap.killTweensOf(titleEl);
      updateLinkForSlide(index);

      gsap.to(titleEl, {
        y: outY,
        duration: titleDuration,
        ease: titleEase,
        onComplete: () => {
          titleEl.textContent = slidesData[index].title || "";
          gsap.set(titleEl, { y: inY });
          gsap.to(titleEl, {
            y: "0%",
            duration: titleDuration,
            ease: titleEase,
            onComplete: () => {
              currentTitleIndex = index;
              isAnimating = false;
              if (queuedTitleIndex !== null && queuedTitleIndex !== currentTitleIndex) {
                const next = queuedTitleIndex;
                queuedTitleIndex = null;
                animateTitleChange(next, direction);
              }
            }
          });
        }
      });
    }

    function setLayerRevealed(layer) {
      if (layer.revealState === "revealed") return;
      setMaskImage(layer.img, MASK_REVEALED);
      layer.revealState = "revealed";
    }

    function setLayerHidden(layer) {
      if (layer.revealState === "hidden") return;
      setMaskImage(layer.img, MASK_HIDDEN);
      layer.revealState = "hidden";
    }

    function handleScrollUpdate(progress) {
      const imageProgress = calculateImageProgress(progress);
      const scrollDirection = imageProgress > lastImageProgress ? "down" : "up";
      const currentImageIndex = Math.floor(imageProgress);
      const imageSpecificProgress = imageProgress - currentImageIndex;

      if (titleEl) {
        const correctTitleIndex = imageSpecificProgress >= 0.3
          ? Math.min(currentImageIndex + 1, slidesData.length - 1)
          : currentImageIndex;

        if (correctTitleIndex !== currentTitleIndex) {
          queuedTitleIndex = correctTitleIndex;
          if (!isAnimating) {
            animateTitleChange(correctTitleIndex, scrollDirection);
          }
        }
      }

      setFirstImgScale(getScaleForImage(0, currentImageIndex, imageSpecificProgress));

      for (const layer of slideLayers) {
        const { transitionIndex, setScale } = layer;
        setScale(getScaleForImage(transitionIndex, currentImageIndex, imageSpecificProgress));

        if (transitionIndex < currentImageIndex) {
          setLayerRevealed(layer);
        } else if (transitionIndex === currentImageIndex) {
          layer.revealState = "animating";
          setMaskImage(
            layer.img,
            buildStripMask(stripBounds, (_j, bounds) =>
              Math.max(0, Math.min(1, (imageSpecificProgress - bounds.delay) * stripRevealSpeed))
            )
          );
        } else {
          setLayerHidden(layer);
        }
      }

      lastImageProgress = imageProgress;
    }

    // ScrollTrigger creation
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: `+=${totalScrollDistance}vh`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        handleScrollUpdate(self.progress);
      }
    });

    ScrollTrigger.refresh();
  };

  // Auto-mount if gallery container exists on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#kn-scroll-gallery")) {
      // Authentic photo collection from client directory without guessing or making up names
      const authenticArchivalSlides = [
        {
          image: "assets/images/client/kn-authentic-1.jpg",
          url: "archive.html",
          linkLabel: "Open Archive"
        },
        {
          image: "assets/images/client/kn-authentic-2.jpg",
          url: "archive.html",
          linkLabel: "Open Archive"
        },
        {
          image: "assets/images/client/kn-authentic-3.jpg",
          url: "archive.html",
          linkLabel: "Open Archive"
        },
        {
          image: "assets/images/client/kn-authentic-5.jpg",
          url: "archive.html",
          linkLabel: "Open Archive"
        },
        {
          image: "assets/images/boardroom.jpg",
          url: "archive.html",
          linkLabel: "Open Archive"
        }
      ];

      window.setup21DevScrollGallery("#kn-scroll-gallery", authenticArchivalSlides, {
        linkLabel: "Archival Record"
      });
    }
  });
})();
