let currentMode = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  window.addEventListener('resize', handleModeChange);
});

function getMode() {
  return window.matchMedia('(max-width: 899px)').matches ? 'mobile' : 'desktop';
}

function initApp() {
  currentMode = getMode();

  if (currentMode === 'mobile') {
    initMobile();
  } else {
    initDesktop();
  }
}

function handleModeChange() {
  const nextMode = getMode();

  if (nextMode !== currentMode) {
    window.location.reload();
  }
}

/* ---------------------------------
   Mobile
---------------------------------- */

function initMobile() {
  const mobileStory = document.querySelector('.mobile-story');
  const chapters = Array.from(
    document.querySelectorAll('.mobile-home, .mobile-toc, .mobile-chapter, .mobile-text-page')
  );

  const mobileHeader = document.querySelector('.mobile-reading-header');
  const headerChapter = document.querySelector('.mobile-reading-header__chapter');
  const headerTitle = document.querySelector('.mobile-reading-header__title');
  const headerBar = document.querySelector('.mobile-reading-header__bar');

  const mobileCue = document.querySelector('.mobile-home-cue');
  const mobileCueButton = document.querySelector('.mobile-home-cue__dot');

  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavToggle = document.querySelector('.mobile-nav__toggle');
  const mobileNavItems = Array.from(
    document.querySelectorAll('.mobile-nav__item[data-target]')
  );

  const mobileFootnote = document.getElementById('mobileFootnote');
  const mobileFootnoteClose = document.querySelector('.mobile-footnote__close');
  const mobileFootnoteItems = Array.from(
    document.querySelectorAll('.mobile-footnote__item[data-note]')
  );
  const mobileFootnoteTriggers = Array.from(
    document.querySelectorAll('.fn-trigger-mobile[data-note]')
  );

  if (
    !mobileStory ||
    !chapters.length ||
    !mobileHeader ||
    !headerChapter ||
    !headerTitle ||
    !headerBar
  ) {
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getActiveMobileSection() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.35;
    let activeChapter = chapters[0];

    chapters.forEach((chapter) => {
      const top = chapter.offsetTop;
      if (viewportCenter >= top) {
        activeChapter = chapter;
      }
    });

    return activeChapter;
  }

  function updateMobileNavCurrent() {
    if (!mobileNavItems.length) return;

    const activeSection = getActiveMobileSection();
    const currentId = activeSection.id;

    mobileNavItems.forEach((item) => {
      item.classList.toggle('is-current', item.dataset.target === currentId);
    });

      const mobileTocItems = Array.from(
    document.querySelectorAll('.mobile-toc__item[data-target]')
  );

  

  mobileTocItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = item.dataset.target;
      const targetEl = document.getElementById(targetId);

      if (!targetEl) return;

      const targetHeader = targetEl.querySelector('.mobile-chapter-header');
      const scrollTarget = targetHeader || targetEl;

      const headerOffset = 70;
      const targetTop =
        scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      clearMobileFootnote();
    });
  });
  }

  

  function clearMobileFootnote() {
    if (mobileFootnote) {
      mobileFootnote.classList.remove('is-visible');
    }

    mobileFootnoteItems.forEach((item) => {
      item.classList.remove('is-visible');
    });

    mobileFootnoteTriggers.forEach((trigger) => {
      trigger.classList.remove('is-active');
    });
  }

  function showMobileFootnote(noteId) {
    if (!mobileFootnote) return;

    mobileFootnoteItems.forEach((item) => {
      item.classList.toggle('is-visible', item.dataset.note === noteId);
    });

    mobileFootnoteTriggers.forEach((trigger) => {
      trigger.classList.toggle('is-active', trigger.dataset.note === noteId);
    });

    mobileFootnote.classList.add('is-visible');
  }

  function updateMobileReadingHeader() {
    const viewportCenter = window.scrollY + window.innerHeight * 0.35;
    let activeChapter = chapters[0];

    chapters.forEach((chapter) => {
      const top = chapter.offsetTop;
      if (viewportCenter >= top) {
        activeChapter = chapter;
      }
    });

    const hideHeader =
      activeChapter.classList.contains('mobile-home') ||
      activeChapter.classList.contains('mobile-toc');

    if (hideHeader) {
      mobileHeader.style.opacity = '0';
      mobileHeader.style.pointerEvents = 'none';
      updateMobileNavCurrent();
      return;
    }

    mobileHeader.style.opacity = '1';
    mobileHeader.style.pointerEvents = 'none';

    headerChapter.textContent = activeChapter.dataset.chapter || '';
    headerTitle.textContent = activeChapter.dataset.title || '';

    const chapterTop = activeChapter.offsetTop;
    const chapterHeight = activeChapter.offsetHeight;

    const rawProgress = (viewportCenter - chapterTop) / chapterHeight;
    const progress = clamp(rawProgress, 0, 1);

    headerBar.style.width = `${progress * 100}%`;

    updateMobileNavCurrent();
  }

  updateMobileReadingHeader();

  window.addEventListener('scroll', updateMobileReadingHeader, { passive: true });
  window.addEventListener('resize', updateMobileReadingHeader);

  if (mobileCue && mobileCueButton) {
    mobileCueButton.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileCue.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!mobileCue.contains(e.target)) {
        mobileCue.classList.remove('is-open');
      }
    });
  }

  if (mobileNav && mobileNavToggle) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle('is-open');
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target)) {
        mobileNav.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  mobileNavItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      const targetId = item.dataset.target;
      const targetEl = document.getElementById(targetId);
  
      if (!targetEl) return;
  
      const targetHeader = targetEl.querySelector('.mobile-chapter-header');
      const scrollTarget = targetHeader || targetEl;
  
      const headerOffset = 70; 
      const targetTop =
        scrollTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
  
      clearMobileFootnote();
  
      if (mobileNav) {
        mobileNav.classList.remove('is-open');
      }
  
      if (mobileNavToggle) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  mobileFootnoteTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();

      const noteId = trigger.dataset.note;
      const isAlreadyActive = trigger.classList.contains('is-active');

      if (isAlreadyActive) {
        clearMobileFootnote();
      } else {
        showMobileFootnote(noteId);
      }
    });
  });

  if (mobileFootnoteClose) {
    mobileFootnoteClose.addEventListener('click', (e) => {
      e.stopPropagation();
      clearMobileFootnote();
    });
  }

  document.addEventListener('click', (e) => {
    if (!mobileFootnote) return;

    const clickedTrigger = e.target.closest('.fn-trigger-mobile');
    const clickedInsideFootnote = e.target.closest('.mobile-footnote__inner');

    if (!clickedTrigger && !clickedInsideFootnote) {
      clearMobileFootnote();
    }
  });
}

