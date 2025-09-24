// ==UserScript==
// @name         Bible.com: Conditional Fixes + Global Margin Hides
// @namespace    https://example.com/
// @version      2.6-hiding
// @description  Replace <a> with <div>, adjust col-spans, hide max-widths, and hide margins/elements on bible.com
// @match        https://www.bible.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function injectOverrides() {
    if (document.getElementById('__sc_overrides')) return; // prevent duplicates
    const style = document.createElement('style');
    style.id = '__sc_overrides';
    style.textContent = `
      @media (min-width: 0px) {
        .sm\\:col-end-12 { grid-column-end: 16 !important; }
        .sm\\:col-start-2 { grid-column-start: 1 !important; }
      }
    `;
    document.head.appendChild(style);
    console.info('[ScriptCat] Injected CSS overrides');
  }

  function overrideBodyMinWidth() {
    if (document.getElementById('__sc_body_override')) return;
    const css = `body { min-width: 0 !important; }`;
    const el = document.createElement('style');
    el.id = '__sc_body_override';
    el.textContent = css;
    document.head.appendChild(el);
    console.info('[ScriptCat] Body min-width hidden');
  }

  function hasStickyBar() {
    return !!document.querySelector(
      '.flex.justify-center.sticky.top-\\[72px\\].md\\:top-\\[80px\\].w-full.z-docked.bg-white.border-b-small.border-gray-15'
    );
  }

  function hidePopVersesAd() {
    document.querySelectorAll('.flex.flex-col.mbe-2.mbs-8.text-center').forEach(el => {
      el.style.display = 'none';
    });
  }

  function hidePlanAds() {
    const textElement = document.querySelector(
      '.text-text-light.dark\\:text-text-dark.text-15.font-aktiv-grotesk.font-bold.mbe-2.text-center'
    );
    if (textElement) textElement.style.display = 'none';

    const gridElement = document.querySelector('.grid.gap-2.grid-cols-1.md\\:grid-cols-2');
    if (gridElement) gridElement.style.display = 'none';
  }

  function replaceAnchors() {
  // Select the link you want (by class, href, etc.)
      const links = document.querySelectorAll('a.no-underline[href^="/bible/compare/"]');

      links.forEach(link => {
          // Create a new div
          const div = document.createElement('div');
          div.className = link.className; // copy classes
          div.innerHTML = link.innerHTML; // copy inner content

          // Replace the link with the div
          link.parentNode.replaceChild(div, link);
      });
  }

  function updateColSpans() {
    const nodes = document.querySelectorAll('#__next .lg\\:col-span-8');
    nodes.forEach(node => {
      node.classList.remove('lg:col-span-8');
      node.classList.add('lg:col-span-12');
    });
  }

  function removeMaxWContainer() {
    document.querySelectorAll('#__next .md\\:max-w-container-sm')
      .forEach(node => node.classList.remove('md:max-w-container-sm'));
  }

  function removeMaxW1200() {
    document.querySelectorAll('#__next .max-w-\\[1200px\\]')
      .forEach(node => node.classList.remove('max-w-[1200px]'));
  }

  function hideHeader() {
    const header = document.querySelector('header.bg-canvas-light.z-banner');
    if (header) header.style.display = 'none';
  }

  function hideMiniHeader() {
    const header = document.querySelector('.leading-comfy');
    if (header) header.style.display = 'none';
  }

  function hideElements() {
    document.querySelectorAll('.z-docked').forEach(el => el.style.display = 'none');
  }

  function hideCookieBanner() {
    const cookieBanner = document.querySelector('div.cc-banner');
    if (cookieBanner) {
      cookieBanner.remove();
      console.log("cookie banner removed.");
    }
  }

  function hideNextPrevButtons() {
    const stickyBottom = document.querySelector('.bottom-\\[30\\%\\].pointer-events-none');
    if (stickyBottom) stickyBottom.style.display = 'none';
  }

  function hideBottomBar() {
    const navs = document.querySelectorAll('nav');
    if (navs.length > 1) navs[1].style.display = 'none';
  }

  function hideFooterBar() {
    const navs = document.querySelectorAll('footer');
    if (navs.length == 1) navs[0].style.display = 'none';
  }

  function hideSelectedOptions() {
    const fixedPopup = document.querySelector('.-translate-x-\\[50\\%\\].fixed');
    if (fixedPopup) fixedPopup.style.display = 'none';
  }

  function removeStickySpecificClasses() {
    document.querySelectorAll('#__next .lg\\:w-1\\/2')
      .forEach(node => node.classList.remove('lg:w-1/2'));
    document.querySelectorAll('#__next .max-w-\\[512px\\]')
      .forEach(node => node.classList.remove('max-w-[512px]'));
  }

  function removeGlobalMargins() {
    document.querySelectorAll('#__next .md\\:mbs-\\[80px\\]')
      .forEach(node => node.classList.remove('md:mbs-[80px]'));
    document.querySelectorAll('#__next .md\\:w-5\\/6')
      .forEach(node => node.classList.remove('md:w-5/6'));
    document.querySelectorAll('#__next .sm\\:mbs-\\[72px\\]')
      .forEach(node => node.classList.remove('sm:mbs-[72px]'));
    document.querySelectorAll('#__next .mbs-4')
      .forEach(node => node.classList.remove('mbs-4'));
  }

  function hideAltTranslations() {
    document.querySelectorAll('.mbe-2.-mis-2.-mie-2')
      .forEach(el => el.style.display = 'none');
  }

  function hideAllButtons() {
    document.querySelectorAll('button.relative.items-center.font-bold')
      .forEach(el => el.style.display = 'none');
  }

  function hideAppAd() {
    document.querySelectorAll('.lg\\:col-start-9.lg\\:col-end-12.mbs-8')
      .forEach(el => el.style.display = 'none');
  }

  function hideVerseImages() {
    const elements = document.querySelectorAll(
      '.bg-canvas-light.rounded-1'
    );
    if (elements.length > 1) {
      for (let i = 1; i < elements.length; i++) {
        elements[i].style.display = 'none';
      }
    }


  }

  function applyFixes() {
    hideHeader();
    injectOverrides();
    overrideBodyMinWidth();
    removeGlobalMargins();

    if (hasStickyBar()) {
      removeStickySpecificClasses();
      hideElements();
      hideFooterBar();
      hideNextPrevButtons();
      hideCookieBanner();
      return;
    }

    updateColSpans();
    hideBottomBar();
    hideSelectedOptions();
    hidePlanAds();
    hidePopVersesAd();
    hideAltTranslations();
    hideAllButtons();
    hideAppAd();
    hideMiniHeader();
    removeMaxWContainer();
    removeMaxW1200();
    hideVerseImages();
    hideCookieBanner();
    replaceAnchors();
    hideFooterBar();
  }

  window.addEventListener('load', applyFixes);
  const observer = new MutationObserver(applyFixes);
  observer.observe(document.body, { childList: true, subtree: true });
})();
