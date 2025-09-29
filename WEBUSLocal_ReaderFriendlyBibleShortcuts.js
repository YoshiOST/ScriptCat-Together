// eslint-disable-next-line userscripts/align-attributes
// eslint-disable-next-line userscripts/no-invalid-metadata
// ==UserScript==
// @name         WEBUS Bible Reader + ShortCuts
// @namespace    webusbible
// @version      1.2
// @description  Example userscript for local files
// @author       You
// @match        file:///*/eng-web_html/*.htm
// @match        https://ebible.org/engwebu/*.htm
// @match        https://ebible.org/eng-web/*.htm
// @match        https://ebible.org/engwebpb/*.htm

// @grant        none
// ==/UserScript==

(function () {

  // Find the link once page loads
  const prevLink = document.querySelector("body > ul > li:nth-child(2) > a");
  const nextLink = document.querySelector("body > ul > li:nth-child(4) > a");

  // Create the <nav> element
  const nav = document.createElement('ul');
  nav.classList.add("tnav")
  // Create the <a> element
  const link = document.createElement('a');
  link.href = 'indexbar.htm';
  link.textContent = 'Index';

  // Append the link to the nav
  // Select all <ul> elements with class 'tnav'
  var tnavLists = document.querySelectorAll('ul.tnav');
  nav.appendChild(link);
  if (tnavLists.length > 1)
    tnavLists[1].insertAdjacentElement('afterend', nav);
    tnavLists = document.querySelectorAll('ul.tnav');

  // Finally, append the nav to the document (for example, body)
  // document.body.appendChild(nav);

  'use strict';
  // extra styles
  // Create a style element
  const styleA = document.createElement('style');
  styleA.textContent = `
    div.chapterlabel#V0, .mt, .mt1 , .mt2 , .mte, .mte1 {
      text-align: left !important;
    }
  `;
  document.head.appendChild(styleA);

  //add margin to main div to accomodate controls at the bottom right
  const style_main = document.createElement('style');
  style_main.textContent = `
    .main {
      padding-bottom: 250px;
    }
  `;
  document.head.appendChild(style_main);

  const style_container_footnote = document.createElement('style');
  style_container_footnote.textContent = `
    .toggle-container {
      position: fixed;
      bottom: 10px;
      right: 5px;
      background: rgba(0, 0, 0, 0.7);
      padding: 6px 12px;
      border-radius: 12px;
      color: #fff;
      font-family: sans-serif;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `;
  document.head.appendChild(style_container_footnote);

  const container_footnote = document.createElement('div');
  const container_jump = document.createElement('div');
  const container_index = document.createElement('div');
  const container_prev = document.createElement('div');
  const container_next = document.createElement('div');

  const style_container_jump = document.createElement('style');
  style_container_jump.textContent = `
    .jump {
      bottom: 60px;
    }
  `;
  document.head.appendChild(style_container_jump);

  const style_checkbox = document.createElement('style');
  style_checkbox.textContent = `
    .toggle-checkbox {
      width: 40px;
      height: 20px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style_checkbox);


  container_footnote.classList.add("toggle-container")
  container_jump.classList.add("toggle-container","jump")
  container_index.classList.add("toggle-container")
  container_index.style.bottom = '110px';
  container_next.classList.add("toggle-container")
  container_next.style.bottom = '160px';
  container_prev.classList.add("toggle-container")
  container_prev.style.bottom = '160px';
  container_prev.style.right = '50px';
  // Toggle (checkbox styled like a slider)
  const toggle_footnotes = document.createElement('input');
  toggle_footnotes.type = 'checkbox';
  toggle_footnotes.checked = false; // start visible
  container_footnote.appendChild(toggle_footnotes);

  const toggle_jump = document.createElement('input');
  toggle_jump.type = 'checkbox';
  toggle_jump.checked = false; // start visible
  container_jump.appendChild(toggle_jump);

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
  } catch (e) { }

  // 4) set inline style for every existing element (brute-force but reliable on small local docs)
  function applyInlineToAll() {
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      try {
        all[i].style.fontFamily = FONT_FAMILIES;
      } catch (e) { }
    }
  }
  applyInlineToAll();

  // 5) observe DOM mutations and apply to newly inserted elements
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          try { node.style && (node.style.fontFamily = FONT_FAMILIES); } catch (e) { }
          // also apply to children
          node.querySelectorAll && node.querySelectorAll('*').forEach(n => {
            try { n.style && (n.style.fontFamily = FONT_FAMILIES); } catch (e) { }
          });
        }
      });
    }
  });
  mo.observe(document.documentElement || document, { childList: true, subtree: true });

  console.log('ArialMT override applied (CSS + inline). If the font looks unchanged check network / computed styles.');

  // Label
  const label_footnotes = document.createElement('span');
  const label_ui = document.createElement('span');
  label_footnotes.textContent = 'Footnotes';
  label_ui.textContent = 'UI';
  container_footnote.appendChild(label_footnotes);
  container_jump.appendChild(label_ui);

  // Link Label
  const label_index = document.createElement('a');
  container_index.textContent = 'Index';
  label_index.href = 'indexbar.htm';
  document.body.appendChild(label_index);
  label_index.appendChild(container_index);

  //moved prev and next label
  const label_prev = document.createElement('a');
  container_prev.textContent = '<';
  label_prev.href = prevLink;
  document.body.appendChild(label_prev);
  label_prev.appendChild(container_prev);
  //moved prev and next label
  const label_next = document.createElement('a');
  container_next.textContent = '>';
  label_next.href = nextLink;
  document.body.appendChild(label_next);
  label_next.appendChild(container_next);

  // Append to page
  document.body.appendChild(container_footnote);
  document.body.appendChild(container_jump);
  //document.body.appendChild(container_index);

  // Function to toggle footnotes
  function toggleFootnotes(show) {
    document.querySelectorAll('div.footnote').forEach(fn => {
      fn.style.display = show ? '' : 'none';
    });
  }
  // Hide each one
  tnavLists.forEach(ul => {
    ul.style.display = 'none';
  });

  // Function to toggle footnotes
  function toggleJump(show) {
    tnavLists.forEach(ul => {
      ul.style.display = show ? '' : 'none';
    });
  }

  // Initial state
  toggleFootnotes(false);
  toggleJump(false);

  // Listen for changes
  toggle_footnotes.addEventListener('change', () => {
    toggleFootnotes(toggle_footnotes.checked);
  });

    // Listen for changes
  toggle_jump.addEventListener('change', () => {
    toggleJump(toggle_jump.checked);
  });

  // Your code here
  console.log("Userscript running on a local file!");


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
