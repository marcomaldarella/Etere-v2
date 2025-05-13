// 👉  mettilo accanto a Hero (src/components/Hero/BlurScrollEffect.js)

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextSplitter } from "./TextSplitter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default class BlurScrollEffect {
  constructor(el) {
    if (!el) throw new Error("BlurScrollEffect: element required");
    this.el = el;
    this.init();
  }

  init() {
    /* --- split testo --- */
    this.splitter = new TextSplitter(this.el, {
      split: "words,chars",
      resize: () => ScrollTrigger.refresh(),
    });

    /* --- animazione --- */
    const chars = this.splitter.chars;
    gsap.set(chars, {
      scaleY: 0.1,
      scaleX: 1.8,
      filter: "blur(12px) brightness(40%)",
    });

    this.st = ScrollTrigger.create({
      trigger: this.el,
      start: "top bottom-=15%",
      end: "bottom center+=15%",
      scrub: true,
      onUpdate: (self) => {
        if (self.progress < 0.001) {
          gsap.set(chars, {
            scaleY: 0.1,
            scaleX: 1.8,
            filter: "blur(12px) brightness(40%)",
          });
        }
      },
    });

    this.tl = gsap.fromTo(
      chars,
      {
        scaleY: 0.1,
        scaleX: 1.8,
        filter: "blur(12px) brightness(40%)",
      },
      {
        scaleY: 1,
        scaleX: 1,
        filter: "blur(0px) brightness(100%)",
        stagger: 0.04,
        ease: "none",
        scrollTrigger: this.st,
      }
    );
  }

  destroy() {
    this.tl?.kill();
    this.st?.kill();
    this.splitter?.destroy();
  }
}
