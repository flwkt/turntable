export default class Turntable {
  private turntableElements: HTMLDivElement[] = [];

  private getImageSize(divElement: HTMLDivElement): number {
    let width = divElement.offsetWidth;

    // get nearest (ceil) power of 2
    let size = 2;
    while ((width >>= 1)) {
      size <<= 1;
    }
    return size;
  }

  private createStyleElement(): void {
    // Check if style element already exists
    const existingStyle = document.head.querySelector('style');
    if (existingStyle?.textContent?.includes('.flwkt-turntable')) {
      return;
    }
    // Add required CSS
    const styleElement = Object.assign(document.createElement('style'), {
      textContent: `
      .flwkt-turntable { margin: 0; }
      .flwkt-turntable ul { padding: 0; margin: 0; }
      .flwkt-turntable ul li { list-style: none; display: none; }
      .flwkt-turntable ul li img { width: 100%; }
      .flwkt-turntable ul li.active { display: block; }
    `,
    });
    document.head.appendChild(styleElement);
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private addInteraction(divElement: HTMLDivElement): void {
    const imageCount: number = divElement.querySelectorAll('li').length;

    // Add interaction handlers
    const handleInteraction = (x: number): void => {
      const rect: DOMRect = divElement.getBoundingClientRect();
      const percent: number = (x - rect.left) / rect.width;
      const index: number = Math.floor((1 - percent) * imageCount);
      if (index >= 0 && index < imageCount) {
        this.updateActiveImage(divElement, index);
      }
    };
    if (this.isMobile()) {
      divElement.addEventListener('touchmove', (e: TouchEvent) =>
        handleInteraction(e.touches[0].clientX)
      );
    } else {
      divElement.addEventListener('mousemove', (e: MouseEvent) =>
        handleInteraction(e.clientX)
      );
    }
  }

  private updateActiveImage(divElement: HTMLElement, index: number): void {
    const images: NodeListOf<HTMLLIElement> = divElement.querySelectorAll('li');
    images.forEach((img: HTMLLIElement) => img.classList.remove('active'));
    images[index]?.classList.add('active');
  }

  private createImages(
    divElement: HTMLDivElement,
    imageCount: number,
    angleStep: number,
    file: string
  ): void {
    const ul: HTMLUListElement = divElement.appendChild(
      document.createElement('ul')
    );
    for (let i: number = 0; i < imageCount; i++) {
      const li: HTMLLIElement = ul.appendChild(document.createElement('li'));
      if (i === Math.floor(imageCount / 2)) li.classList.add('active');

      const size: number = this.getImageSize(divElement);
      const angle: number = -180 + i * angleStep;
      const url: string = `https://www.flowkit.app/s/demo/r/rh:${angle},rv:15,s:${size}/u/${encodeURIComponent(
        file
      )}`;

      const img: HTMLImageElement = li.appendChild(
        document.createElement('img')
      );
      const lazy = divElement.getAttribute('data-turntable-lazy');
      if (lazy) {
        img.loading = 'lazy';
      }
      img.src = url;
    }
  }

  private init(divElement: HTMLDivElement): void {
    // Check if divElement already has a ul element
    if (divElement.querySelector('ul')) return;

    this.createStyleElement();

    const file: string | null = divElement.getAttribute('data-turntable-file');
    if (!file) return;

    const settingCount: string | null = divElement.getAttribute(
      'data-turntable-count'
    );
    const settingStep: string | null = divElement.getAttribute(
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

    // Setup divElement
    divElement.classList.add('flwkt-turntable');
    if (!divElement.style.height) {
      divElement.style.height = `${divElement.clientWidth}px`;
    }

    // Create images
    this.createImages(divElement, imageCount, angleStep, file);

    // Add interaction
    this.addInteraction(divElement);

    // Scroll events
    const scroll = divElement.getAttribute('data-turntable-scroll');
    if (scroll) {
      window.addEventListener('scroll', (): void => {
        console.log(divElement.getAttribute('data-turntable-file'));
        const rect: DOMRect = divElement.getBoundingClientRect();
        const viewportHeight: number = window.innerHeight;

        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const progress: number =
          (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const degrees: number = Math.max(0, Math.min(360, progress * 360));
        const imageIndex: number =
          Math.floor((degrees / 360) * imageCount) % imageCount;

        this.updateActiveImage(divElement, imageIndex);
      });
    }
  }

  public initAll(): void {
    const divElements: NodeListOf<HTMLDivElement> =
      document.querySelectorAll<HTMLDivElement>('[data-turntable-file]');
    if (!divElements.length) return;

    divElements.forEach((divElement: HTMLDivElement) => {
      this.init(divElement);
    });
  }
}

if ((window as any) && !(window as any).Turntable) {
  (window as any).Turntable = new Turntable();
}