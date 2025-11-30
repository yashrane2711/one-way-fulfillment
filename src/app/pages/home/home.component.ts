import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

declare const gsap: any;
declare const ScrollTrigger: any;
declare const Typed: any;
declare const THREE: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  // THREE.js
  private scene: any;
  private camera: any;
  private renderer: any;
  private boxes: any[] = [];
  private fallingBoxes: any[] = [];
  private animationFrameId: any;
  private isAnimating = false;

  // Carousel
  private carouselCards: HTMLElement[] = [];
  private currentCarouselIndex = 0;
  private carouselAutoRotate: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.initAllAnimations(), 300);
  }

  scrollToServices(): void {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ========================================
  // MASTER INIT
  // ========================================
  private initAllAnimations(): void {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.initHeroAnimations();     // Hero h1/p/buttons fade-in
    this.initFallingBoxes();       // THREE.js realistic falling boxes
    this.initFloatingBoxes();      // GSAP floating neon boxes
    this.initTypedText();          // Typed.js typewriter effect
    this.initStatsAnimation();     // GSAP stats counter
    this.initServicesAnimation();  // GSAP service cards
    this.initServicesHeading();    // Services header
    this.initCarousel();           // 3D-style carousel (if present)
    this.initSmoothScroll();       // Smooth anchor scrolling
    this.initMobileMenu();         // Mobile nav toggle (if present)
    this.initQuoteInteractions();  // Quote trigger + form + quote-page
  }

  // ========================================
  // HERO ANIMATIONS
  // ========================================
  private initHeroAnimations(): void {
    const heroTitle = document.querySelector('.hero h1');
    const heroText = document.querySelector('.hero p');
    const heroButtons = document.querySelector('.hero-buttons');

    if (heroTitle) {
      gsap.to(heroTitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      });
    }

    if (heroText) {
      gsap.to(heroText, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out'
      });
    }

    if (heroButtons) {
      gsap.to(heroButtons, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.1,
        ease: 'power3.out'
      });
    }
  }

  // ========================================
  // THREE.JS - REALISTIC FALLING BOXES
  // ========================================
  private initFallingBoxes(): void {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') {
      console.warn('Three.js not loaded or canvas-container not found');
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(this.renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(3, 5, 2);
    this.scene.add(directional);

    // ---------- Realistic falling boxes (25) ----------
    for (let i = 0; i < 25; i++) {
      const boxGroup = this.createRealisticBox();

      boxGroup.position.x = (Math.random() - 0.5) * 20;
      boxGroup.position.y = Math.random() * 30 + 10;
      boxGroup.position.z = (Math.random() - 0.5) * 20;

      boxGroup.rotation.x = Math.random() * Math.PI;
      boxGroup.rotation.y = Math.random() * Math.PI;
      boxGroup.rotation.z = Math.random() * Math.PI;

      boxGroup.userData.fallSpeed = Math.random() * 0.008 + 0.005;
      boxGroup.userData.rotationSpeedX = (Math.random() - 0.5) * 0.01;
      boxGroup.userData.rotationSpeedY = (Math.random() - 0.5) * 0.01;
      boxGroup.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.008;
      boxGroup.userData.swingAmplitude = Math.random() * 0.5 + 0.3;
      boxGroup.userData.swingSpeed = Math.random() * 0.02 + 0.01;
      boxGroup.userData.swingOffset = Math.random() * Math.PI * 2;

      this.scene.add(boxGroup);
      this.boxes.push(boxGroup);
      this.fallingBoxes.push(boxGroup);
    }

    // ---------- Medium shipping boxes (20) ----------
    const mediumGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    for (let i = 0; i < 2; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
        wireframe: true
      });

      const box = new THREE.Mesh(mediumGeometry, material);

      box.position.x = (Math.random() - 0.5) * 20;
      box.position.y = (Math.random() - 0.5) * 20;
      box.position.z = (Math.random() - 0.5) * 20;

      box.rotation.x = Math.random() * Math.PI;
      box.rotation.y = Math.random() * Math.PI;

      this.scene.add(box);
      this.boxes.push(box);
    }

    // ---------- Small packages (15) ----------
    const smallGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    for (let i = 0; i < 15; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });

      const smallBox = new THREE.Mesh(smallGeometry, material);

      smallBox.position.x = (Math.random() - 0.5) * 20;
      smallBox.position.y = (Math.random() - 0.5) * 20;
      smallBox.position.z = (Math.random() - 0.5) * 20;

      smallBox.rotation.x = Math.random() * Math.PI;
      smallBox.rotation.y = Math.random() * Math.PI;

      this.scene.add(smallBox);
      this.boxes.push(smallBox);
    }

    // Start animation
    this.isAnimating = true;
    this.animate();

    // Resize handler
    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private createRealisticBox(): any {
    const boxGroup = new THREE.Group();

    // Main box geometry
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);

    // Cardboard texture colors (each face different)
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x9b7653, wireframe: false }), // Right
      new THREE.MeshBasicMaterial({ color: 0x7a5c3f, wireframe: false }), // Left
      new THREE.MeshBasicMaterial({ color: 0xa68058, wireframe: false }), // Top
      new THREE.MeshBasicMaterial({ color: 0x6b4d32, wireframe: false }), // Bottom
      new THREE.MeshBasicMaterial({ color: 0x8b6f47, wireframe: false }), // Front
      new THREE.MeshBasicMaterial({ color: 0x7d6341, wireframe: false })  // Back
    ];

    const box = new THREE.Mesh(boxGeometry, materials);
    boxGroup.add(box);

    // Tape lines
    const tapeGeometry = new THREE.BoxGeometry(0.82, 0.05, 0.05);
    const tapeMaterial = new THREE.MeshBasicMaterial({ color: 0xd4a574 });

    const tape1 = new THREE.Mesh(tapeGeometry, tapeMaterial);
    tape1.rotation.z = Math.PI / 2;
    boxGroup.add(tape1);

    const tape2 = new THREE.Mesh(tapeGeometry, tapeMaterial);
    boxGroup.add(tape2);

    // Edge highlights
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x5a4a3a, linewidth: 2 });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    boxGroup.add(edges);

    // Shipping label
    const labelGeometry = new THREE.PlaneGeometry(0.4, 0.25);
    const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.z = 0.41;
    boxGroup.add(label);

    // Barcode
    const barcodeGeometry = new THREE.PlaneGeometry(0.3, 0.08);
    const barcodeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const barcode = new THREE.Mesh(barcodeGeometry, barcodeMaterial);
    barcode.position.z = 0.42;
    barcode.position.y = -0.05;
    boxGroup.add(barcode);

    return boxGroup;
  }

  private animate = (): void => {
    if (!this.isAnimating) return;

    this.animationFrameId = requestAnimationFrame(this.animate);
    const time = Date.now() * 0.001;

    // Falling boxes
    this.fallingBoxes.forEach((boxGroup: any) => {
      const data = boxGroup.userData || {};
      const fallSpeed = data.fallSpeed ?? 0.005;
      const rotationSpeedX = data.rotationSpeedX ?? 0;
      const rotationSpeedY = data.rotationSpeedY ?? 0;
      const rotationSpeedZ = data.rotationSpeedZ ?? 0;
      const swingAmplitude = data.swingAmplitude ?? 0.5;
      const swingSpeed = data.swingSpeed ?? 0.02;
      const swingOffset = data.swingOffset ?? 0;

      // Fall + gravity
      boxGroup.position.y -= data.fallSpeed;
      data.fallSpeed += 0.0001;

      // Rotation
      boxGroup.rotation.x += rotationSpeedX;
      boxGroup.rotation.y += rotationSpeedY;
      boxGroup.rotation.z += rotationSpeedZ;

      // Swinging
      boxGroup.position.x +=
        Math.sin(time * swingSpeed + swingOffset) * swingAmplitude * 0.01;

      // Z wobble
      boxGroup.position.z +=
        Math.cos(time * swingSpeed * 0.7 + swingOffset) * 0.005;

      // Reset below view
      if (boxGroup.position.y < -10) {
        boxGroup.position.y = Math.random() * 10 + 20;
        boxGroup.position.x = (Math.random() - 0.5) * 20;
        boxGroup.position.z = (Math.random() - 0.5) * 20;

        data.fallSpeed = Math.random() * 0.008 + 0.005;
        data.rotationSpeedX = (Math.random() - 0.5) * 0.025;
        data.rotationSpeedY = (Math.random() - 0.5) * 0.025;
        data.rotationSpeedZ = (Math.random() - 0.5) * 0.015;
      }
    });

    // Slow rotation for non-falling boxes
    this.boxes.forEach(box => {
      if (!this.fallingBoxes.includes(box)) {
        box.rotation.x += 0.001;
        box.rotation.y += 0.002;
      }
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private onWindowResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ========================================
  // GSAP - FLOATING NEON BOXES
  // ========================================
  private initFloatingBoxes(): void {
    const boxes = document.querySelectorAll('.floating-box');
    boxes.forEach((box: any, index: number) => {
      gsap.to(box, {
        y: -50,
        x: index === 0 ? -30 : index === 1 ? 30 : -15,
        rotation: 360,
        duration: 8 + index * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  // ========================================
  // TYPED.JS
  // ========================================
  private initTypedText(): void {
    if (typeof Typed === 'undefined') return;

    const typedText = document.querySelector('#typed-text');
    const typedSubheading = document.querySelector('#typed-subheading');

    if (typedText) {
      new Typed(typedText, {
        strings: [
          'Fulfillment Excellence',
          'Reliable Warehouse Solutions',
          'Amazon Prime-Like Experience',
          'Growing Your Business'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }

    if (typedSubheading) {
      new Typed(typedSubheading, {
        strings: [
          'Fewer mistakes, happier customers, guaranteed. We provide an "Amazon Prime" like experience with flexible and agile solutions that let you focus on what matters most.'
        ],
        typeSpeed: 20,
        showCursor: false
      });
    }
  }

  // ========================================
  // GSAP - STATS COUNTER
  // ========================================
  private initStatsAnimation(): void {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((el: any) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      gsap.fromTo(
        el,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { innerText: target > 100 ? 1 : 0.1 },
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true
          },
          onUpdate: () => {
            const value = parseFloat(el.innerText);
            el.innerText = target > 100 ? Math.round(value) : value.toFixed(1);
          }
        }
      );
    });
  }

  // ========================================
  // GSAP - SERVICES
  // ========================================
  private initServicesHeading(): void {
    const header = document.querySelector('.services-section .section-header h2');
    if (!header) return;

    gsap.fromTo(
      header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.services-section',
          start: 'top 70%',
          once: true
        }
      }
    );
  }

  private initServicesAnimation(): void {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card: any, index: number) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true
          }
        }
      );
    });
  }

  // ========================================
  // CAROUSEL (optional)
  // ========================================
  private initCarousel(): void {
    const container = document.querySelector('.carousel-container') as HTMLElement | null;
    if (!container) return;

    const cards = container.querySelectorAll('.service-card') as NodeListOf<HTMLElement>;
    if (!cards.length) return;

    this.carouselCards = Array.from(cards);
    this.currentCarouselIndex = 0;

    const indicatorsContainer = document.getElementById('indicators');
    if (indicatorsContainer) {
      indicatorsContainer.innerHTML = '';
      this.carouselCards.forEach((_, i) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => this.goToSlide(i));
        indicatorsContainer.appendChild(indicator);
      });
    }

    this.updateCarousel();

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevSlide());
    }

    this.carouselAutoRotate = setInterval(() => this.nextSlide(), 2500);

    container.addEventListener('mouseenter', () => {
      if (this.carouselAutoRotate) clearInterval(this.carouselAutoRotate);
    });

    container.addEventListener('mouseleave', () => {
      this.carouselAutoRotate = setInterval(() => this.nextSlide(), 2500);
    });
  }

  private updateCarousel(): void {
    const totalCards = this.carouselCards.length;
    if (!totalCards) return;

    this.carouselCards.forEach((card, index) => {
      const diff = index - this.currentCarouselIndex;
      const absIndex = ((index - this.currentCarouselIndex) + totalCards) % totalCards;

      let translateX = 0;
      let translateZ = -300;
      let rotateY = 0;
      let opacity = 0.3;
      let scale = 0.7;

      card.classList.remove('active');

      if (absIndex === 0) {
        translateX = 0;
        translateZ = 0;
        rotateY = 0;
        opacity = 1;
        scale = 1;
        card.classList.add('active');
      } else if (absIndex === 1) {
        translateX = 450;
        translateZ = -200;
        rotateY = -45;
        opacity = 0.6;
        scale = 0.85;
      } else if (absIndex === totalCards - 1) {
        translateX = -450;
        translateZ = -200;
        rotateY = 45;
        opacity = 0.6;
        scale = 0.85;
      } else {
        translateX = diff > 0 ? 800 : -800;
        translateZ = -400;
        rotateY = diff > 0 ? -60 : 60;
        opacity = 0;
        scale = 0.5;
      }

      card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = absIndex === 0 ? '10' : String(5 - absIndex);
    });

    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((ind, index) => {
      ind.classList.toggle('active', index === this.currentCarouselIndex);
    });
  }

  private nextSlide(): void {
    if (!this.carouselCards.length) return;
    this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselCards.length;
    this.updateCarousel();
  }

  private prevSlide(): void {
    if (!this.carouselCards.length) return;
    this.currentCarouselIndex =
      (this.currentCarouselIndex - 1 + this.carouselCards.length) % this.carouselCards.length;
    this.updateCarousel();
  }

  private goToSlide(index: number): void {
    if (!this.carouselCards.length) return;
    this.currentCarouselIndex = index;
    this.updateCarousel();
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  private initSmoothScroll(): void {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e: Event) => {
        const href = (anchor as HTMLAnchorElement).getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // ========================================
  // MOBILE MENU
  // ========================================
  private initMobileMenu(): void {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ========================================
  // QUOTE PAGE / FORM
  // ========================================
  private initQuoteInteractions(): void {
    const quoteTrigger = document.getElementById('quote-trigger');
    const quotePage = document.getElementById('quote-page');
    const quoteForm = document.getElementById('quoteForm') as HTMLFormElement | null;

    // Quote page fade-in
    if (quotePage && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to('.quote-page', {
        opacity: 1,
        scrollTrigger: {
          trigger: '.quote-page',
          start: 'top 70%'
        }
      });
    }

    // Quote button
    if (quoteTrigger) {
      quoteTrigger.addEventListener('click', (e: Event) => {
        e.preventDefault();

        if (quotePage) {
          quotePage.scrollIntoView({ behavior: 'smooth' });
        }

        // Burst of extra boxes
        if (this.scene && typeof THREE !== 'undefined') {
          for (let i = 0; i < 15; i++) {
            const boxGroup = this.createRealisticBox();

            boxGroup.position.x = (Math.random() - 0.5) * 15;
            boxGroup.position.y = 15 + Math.random() * 10;
            boxGroup.position.z = (Math.random() - 0.5) * 15;

            boxGroup.rotation.x = Math.random() * Math.PI;
            boxGroup.rotation.y = Math.random() * Math.PI;

            boxGroup.userData.fallSpeed = Math.random() * 0.01 + 0.008;
            boxGroup.userData.rotationSpeedX = (Math.random() - 0.5) * 0.015;
            boxGroup.userData.rotationSpeedY = (Math.random() - 0.5) * 0.015;
            boxGroup.userData.rotationSpeedZ = (Math.random() - 0.5) * 0.012;
            boxGroup.userData.swingAmplitude = Math.random() * 0.8 + 0.5;
            boxGroup.userData.swingSpeed = Math.random() * 0.03 + 0.02;
            boxGroup.userData.swingOffset = Math.random() * Math.PI * 2;

            this.scene.add(boxGroup);
            this.boxes.push(boxGroup);
            this.fallingBoxes.push(boxGroup);

            setTimeout(() => {
              if (this.scene && this.boxes.includes(boxGroup)) {
                this.scene.remove(boxGroup);
                this.boxes = this.boxes.filter(b => b !== boxGroup);
                this.fallingBoxes = this.fallingBoxes.filter(b => b !== boxGroup);
              }
            }, 5000);
          }
        }
      });
    }

    // Quote form
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        const fullName =
          (document.getElementById('fullName') as HTMLInputElement | null)?.value || '';
        const email =
          (document.getElementById('emailAddress') as HTMLInputElement | null)?.value || '';
        const phone =
          (document.getElementById('phoneNumber') as HTMLInputElement | null)?.value || '';
        const company =
          (document.getElementById('company') as HTMLInputElement | null)?.value || '';
        const numProducts =
          (document.getElementById('numProducts') as HTMLInputElement | null)?.value || '';
        const message =
          (document.getElementById('message') as HTMLTextAreaElement | null)?.value || '';

        const formData = { fullName, email, phone, company, numProducts, message };
        console.log('Quote form submitted:', formData);

        alert('Thank you for your quote request! Our team will contact you within 24 hours.');

        quoteForm.reset();
      });
    }
  }

  // ========================================
  // CLEANUP
  // ========================================
  private cleanup(): void {
    this.isAnimating = false;

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.carouselAutoRotate) clearInterval(this.carouselAutoRotate);

    if (this.renderer) {
      if (this.renderer.domElement?.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }

    this.boxes = [];
    this.fallingBoxes = [];
    this.scene = null;
    this.camera = null;
    this.renderer = null;
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