/* ---------------------------------
   Desktop
---------------------------------- */

function initDesktop() {
  const chapterStack = document.getElementById('chapterStack');
  const chapters = Array.from(document.querySelectorAll('.chapter'));

  const desktopHeader = document.querySelector('.desktop-reading-header');
  const desktopHeaderChapter = document.querySelector('.desktop-reading-header__chapter');
  const desktopHeaderTitle = document.querySelector('.desktop-reading-header__title');
  const desktopHeaderBar = document.querySelector('.desktop-reading-header__bar');

  const desktopNav = document.querySelector('.desktop-nav');
  const desktopNavToggle = document.querySelector('.desktop-nav__toggle');
  const desktopNavItems = Array.from(
    document.querySelectorAll('.desktop-nav__item[data-target]')
  );

  if (
    !chapterStack ||
    chapters.length === 0 ||
    !desktopHeader ||
    !desktopHeaderChapter ||
    !desktopHeaderTitle ||
    !desktopHeaderBar
  ) {
    return;
  }

  let currentChapterIndex = 0;

  let isChapterLocked = false;
  let isTextLocked = false;

  let chapterWheelAccum = 0;
  let textWheelAccum = 0;

  let chapterCooldownUntil = 0;
  let textCooldownUntil = 0;

  let lastChapterDirection = 0;
  let lastTextDirection = 0;

  let edgeArmedDirection = 0;
  let edgeArmedChapterIndex = -1;

  const chapterThreshold = 110;
  const textThreshold = 130;
  const minDelta = 6;
  const frameHeight = 255;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resetChapterAccum() {
    chapterWheelAccum = 0;
  }

  function resetTextAccum() {
    textWheelAccum = 0;
  }

  function resetDirections() {
    lastChapterDirection = 0;
    lastTextDirection = 0;
  }

  function resetEdgeArm() {
    edgeArmedDirection = 0;
    edgeArmedChapterIndex = -1;
  }

  function updateDesktopReadingHeader(chapter, step = 0) {
    const hideHeader =
      chapter.id === 'chapter-home' ||
      chapter.id === 'chapter-toc' ||
      chapter.id === 'chapter-8' ||
      chapter.id === 'chapter-9';
      

    if (hideHeader) {
      desktopHeader.style.opacity = '0';
      desktopHeader.style.pointerEvents = 'none';
      return;
    }

    desktopHeader.style.opacity = '1';
    desktopHeader.style.pointerEvents = 'none';

    const chapterName = chapter.dataset.chapter || '';
    const chapterTitle = chapter.dataset.title || '';

    desktopHeaderChapter.textContent = chapterName;
    desktopHeaderTitle.textContent = chapterTitle;

    const slider = chapter.querySelector('.text-slider');
    const slides = slider ? Array.from(slider.querySelectorAll('.text-slide')) : [];
    const maxStep = Math.max(slides.length - 1, 1);
    const progress = slides.length > 1 ? step / maxStep : 0;

    desktopHeaderBar.style.width = `${progress * 100}%`;
  }

  function updateDesktopNavVisibility() {
    if (!desktopNav) return;

    const currentChapter = chapters[currentChapterIndex];
    const hideNav =
      currentChapter.id === 'chapter-home' ||
      currentChapter.id === 'chapter-toc' ;

    desktopNav.style.opacity = hideNav ? '0' : '1';
    desktopNav.style.pointerEvents = hideNav ? 'none' : 'auto';

    if (hideNav) {
      desktopNav.classList.remove('is-open');
      if (desktopNavToggle) {
        desktopNavToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  function updateDesktopNavCurrent() {
    if (!desktopNavItems.length) return;

    const currentId = chapters[currentChapterIndex].id;

    desktopNavItems.forEach((item) => {
      item.classList.toggle('is-current', item.dataset.target === currentId);
    });
  }

  function goToChapter(index) {
    const safeIndex = clamp(index, 0, chapters.length - 1);

    if (safeIndex === currentChapterIndex) {
      isChapterLocked = false;
      resetChapterAccum();
      resetTextAccum();
      resetEdgeArm();
      return;
    }

    currentChapterIndex = safeIndex;
    isChapterLocked = true;

    resetChapterAccum();
    resetTextAccum();
    resetDirections();
    resetEdgeArm();

    chapterCooldownUntil = Date.now() + 950;
    textCooldownUntil = Date.now() + 950;

    chapterStack.scrollTo({
      top: chapters[safeIndex].offsetTop,
      behavior: 'auto'
    });

    const activeChapter = chapters[safeIndex];
    const activeSlider = activeChapter.querySelector('.text-slider');
    const activeStep = activeSlider ? parseInt(activeSlider.dataset.step || '0', 10) : 0;

    updateDesktopReadingHeader(activeChapter, activeStep);
    updateDesktopNavVisibility();
    updateDesktopNavCurrent();

    clearTimeout(goToChapter.unlockTimer);
    goToChapter.unlockTimer = setTimeout(() => {
      isChapterLocked = false;
      resetChapterAccum();
    }, 950);
  }

  function updateViewerByAnchor(chapter, imageStep) {
    const viewerTrack = chapter.querySelector('.viewer__track');
    const frames = Array.from(chapter.querySelectorAll('.viewer__frame'));
    const viewerCaption = chapter.querySelector('.viewer-caption');
  
    if (!viewerTrack || frames.length === 0) return;
  
    const maxImageStep = frames.length - 1;
    const safeImageStep = clamp(imageStep, 0, maxImageStep);
  
    viewerTrack.style.transform = `translateY(-${safeImageStep * frameHeight}px)`;
  
    const activeFrame = frames[safeImageStep];
    const nextCaption = activeFrame?.dataset.caption || '';
  
    if (viewerCaption) {
      viewerCaption.textContent = nextCaption;
    }
  }

  function updateTextSlider(slider, nextStep, chapter) {
    const track = slider.querySelector('.text-slider__track');
    const slides = Array.from(slider.querySelectorAll('.text-slide'));

    if (!track || slides.length === 0) return;

    const maxStep = slides.length - 1;
    const safeStep = clamp(nextStep, 0, maxStep);

    slider.dataset.step = String(safeStep);
    track.style.transform = `translateX(-${safeStep * 100}%)`;

    const activeSlide = slides[safeStep];
    const imageStep = parseInt(activeSlide.dataset.imageStep || '0', 10);

    updateViewerByAnchor(chapter, imageStep);
    resetEdgeArm();
    updateDesktopReadingHeader(chapter, safeStep);
  }

  function handleChapterWheel(deltaY, chapterIndex) {
    if (Math.abs(deltaY) < minDelta) return;
    if (isChapterLocked) return;
    if (Date.now() < chapterCooldownUntil) return;

    const direction = Math.sign(deltaY);
    if (direction === 0) return;

    if (lastChapterDirection !== 0 && lastChapterDirection !== direction) {
      resetChapterAccum();
    }
    lastChapterDirection = direction;

    chapterWheelAccum += deltaY;

    if (Math.abs(chapterWheelAccum) < chapterThreshold) return;

    resetChapterAccum();
    chapterCooldownUntil = Date.now() + 750;

    if (direction > 0) {
      goToChapter(chapterIndex + 1);
    } else {
      goToChapter(chapterIndex - 1);
    }
  }

  function handleTextWheel(deltaY, slider, chapter, chapterIndex) {
    if (Math.abs(deltaY) < minDelta) return;
    if (isTextLocked || isChapterLocked) return;
    if (Date.now() < textCooldownUntil) return;

    const direction = Math.sign(deltaY);
    if (direction === 0) return;

    if (lastTextDirection !== 0 && lastTextDirection !== direction) {
      resetTextAccum();
      resetEdgeArm();
    }
    lastTextDirection = direction;

    textWheelAccum += deltaY;

    if (Math.abs(textWheelAccum) < textThreshold) return;

    const slides = Array.from(slider.querySelectorAll('.text-slide'));
    const maxStep = slides.length - 1;
    const currentStep = parseInt(slider.dataset.step || '0', 10);

    resetTextAccum();

    if (direction > 0 && currentStep >= maxStep) {
      if (edgeArmedDirection === 1 && edgeArmedChapterIndex === chapterIndex) {
        resetEdgeArm();
        textCooldownUntil = Date.now() + 850;
        goToChapter(chapterIndex + 1);
      } else {
        edgeArmedDirection = 1;
        edgeArmedChapterIndex = chapterIndex;
        textCooldownUntil = Date.now() + 350;
      }
      return;
    }

    if (direction < 0 && currentStep <= 0) {
      if (edgeArmedDirection === -1 && edgeArmedChapterIndex === chapterIndex) {
        resetEdgeArm();
        textCooldownUntil = Date.now() + 850;
        goToChapter(chapterIndex - 1);
      } else {
        edgeArmedDirection = -1;
        edgeArmedChapterIndex = chapterIndex;
        textCooldownUntil = Date.now() + 350;
      }
      return;
    }

    isTextLocked = true;
    textCooldownUntil = Date.now() + 750;

    if (direction > 0) {
      updateTextSlider(slider, currentStep + 1, chapter);
    } else {
      updateTextSlider(slider, currentStep - 1, chapter);
    }

    setTimeout(() => {
      isTextLocked = false;
      resetTextAccum();
    }, 750);
  }

  chapters.forEach((chapter, chapterIndex) => {
    const leftPage = chapter.querySelector('.page--left');
    const rightPage = chapter.querySelector('.page--right');
    const slider = chapter.querySelector('.text-slider');

    const isHomeLikeChapter =
      chapter.classList.contains('chapter--home') ||
      chapter.classList.contains('chapter--toc');

    if (slider) {
      slider.dataset.step = '0';
      updateTextSlider(slider, 0, chapter);

      document.querySelectorAll('.footnote-item').forEach((note) => note.classList.remove('is-visible'));
      document.querySelectorAll('.fn-trigger').forEach((trigger) => trigger.classList.remove('is-active'));
    }

    if (isHomeLikeChapter) {
      const homeLikeWheelHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (Math.abs(e.deltaY) < minDelta) return;
        if (isChapterLocked) return;
        if (Date.now() < chapterCooldownUntil) return;

        if (e.deltaY > 0) {
          goToChapter(chapterIndex + 1);
        } else if (e.deltaY < 0) {
          goToChapter(chapterIndex - 1);
        }
      };

      if (leftPage) {
        leftPage.addEventListener('wheel', homeLikeWheelHandler, { passive: false });
      }

      if (rightPage) {
        rightPage.addEventListener('wheel', homeLikeWheelHandler, { passive: false });
      }

      return;
    }

    if (leftPage) {
      leftPage.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleChapterWheel(e.deltaY, chapterIndex);
        },
        { passive: false }
      );
    }

    if (rightPage) {
      if (slider) {
        rightPage.addEventListener(
          'wheel',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleTextWheel(e.deltaY, slider, chapter, chapterIndex);
          },
          { passive: false }
        );
      } else {
        rightPage.addEventListener(
          'wheel',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleChapterWheel(e.deltaY, chapterIndex);
          },
          { passive: false }
        );
      }
    }
  });

  const tocLinks = Array.from(document.querySelectorAll('.toc-item[data-target]'));

  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.dataset.target;
      const targetIndex = chapters.findIndex((chapter) => chapter.id === targetId);

      if (targetIndex === -1) return;

      goToChapter(targetIndex);
    });
  });

  const tocViewerImage = document.getElementById('tocViewerImage');
  const tocItems = Array.from(document.querySelectorAll('.toc-item[data-toc-image]'));

  if (tocViewerImage && tocItems.length) {
    const defaultSrc = tocViewerImage.getAttribute('src');

    function setTocViewerImage(src) {
      if (!src) return;
      tocViewerImage.style.opacity = '0';

      window.setTimeout(() => {
        tocViewerImage.setAttribute('src', src);
        tocViewerImage.style.opacity = '1';
      }, 120);
    }

    tocItems.forEach((item) => {
      const nextSrc = item.dataset.tocImage;

      item.addEventListener('mouseenter', () => {
        setTocViewerImage(nextSrc);
      });

      item.addEventListener('focus', () => {
        setTocViewerImage(nextSrc);
      });

      item.addEventListener('mouseleave', () => {
        if (defaultSrc) setTocViewerImage(defaultSrc);
      });

      item.addEventListener('blur', () => {
        if (defaultSrc) setTocViewerImage(defaultSrc);
      });
    });
  }

  if (desktopNav && desktopNavToggle) {
    desktopNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = desktopNav.classList.toggle('is-open');
      desktopNavToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!desktopNav.contains(e.target)) {
        desktopNav.classList.remove('is-open');
        desktopNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  desktopNavItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = item.dataset.target;
      const targetIndex = chapters.findIndex((chapter) => chapter.id === targetId);

      if (targetIndex === -1) return;

      goToChapter(targetIndex);

      if (desktopNav) {
        desktopNav.classList.remove('is-open');
      }

      if (desktopNavToggle) {
        desktopNavToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function initDesktopFootnotes() {
    const triggers = Array.from(document.querySelectorAll('.fn-trigger'));
    const notes = Array.from(document.querySelectorAll('.footnote-item'));

    let pinnedNoteId = null;

    function clearVisibleNotes() {
      notes.forEach((note) => note.classList.remove('is-visible'));
      triggers.forEach((trigger) => trigger.classList.remove('is-active'));
    }

    function showNote(noteId, pin = false) {
      clearVisibleNotes();

      const note = document.querySelector(`.footnote-item[data-note="${noteId}"]`);
      const trigger = document.querySelector(`.fn-trigger[data-note="${noteId}"]`);

      if (note) note.classList.add('is-visible');
      if (trigger) trigger.classList.add('is-active');

      pinnedNoteId = pin ? noteId : null;
    }

    function restorePinnedNote() {
      if (pinnedNoteId) {
        showNote(pinnedNoteId, true);
      } else {
        clearVisibleNotes();
      }
    }

    triggers.forEach((trigger) => {
      const noteId = trigger.dataset.note;
      if (!noteId) return;

      trigger.addEventListener('mouseenter', () => {
        if (pinnedNoteId) return;
        showNote(noteId, false);
      });

      trigger.addEventListener('mouseleave', () => {
        if (pinnedNoteId) return;
        clearVisibleNotes();
      });

      trigger.addEventListener('focus', () => {
        if (pinnedNoteId) return;
        showNote(noteId, false);
      });

      trigger.addEventListener('blur', () => {
        if (pinnedNoteId) return;
        clearVisibleNotes();
      });

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();

        if (pinnedNoteId === noteId) {
          pinnedNoteId = null;
          clearVisibleNotes();
        } else {
          showNote(noteId, true);
        }
      });
    });

    document.addEventListener('click', () => {
      pinnedNoteId = null;
      clearVisibleNotes();
    });
  }

  window.addEventListener('resize', () => {
    chapterStack.scrollTo({
      top: chapters[currentChapterIndex].offsetTop,
      behavior: 'auto'
    });

    const activeChapter = chapters[currentChapterIndex];
    const activeSlider = activeChapter.querySelector('.text-slider');
    const activeStep = activeSlider ? parseInt(activeSlider.dataset.step || '0', 10) : 0;

    updateDesktopReadingHeader(activeChapter, activeStep);
    updateDesktopNavVisibility();
    updateDesktopNavCurrent();
  });

  chapterStack.scrollTo({
    top: chapters[0].offsetTop,
    behavior: 'auto'
  });

  updateDesktopReadingHeader(chapters[0], 0);
  updateDesktopNavVisibility();
  updateDesktopNavCurrent();

  initDesktopFootnotes();
}