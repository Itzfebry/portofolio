"use client";

import { useEffect } from "react";

// Layered hero → about transition + scroll-idle helper.
//
// 1. While the page scrolls, `is-scrolling` is set on <html> so heavy hero
//    decor (the GatewayFlow canvas, the CSS float/orbit/chip animations and the
//    hero's filter / background-position animations) can hold their last frame —
//    they otherwise compete with the compositor and make scrolling over the
//    hero stutter. The class is removed ~200ms after the last scroll event.
// 2. The hero fades to black as the page scrolls: <ScrollFx /> writes
//    `--hero-fade` (0 → 1) to the hero, and a pure-black veil inside the hero
//    fades in over it. The fade is scroll-driven, so it stays perfectly in
//    sync with the scrollbar and is compositor-only (no re-rasterisation of
//    the hero's blur backdrop).
// 3. The hero is held still while the About sheet rises over it, then released
//    the moment About fully covers it. The release is hidden behind the sheet,
//    so it is never visible.
//
//    The hold is a pure CSS sticky pin decided in `measure()`:
//
//    • Hero fits the viewport → `top: 0`, i.e. exactly `position: sticky;
//      top: 0`. The compositor keeps it and no JS runs per frame.
//    • Hero taller than the viewport (mobile, short laptop windows) →
//      `top: innerHeight - heroH` (a negative offset). Sticky then engages at
//      exactly the scroll offset where the hero's bottom edge reaches the
//      viewport bottom — the bottom-edge pin — and again never moves afterwards.
//      This used to be emulated by writing `translate3d` to the hero on every
//      scroll frame. That write was the stutter: `.hero` is a backdrop root
//      wrapping three `blur(90px)` orbs, a `blur(60px)` halo and several
//      backdrop/filter panes, so moving its layer forced the browser to
//      invalidate and re-raster the whole hero for every scrolled pixel. Sticky
//      keeps the identical geometry with zero per-frame JavaScript, so the
//      layer is rasterised once and held.
//
//    4. Once About covers the hero, `is-hero-covered` is set: the hero is
//    pinned and would otherwise never leave the viewport, so its canvas, blurs
//    and CSS animations would keep running behind the sheet for the rest of the
//    page. That flag stops all of them.
//
// Geometry is measured once (and on resize / content resize), so the scroll
// handler performs no layout reads, and values are written only when they
// actually change. Everything runs off one coalesced rAF loop: the scroll
// listener never clears/sets an idle timer per event (a scroll event can fire
// several times per frame), and classes are only mutated when their state
// actually flips.

export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.getElementById("top");
    const about = document.getElementById("about");
    const freezeEnabled = !reduced && hero !== null && about !== null;

    let aboutDocTop = 0;
    let fadeDistance = 0;
    let lastPinTop = Number.NaN;
    let lastFade = Number.NaN;
    let frame = 0;
    let idleUntil = 0;
    let scrolling = false;
    let lastCovered: boolean | null = null;

    const measure = () => {
      if (!hero || !about) return;
      const heroH = hero.offsetHeight;
      aboutDocTop = about.getBoundingClientRect().top + window.scrollY;
      // Scroll distance over which the hero fades to black: the first
      // screenful of scrolling, or the whole hero-covering distance when the
      // hero is shorter than the viewport. The fade is scroll-driven, so it
      // stays perfectly in sync with the scrollbar.
      fadeDistance = Math.max(1, Math.min(aboutDocTop, window.innerHeight));

      // Sticky offset for the pin. `0` when the hero already fits inside the
      // viewport (freeze from the very first pixel); otherwise a negative
      // offset equal to `viewport - hero height`, which makes sticky engage at
      // exactly the scroll offset where the hero's bottom edge lands on the
      // viewport bottom. Written as a custom property so the stylesheet stays
      // the single owner of `position: sticky`.
      const pinTop = Math.min(0, window.innerHeight - heroH);
      if (pinTop !== lastPinTop) {
        lastPinTop = pinTop;
        hero.style.setProperty("--hero-pin-top", `${pinTop}px`);
      }
      if (freezeEnabled) {
        hero.classList.add("is-sticky-pin");
      }
    };

    const update = () => {
      frame = 0;

      // Release `is-scrolling` once the idle window has passed. Driving this
      // from the same rAF loop keeps the whole effect to a single callback
      // chain and lets us touch the class only on an actual state change,
      // instead of a clearTimeout/setTimeout pair per scroll event.
      if (scrolling) {
        if (performance.now() >= idleUntil) {
          scrolling = false;
          root.classList.remove("is-scrolling");
        } else {
          // no further scroll event is coming, so poll until the window closes
          frame = requestAnimationFrame(update);
        }
      }

      // Hero fade to black, driven by scroll position. Scroll-driven (not
      // time-based), so it stays perfectly in sync with the scrollbar and
      // needs no per-frame layout. Written only when the rounded value
      // changes, and opacity is compositor-only, so the fade never
      // re-rasterises the hero's blur backdrop.
      if (hero && fadeDistance > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
        const fade = Math.round(progress * 1000) / 1000;
        if (fade !== lastFade) {
          lastFade = fade;
          hero.style.setProperty("--hero-fade", String(fade));
        }
      }

      if (!freezeEnabled) return;

      // From here the About sheet covers the viewport, so the hero can stop
      // being composited and animated altogether. Crossing this line is the
      // same boundary the hero used to be released at, and it only ever
      // happens once per direction.
      const covered = window.scrollY >= aboutDocTop;
      if (covered !== lastCovered) {
        lastCovered = covered;
        root.classList.toggle("is-hero-covered", covered);
      }
    };

    const onScroll = () => {
      idleUntil = performance.now() + 200;
      if (!scrolling) {
        scrolling = true;
        root.classList.add("is-scrolling");
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Catches content-driven height changes (late webfont swap, image load,
    // reflow) that never fire a window resize event. Without this the pin
    // geometry silently went stale and the hero released at the wrong offset.
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("is-scrolling");
      root.classList.remove("is-hero-covered");
      if (hero) {
        hero.classList.remove("is-sticky-pin");
        hero.style.removeProperty("--hero-pin-top");
        hero.style.removeProperty("--hero-fade");
        // defensive: an inline transform left over from an older pin strategy
        // would fight the sticky pin.
        hero.style.transform = "";
      }
      lastFade = Number.NaN;
    };
  }, []);

  return null;
}
