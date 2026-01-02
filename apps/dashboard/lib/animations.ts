// Client-side only anime.js wrapper with dynamic imports
import type React from 'react';

const isBrowser = typeof window !== 'undefined';

// Dynamically import anime.js v3 only on client side
let animePromise: Promise<any> | null = null;

const loadAnime = () => {
  if (!animePromise && isBrowser) {
    animePromise = import('animejs').then(mod => mod.default);
  }
  return animePromise;
};

// Fade in animation
export const fadeIn = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay,
      easing: 'easeOutCubic'
    });
  });
};

// Fade in from left
export const fadeInLeft = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      translateX: [-50, 0],
      duration: 800,
      delay,
      easing: 'easeOutCubic'
    });
  });
};

// Fade in from right
export const fadeInRight = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      translateX: [50, 0],
      duration: 800,
      delay,
      easing: 'easeOutCubic'
    });
  });
};

// Scale in animation
export const scaleIn = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
      delay,
      easing: 'easeOutElastic(1, .6)'
    });
  });
};

// Stagger animation for multiple elements
export const staggerFadeIn = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutCubic'
    });
  });
};

// Card hover animation
export const cardHover = (element: HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets: element,
      scale: 1.05,
      translateY: -8,
      duration: 300,
      easing: 'easeOutCubic'
    });
  });
};

// Card hover end animation
export const cardHoverEnd = (element: HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets: element,
      scale: 1,
      translateY: 0,
      duration: 300,
      easing: 'easeOutCubic'
    });
  });
};

// Pulse animation
export const pulse = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      scale: [1, 1.1, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
      loop: true
    });
  });
};

// Rotate animation
export const rotate = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      rotate: '1turn',
      duration: 2000,
      easing: 'linear',
      loop: true
    });
  });
};

// Slide in from bottom
export const slideInBottom = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      translateY: [100, 0],
      duration: 1000,
      delay,
      easing: 'easeOutExpo'
    });
  });
};

// Bounce in
export const bounceIn = (targets: string | HTMLElement, delay = 0) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      opacity: [0, 1],
      scale: [0.3, 1],
      duration: 800,
      delay,
      easing: 'easeOutElastic(1, .5)'
    });
  });
};

// Shake animation
export const shake = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      translateX: [
        { value: -10, duration: 100 },
        { value: 10, duration: 100 },
        { value: -10, duration: 100 },
        { value: 10, duration: 100 },
        { value: 0, duration: 100 }
      ],
      easing: 'easeInOutSine'
    });
  });
};

// Wave animation for text
export const waveText = (targets: string) => {
  if (!isBrowser) return;
  const textWrapper = document.querySelector(targets);
  if (textWrapper && textWrapper.textContent) {
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    
    loadAnime()?.then((anime) => {
      anime.timeline()
        .add({
          targets: `${targets} .letter`,
          translateY: [-100, 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (el: any, i: number) => 30 * i
        });
    });
  }
};

// Page transition
export const pageTransition = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime.timeline()
      .add({
        targets,
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutCubic'
      })
      .add({
        targets: `${targets} > *`,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutCubic'
      }, '-=400');
  });
};

// Button ripple effect
export const buttonRipple = (e: React.MouseEvent<HTMLElement>) => {
  if (!isBrowser) return;
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: translate(-50%, -50%);
    pointer-events: none;
  `;
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);
  
  loadAnime()?.then((anime) => {
    anime({
      targets: ripple,
      width: Math.max(rect.width, rect.height) * 2,
      height: Math.max(rect.width, rect.height) * 2,
      opacity: [0.6, 0],
      duration: 600,
      easing: 'easeOutQuad',
      complete: () => ripple.remove()
    });
  });
};

// Number counter animation
export const animateNumber = (element: HTMLElement, target: number, duration = 2000) => {
  if (!isBrowser) return;
  const obj = { value: 0 };
  loadAnime()?.then((anime) => {
    anime({
      targets: obj,
      value: target,
      duration,
      easing: 'easeOutExpo',
      round: 1,
      update: () => {
        element.textContent = obj.value.toLocaleString();
      }
    });
  });
};

// Gradient animation
export const animateGradient = (targets: string | HTMLElement) => {
  if (!isBrowser) return;
  loadAnime()?.then((anime) => {
    anime({
      targets,
      background: [
        'linear-gradient(45deg, #0066FF, #00B8D4)',
        'linear-gradient(135deg, #00B8D4, #0066FF)',
        'linear-gradient(225deg, #0066FF, #00B8D4)',
        'linear-gradient(315deg, #00B8D4, #0066FF)',
        'linear-gradient(45deg, #0066FF, #00B8D4)'
      ],
      duration: 8000,
      easing: 'linear',
      loop: true
    });
  });
};

