// ==UserScript==
// @name         Bible.com: Conditional Fixes + Global Margin Removals
// @namespace    https://example.com/
// @version      2.6
// @description  Replace <a> with <div>, adjust col-spans, remove max-widths, and strip margins on bible.com
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
      /* Override Tailwind defaults */
      @media (min-width: 0px) {
        .sm\\:col-end-12 { grid-column-end: 16 !important; }
        .sm\\:col-start-2 { grid-column-start: 1 !important; }
      }
    `;
    document.head.appendChild(style);
    console.info('[ScriptCat] Injected CSS overrides');
  }

function overrideBodyMinWidth() {
  const style = document.getElementById('__sc_body_override');
  if (style) return; // prevent duplicates

  const css = `
    body {
      min-width: 0 !important;
    }
  `;
  const el = document.createElement('style');
  el.id = '__sc_body_override';
  el.textContent = css;
  document.head.appendChild(el);
  console.info('[ScriptCat] Body min-width removed');
}

  // --- Detect sticky top bar ---
  function hasStickyBar() {
    return !!document.querySelector(
      '.flex.justify-center.sticky.top-\\[72px\\].md\\:top-\\[80px\\].w-full.z-docked.bg-white.border-b-small.border-gray-15'
    );
  }

  // --- Replace anchors with divs ---
  function replaceAnchors() {
    const anchors = document.querySelectorAll('#__next main a');
    anchors.forEach(anchor => {
      if (anchor.dataset.__sc_replaced) return;

      const div = document.createElement('div');

      // Copy all attributes except href
      for (const { name, value } of anchor.attributes) {
        if (name !== 'href') {
          div.setAttribute(name, value);
        }
      }

      div.innerHTML = anchor.innerHTML;
      div.dataset.__sc_replaced = '1';

      anchor.replaceWith(div);
      console.info('[ScriptCat] Replaced <a> with <div>', div);
    });
  }

  // --- Update lg:col-span-8 → lg:col-span-12 ---
  function updateColSpans() {
    const nodes = document.querySelectorAll('#__next .lg\\:col-span-8');
    nodes.forEach(node => {
      node.classList.remove('lg:col-span-8');
      node.classList.add('lg:col-span-12');
      console.info('[ScriptCat] Updated col-span', node);
    });
  }

  // --- Remove md:max-w-container-sm ---
  function removeMaxWContainer() {
    const nodes = document.querySelectorAll('#__next .md\\:max-w-container-sm');
    nodes.forEach(node => {
      node.classList.remove('md:max-w-container-sm');
      console.info('[ScriptCat] Removed md:max-w-container-sm', node);
    });
  }

  // --- Remove max-w-[1200px] ---
  function removeMaxW1200() {
    const nodes = document.querySelectorAll('#__next .max-w-\\[1200px\\]');
    nodes.forEach(node => {
      node.classList.remove('max-w-[1200px]');
      console.info('[ScriptCat] Removed max-w-[1200px]', node);
    });
  }

  // --- Remove sticky-specific classes (lg:w-1/2 and max-w-[512px]) ---
  function removeStickySpecificClasses() {
    const halfWidthNodes = document.querySelectorAll('#__next .lg\\:w-1\\/2');
    halfWidthNodes.forEach(node => {
      node.classList.remove('lg:w-1/2');
      console.info('[ScriptCat] Removed lg:w-1/2', node);
    });

    const maxW512Nodes = document.querySelectorAll('#__next .max-w-\\[512px\\]');
    maxW512Nodes.forEach(node => {
      node.classList.remove('max-w-[512px]');
      console.info('[ScriptCat] Removed max-w-[512px]', node);
    });
  }

  // --- Always remove md:mbs-[80px] and sm:mbs-[72px] ---
  function removeGlobalMargins() {
    const mdNodes = document.querySelectorAll('#__next .md\\:mbs-\\[80px\\]');
    mdNodes.forEach(node => {
      node.classList.remove('md:mbs-[80px]');
      console.info('[ScriptCat] Removed md:mbs-[80px]', node);
    });

    const smNodes = document.querySelectorAll('#__next .sm\\:mbs-\\[72px\\]');
    smNodes.forEach(node => {
      node.classList.remove('sm:mbs-[72px]');
      console.info('[ScriptCat] Removed sm:mbs-[72px]', node);
    });

    const marginblockstart = document.querySelectorAll('#__next .mbs-4');
    marginblockstart.forEach(node => {
      node.classList.remove('mbs-4');
      console.info('[ScriptCat] Removed mbs-4', node);
    });

  }

  function applyFixes() {
    injectOverrides(); // always inject overrides
    overrideBodyMinWidth();
    // Always remove margins
    removeGlobalMargins();

    if (hasStickyBar()) {
      console.info('[ScriptCat] Sticky top bar detected — skipping normal fixes and removing sticky-specific classes.');
      removeStickySpecificClasses();
      return;
    }

    // Normal fixes
    replaceAnchors();
    updateColSpans();
    removeMaxWContainer();
    removeMaxW1200();
  }

  // Run after page load
  window.addEventListener('load', applyFixes);

  // Observe DOM changes (React often re-renders)
  const observer = new MutationObserver(applyFixes);
  observer.observe(document.body, { childList: true, subtree: true });
})();
