/// <reference lib="dom" />

const updateActiveImage = (container: HTMLElement, index: number) => {
  const images = container.querySelectorAll('li');
  images.forEach((img) => img.classList.remove('active'));
  images[index]?.classList.add('active');
};

const initTurntable = () => {
  const containers = document.querySelectorAll<HTMLDivElement>(
    '[data-turntable-file]'
  );
  if (!containers.length) return;

  // Add required CSS
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      textContent: `
      .turntable { margin: 0; }
      .turntable ul { padding: 0; margin: 0; }
      .turntable ul li { list-style: none; display: none; }
      .turntable ul li img { width: 100%; }
      .turntable ul li.active { display: block; }
    `,
    })
  );

  containers.forEach((container) => {
    const file = container.getAttribute('data-turntable-file');
    if (!file) return;

    const settingCount = container.getAttribute('data-turntable-count');
    const settingStep = container.getAttribute('data-turntable-step');

    const imageCount = settingCount || 10; // default is 10 images
    const angleStep = settingStep || 360 / imageCount;

    // Setup container
    container.classList.add('turntable');
    if (!container.style.height) {
      container.style.height = `${container.clientWidth}px`;
    }

    // Create images
    const ul = container.appendChild(document.createElement('ul'));
    for (let i = 0; i < imageCount; i++) {
      const li = ul.appendChild(document.createElement('li'));
      if (i === Math.floor(imageCount / 2)) li.classList.add('active');

      const angle = -180 + i * angleStep;
      const url = `https://www.flowkit.app/s/demo/r/rh:${angle},rv:15,s:256/u/${encodeURIComponent(
        file
      )}`;

      const img = li.appendChild(document.createElement('img'));
      const lazy = container.getAttribute('data-turntable-lazy');
      if (lazy) {
        img.loading = 'lazy';
      }
      img.src = url;
    }

    // Add interaction handlers
    const handleInteraction = (x: number) => {
      const rect = container.getBoundingClientRect();
      const percent = (x - rect.left) / rect.width;
      const index = Math.floor((1 - percent) * imageCount);
      if (index >= 0 && index < imageCount) {
        updateActiveImage(container, index);
      }
    };

    // Mouse/touch events
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      container.addEventListener('touchmove', (e) =>
        handleInteraction(e.touches[0].clientX)
      );
    } else {
      container.addEventListener('mousemove', (e) =>
        handleInteraction(e.clientX)
      );
    }

    // Scroll events
    const scroll = container.getAttribute('data-turntable-scroll');
    if (scroll) {
      window.addEventListener('scroll', () => {
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const progress =
          (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const degrees = Math.max(0, Math.min(360, progress * 360));
        const imageIndex =
          Math.floor((degrees / 360) * imageCount) % imageCount;

        updateActiveImage(container, imageIndex);
      });
    }
  });
};

initTurntable();
