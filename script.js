(function () {
  const slides = document.querySelectorAll(".slide");
  const total = slides.length;
  let current = 0;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const tapPrev = document.getElementById("tapPrev");
  const tapNext = document.getElementById("tapNext");
  const progressBar = document.getElementById("progressBar");
  const slideCounter = document.getElementById("slideCounter");
  const slideName = document.getElementById("slideName");
  const thumbs = document.querySelectorAll(".thumb[data-goto]");
  const presentBtn = document.getElementById("presentBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const helpBtn = document.getElementById("helpBtn");
  const helpDialog = document.getElementById("helpDialog");
  const closeHelp = document.getElementById("closeHelp");

  function getLabel(i) {
    return slides[i].dataset.label || `Slide ${i + 1}`;
  }

  function updateUI() {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === current);
    });

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    const pct = ((current + 1) / total) * 100;
    progressBar.style.width = `${pct}%`;
    progressBar.setAttribute("aria-valuenow", String(current + 1));

    slideCounter.textContent = `Slide ${current + 1} of ${total}`;
    slideName.textContent = getLabel(current);

    history.replaceState(null, "", `#slide-${current + 1}`);
  }

  function goTo(index) {
    if (index < 0 || index >= total || index === current) return;
    current = index;
    updateUI();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startPresent() {
    document.body.classList.add("is-presenting");
    enterFullscreen();
  }

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(function () {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  function exitPresent() {
    document.body.classList.remove("is-presenting");
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);
  tapPrev.addEventListener("click", prev);
  tapNext.addEventListener("click", next);

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      goTo(parseInt(thumb.dataset.goto, 10));
    });
  });

  presentBtn.addEventListener("click", startPresent);
  fullscreenBtn.addEventListener("click", enterFullscreen);

  helpBtn.addEventListener("click", function () {
    helpDialog.showModal();
  });

  closeHelp.addEventListener("click", function () {
    helpDialog.close();
  });

  helpDialog.addEventListener("click", function (e) {
    if (e.target === helpDialog) helpDialog.close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      goTo(0);
    } else if (e.key === "End") {
      goTo(total - 1);
    } else if (e.key === "f" || e.key === "F") {
      if (!e.ctrlKey && !e.metaKey) enterFullscreen();
    } else if (e.key === "Escape") {
      exitPresent();
    }
  });

  document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      document.body.classList.remove("is-presenting");
    }
  });

  var touchStartX = 0;
  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) {
        diff > 0 ? next() : prev();
      }
    },
    { passive: true }
  );

  var hash = location.hash.match(/slide-(\d+)/);
  if (hash) {
    var n = parseInt(hash[1], 10) - 1;
    if (n >= 0 && n < total) current = n;
  }

  updateUI();
})();
