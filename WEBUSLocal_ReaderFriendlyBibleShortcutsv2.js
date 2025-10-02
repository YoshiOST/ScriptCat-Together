// eslint-disable-next-line userscripts/align-attributes
// eslint-disable-next-line userscripts/no-invalid-metadata
// ==UserScript==
// @name         WEBUS Bible Reader + ShortCuts
// @namespace    webusbible
// @version      2.1
// @description  Example userscript for local files
// @author       YoshiOST & chatgpt snippets
// @match        file:///*/eng-web_html/*
// @match        https://ebible.org/engwebu/*
// @match        https://ebible.org/eng-web/*
// @match        https://ebible.org/engwebpb/*
// @match        https://ebible.org/eng-kjv2006/*
// @match        https://ebible.org/eng-asv/*
// @match        https://ebible.org/engoebus/*


// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  var nav_visible = false;
  var footnotes_visible = false;
  var apocrypha_visible = false;
  const has_apocrypha = window.location.href.includes("/eng-web/") || window.location.href.includes("/engwebu/")
  // Get the last section of the URL (after the last "/")
  const lastPart = window.location.pathname.split("/").pop();
  const is_index = window.location.href.includes("index.htm")||lastPart === "";
  const is_chapter = !/\d+(?=\.htm$)/i.test(lastPart);
  // --- Create container ---
  const bibleshortcuts = document.createElement("bibleshortcuts");
  bibleshortcuts.id = "floatingNavMenu";
  Object.assign(bibleshortcuts.style, {
    position: "fixed",
    bottom: "5px",
    right: "5px",
    display: "flex",
    flexDirection: "column-reverse", // stack upward
    gap: "2px",
    zIndex: "99999",
  });

  // --- Helper to create styled button ---
  function makeButton(label, onClick) {
    const btn = document.createElement("button");
    btn.textContent = label;
    Object.assign(btn.style, {
      padding: "2px 2px",
      fontSize: "14px",
      borderRadius: "5px",
      border: "1px solid #555",
      background: "rgba(0,0,0,0.7)",
      color: "#fff",
      cursor: "pointer",
      flex: "1", // allow even spacing in rows
    });
    btn.addEventListener("mouseover", () => { btn.style.background = "rgba(0,0,0,0.8)"; });
    btn.addEventListener("mouseout", () => { btn.style.background = "rgba(0,0,0,0.7)"; });
    btn.addEventListener("click", onClick);
    return btn;
  }

  // --- Helper: add single button in its own row ---
  function addButton(label, onClick) {
    const row = document.createElement("div");
    Object.assign(row.style, {
      display: "flex",
      flexDirection: "row",
      gap: "2px"
    });
    row.appendChild(makeButton(label, onClick));
    bibleshortcuts.appendChild(row);
  }

  // --- Helper: add multiple buttons in one row ---
  function addRow(buttons) {
    const row = document.createElement("div");
    Object.assign(row.style, {
      display: "flex",
      flexDirection: "row",
      gap: "2px"
    });
    buttons.forEach(([label, onClick]) => {
      row.appendChild(makeButton(label, onClick));
    });
    bibleshortcuts.appendChild(row);
  }

  // --- Insert into page ---
  document.body.appendChild(bibleshortcuts);

  // --- Example usage ---
  //index bar page hides all bibleshortcut nav
  if (!window.location.href.includes("indexbar.htm")) {
    //if at main index
    if (has_apocrypha && is_index) {
      addButton("Apocrypha", () => toggleApocrypha());
    }
    //if not at indexbar page and at eng-web (the only one with index bar)
    if (window.location.href.includes("/eng-web/")) {
      addButton("Index", () => window.location.href = "indexbar.htm");
    }
    //don't show buttons on index page
    if (!is_index) {
      addButton("Footnotes", () => toggleFootnotes());
    }
    addButton("UI", () => toggleOldNav());
    //don't show buttons on index page
    if (!is_index && !is_chapter) {
      addRow([
        ["<", () => window.location.href = prevLink],
        [">", () => window.location.href = nextLink]
      ]);
    }

  }

  // Create style for bible shortcuts group
  const style_bs = document.createElement('style');
  style_bs.textContent = `
    .show-on-right {
      display: none;
    }
  `;
  document.head.appendChild(style_bs);

  // Find the link once page loads
  const prevLink = document.querySelector("body > ul > li:nth-child(2) > a");
  const nextLink = document.querySelector("body > ul > li:nth-child(4) > a");

  // extra styles
  // Create a style element
  const styleA = document.createElement('style');
  styleA.textContent = `
    div.chapterlabel#V0, .mt, .mt1 , .mt2 , .mte, .mte1 {
      text-align: left !important;
    }
    .main {
      padding-bottom: 250px;
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
  } catch (e) {
    console.log("font is broken error: " + e)
  }

  // 4) set inline style for every existing element (brute-force but reliable on small local docs)
  function applyInlineToAll() {
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      try {
        all[i].style.fontFamily = FONT_FAMILIES;
      } catch (e) {
        console.log("font is broken error: " + e)
      }
    }
  }
  applyInlineToAll();

  // 5) observe DOM mutations and apply to newly inserted elements
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          try { node.style && (node.style.fontFamily = FONT_FAMILIES); } catch (e) {
            console.log("font is broken error: " + e)
          }
          // also apply to children
          node.querySelectorAll && node.querySelectorAll('*').forEach(n => {
            try { n.style && (n.style.fontFamily = FONT_FAMILIES); } catch (e) {
              console.log("font is broken error: " + e)
            }
          });
        }
      });
    }
  });
  mo.observe(document.documentElement || document, { childList: true, subtree: true });

  console.log('ArialMT override applied (CSS + inline). If the font looks unchanged check network / computed styles.');
  //start footnotes hidden
  document.querySelectorAll('div.footnote').forEach(fn => {
    fn.style.display = 'none';
  });

  // Function to toggle footnotes
  function toggleFootnotes() {
    footnotes_visible = !footnotes_visible;
    document.querySelectorAll('div.footnote').forEach(fn => {
      fn.style.display = footnotes_visible ? '' : 'none';
    });
  }

  //hide apocrypha by default
  console.log("hiding apocrypha");
  var apoc_titles = document.querySelectorAll('a.aa');
  apoc_titles.forEach(div => {
    div.style.display = 'none';
  });

  function toggleApocrypha() {
    apocrypha_visible = !apocrypha_visible;
    apoc_titles.forEach(div => {
      div.style.display = apocrypha_visible ? '' : 'none';
    });
  }

  // Select all <ul> elements with class 'tnav'
  var tnavLists = document.querySelectorAll('ul.tnav');

  // Hide each one
  tnavLists.forEach(ul => {
    ul.style.display = 'none';
  });

  // Hide each one
  var mainindex = document.querySelectorAll('div.mainindex');
  mainindex.forEach(ul => {
    ul.style.display = 'none';
  });

  if (is_chapter && !is_index) {
    toggleOldNav()
    console.log("show navigation")
  }

  // Select all spans with class "verse"
  const verseSpans = document.querySelectorAll("span.verse");

  // Loop through them and hide each one
  verseSpans.forEach(span => {
    span.style.display = "none";
  });

  // Function to toggle footnotes
  function toggleOldNav() {
    nav_visible = !nav_visible;
    tnavLists.forEach(ul => {
      ul.style.display = nav_visible ? '' : 'none';
    });
    mainindex.forEach(ul => {
      ul.style.display = nav_visible ? '' : 'none';
    });
    verseSpans.forEach(span => {
      span.style.display = nav_visible ? '' : 'none';
    });
  }

  // Your code here
  console.log("Userscript running on a local file!");

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

  // Track mouse movement
  document.addEventListener('mousemove', (e) => {
    const screenWidth = window.innerWidth;
    const rightThirdStart = screenWidth * (2 / 3);

    if (e.clientX >= rightThirdStart) {
      bibleshortcuts.style.display = 'flex'; // show
    } else {
      bibleshortcuts.style.display = 'none'; // hide
    }
  });

})();
