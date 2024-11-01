const updateActiveImage = (container: HTMLElement, index: number): void => {
  const images: NodeListOf<HTMLLIElement> = container.querySelectorAll('li');
  images.forEach((img: HTMLLIElement) => img.classList.remove('active'));
  images[index]?.classList.add('active');
};

const initTurntable = (): void => {
  const containers: NodeListOf<HTMLDivElement> =
    document.querySelectorAll<HTMLDivElement>('[data-turntable-file]');
  if (!containers.length) return;

  // Add required CSS
  const style: HTMLStyleElement = Object.assign(
    document.createElement('style'),
    {
      textContent: `
      .turntable { margin: 0; }
      .turntable ul { padding: 0; margin: 0; }
      .turntable ul li { list-style: none; display: none; }
      .turntable ul li img { width: 100%; }
      .turntable ul li.active { display: block; }
    `,
    }
  );
  document.head.appendChild(style);

  containers.forEach((container: HTMLDivElement) => {
    const file: string | null = container.getAttribute('data-turntable-file');
    if (!file) return;

    const settingCount: string | null = container.getAttribute(
      'data-turntable-count'
    );
    const settingStep: string | null = container.getAttribute(
      'data-turntable-step'
    );

    let imageCount: number = 10;
    let angleStep: number = 360 / imageCount;
    if (settingCount && !settingStep) {
      imageCount = parseInt(settingCount);
      angleStep = 360 / imageCount;
    } else if (settingStep && !settingCount) {
      angleStep = parseInt(settingStep);
      imageCount = 360 / angleStep;
    }

    // Setup container
    container.classList.add('turntable');
    if (!container.style.height) {
      container.style.height = `${container.clientWidth}px`;
    }

    // Create images
    const ul: HTMLUListElement = container.appendChild(
      document.createElement('ul')
    );
    for (let i: number = 0; i < imageCount; i++) {
      const li: HTMLLIElement = ul.appendChild(document.createElement('li'));
      if (i === Math.floor(imageCount / 2)) li.classList.add('active');

      const angle: number = -180 + i * angleStep;
      const url: string = `https://www.flowkit.app/s/demo/r/rh:${angle},rv:15,s:256/u/${encodeURIComponent(
        file
      )}`;

      const img: HTMLImageElement = li.appendChild(
        document.createElement('img')
      );
      const lazy = container.getAttribute('data-turntable-lazy');
      if (lazy) {
        img.loading = 'lazy';
      }
      img.src = url;
    }

    // Add interaction handlers
    const handleInteraction = (x: number): void => {
      const rect: DOMRect = container.getBoundingClientRect();
      const percent: number = (x - rect.left) / rect.width;
      const index: number = Math.floor((1 - percent) * imageCount);
      if (index >= 0 && index < imageCount) {
        updateActiveImage(container, index);
      }
    };

    // Mouse/touch events
    const isMobile: boolean =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      container.addEventListener('touchmove', (e: TouchEvent) =>
        handleInteraction(e.touches[0].clientX)
      );
    } else {
      container.addEventListener('mousemove', (e: MouseEvent) =>
        handleInteraction(e.clientX)
      );
    }

    // Scroll events
    const scroll = container.getAttribute('data-turntable-scroll');
    if (scroll) {
      window.addEventListener('scroll', (): void => {
        const rect: DOMRect = container.getBoundingClientRect();
        const viewportHeight: number = window.innerHeight;

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const progress: number =
          (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const degrees: number = Math.max(0, Math.min(360, progress * 360));
        const imageIndex: number =
          Math.floor((degrees / 360) * imageCount) % imageCount;

        updateActiveImage(container, imageIndex);
      });
    }
  });
};

initTurntable();
