// eslint-disable-next-line userscripts/align-attributes
// eslint-disable-next-line userscripts/no-invalid-metadata
// ==UserScript==
// @name         WEBUS Bible Reader + ShortCuts
// @namespace    webusbible
// @version      1.0
// @description  Example userscript for local files
// @author       You
// @match        file:///*/eng-web_html/*.htm
// @match        https://ebible.org/engwebu/*.htm
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
// extra styles
// Create a style element
    const styleA = document.createElement('style');
    styleA.textContent = `
        div.chapterlabel#V0 {
            text-align: left !important;
        }
    `;
    document.head.appendChild(styleA);

  const FONT_FAMILIES = "Arimo, sans-serif";
  const CDN_HREF = 'https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&display=swap';

  // 1) add <link> to load the font (if not already present)
  if (!document.querySelector(`link[href="${CDN_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CDN_HREF;
    link.crossOrigin = 'anonymous';
    (document.head || document.documentElement).appendChild(link);
  }

  // 2) inject a global CSS rule (uses !important)
  const style = document.createElement('style');
  style.textContent = `
    /* fallback import in case link is blocked */
    @import url('${CDN_HREF}');
    /* force font for everything */
    html, body, :root, * , *::before, *::after {
      font-family: ${FONT_FAMILIES} !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // 3) set inline font-family on root + body (helps override some other rules)
  try {
    document.documentElement.style.fontFamily = FONT_FAMILIES;
    if (document.body) document.body.style.fontFamily = FONT_FAMILIES;
  } catch (e) {}

  // 4) set inline style for every existing element (brute-force but reliable on small local docs)
  function applyInlineToAll() {
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      try {
        all[i].style.fontFamily = FONT_FAMILIES;
      } catch (e) {}
    }
  }
  applyInlineToAll();

  // 5) observe DOM mutations and apply to newly inserted elements
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          try { node.style && (node.style.fontFamily = FONT_FAMILIES); } catch (e) {}
          // also apply to children
          node.querySelectorAll && node.querySelectorAll('*').forEach(n => {
            try { n.style && (n.style.fontFamily = FONT_FAMILIES); } catch (e) {}
          });
        }
      });
    }
  });
  mo.observe(document.documentElement || document, { childList: true, subtree: true });

  console.log('ArialMT override applied (CSS + inline). If the font looks unchanged check network / computed styles.');


// Create toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.style.position = 'fixed';
    toggleContainer.style.bottom = '10px';
    toggleContainer.style.left = '100%';
    toggleContainer.style.transform = 'translateX(-100%)';
    toggleContainer.style.background = 'rgba(0,0,0,0.7)';
    toggleContainer.style.padding = '6px 12px';
    toggleContainer.style.borderRadius = '12px';
    toggleContainer.style.color = '#fff';
    toggleContainer.style.fontFamily = 'sans-serif';
    toggleContainer.style.zIndex = '9999';
    toggleContainer.style.display = 'flex';
    toggleContainer.style.alignItems = 'center';
    toggleContainer.style.gap = '6px';

    // Label
    const label = document.createElement('span');
    label.textContent = 'Footnotes';
    toggleContainer.appendChild(label);

    // Toggle (checkbox styled like a slider)
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = false; // start visible
    toggle.style.width = '40px';
    toggle.style.height = '20px';
    toggle.style.cursor = 'pointer';
    toggleContainer.appendChild(toggle);

    // Append to page
    document.body.appendChild(toggleContainer);

    // Function to toggle footnotes
    function toggleFootnotes(show) {
        document.querySelectorAll('div.footnote').forEach(fn => {
            fn.style.display = show ? '' : 'none';
        });
    }

    // Initial state
    toggleFootnotes(false);

    // Listen for changes
    toggle.addEventListener('change', () => {
        toggleFootnotes(toggle.checked);
    });

    // Your code here
    console.log("Userscript running on a local file!");

    // Select all <ul> elements with class 'tnav'
    const tnavLists = document.querySelectorAll('ul.tnav');

    // Hide each one
    tnavLists.forEach(ul => {
        ul.style.display = 'none';
    });


    // Select all spans with class "verse"
    const verseSpans = document.querySelectorAll("span.verse");

    // Loop through them and hide each one
    verseSpans.forEach(span => {
        span.style.display = "none";
    });

    // Hide all <div> elements with class 'copyright'
    const copyrightDivs = document.querySelectorAll('div.copyright');
    copyrightDivs.forEach(div => {
        div.style.display = 'none';
    });

    // Find the link once page loads
    const prevLink = document.querySelector("body > ul > li:nth-child(2) > a");
    const nextLink = document.querySelector("body > ul > li:nth-child(4) > a");
    if (!prevLink) {
        console.warn("Target previous chapter not found!");
        return;
    }
    if (!nextLink) {
        console.warn("Target previous chapter not found!");
        return;
    }

    // Add keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'j') {
            e.preventDefault(); // prevent default browser action
            prevLink.click(); // simulate click
            console.log("Shortcut triggered: link clicked!");
        }
    });

        // Add keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            e.preventDefault(); // prevent default browser action
            nextLink.click(); // simulate click
            console.log("Shortcut triggered: link clicked!");
        }
    });

})();
