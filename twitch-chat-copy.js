// ==UserScript==
// @name         Twitch Chat — Click to Highlight + Auto-Copy (Toggle Alt+C)
// @namespace    https://yourname.example
// @version      1.4
// @description  Toggle with Alt+C: when enabled, click a Twitch chat message to highlight it and copy ONLY the message text (skips username/badges).
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const HIGHLIGHT_CLASS = 'sc-click-highlight';
  let scriptEnabled = false; // default: ON

  const CSS = `
    .${HIGHLIGHT_CLASS} {
      background: rgba(255, 230, 120, 0.18) !important;
      border-left: 3px solid rgba(255, 200, 0, 0.9) !important;
      padding-left: calc(var(--sc-hl-pad, 0.25rem)) !important;
      transition: background 160ms ease;
      border-radius: 4px;
    }
  `;

  function insertStyles() {
    if (document.getElementById('sc-click-highlight-styles')) return;
    const s = document.createElement('style');
    s.id = 'sc-click-highlight-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  const MESSAGE_SELECTORS = [
    '.chat-line__message',
    'div[data-a-target="chat-line-message"]',
    '[data-test-selector="Message"]',
    '.chat-line'
  ];

  function msgMatches(el) {
    return MESSAGE_SELECTORS.some(sel => el.matches && el.matches(sel));
  }

  function extractMessageText(msgEl) {
    const content = msgEl.querySelector('[data-a-target="chat-message-text"]');
    if (content) return content.innerText.trim();

    const spans = msgEl.querySelectorAll('span');
    if (spans.length > 0) {
      return spans[spans.length - 1].innerText.trim();
    }

    return msgEl.innerText.trim();
  }

  function toggleHighlightAndCopy(msgEl) {
    if (!msgEl) return;
    msgEl.classList.toggle(HIGHLIGHT_CLASS);

    if (msgEl.classList.contains(HIGHLIGHT_CLASS)) {
      const text = extractMessageText(msgEl);
      navigator.clipboard.writeText(text).then(() => {
        console.log('[Highlight Script] Copied message only:', text);
      }).catch(err => {
        console.error('[Highlight Script] Failed to copy:', err);
      });
    }
  }

  function onChatClick(e) {
    if (!scriptEnabled) return; // skip if disabled

    let el = e.target;
    while (el && el !== document.body) {
      if (msgMatches(el)) {
        toggleHighlightAndCopy(el);
        e.stopPropagation();
        return;
      }
      el = el.parentElement;
    }
  }

  function attachDelegatedHandler() {
    const chatContainers = [
      document.querySelector('[data-a-target="chat-scrollable-area"]'),
      document.querySelector('[data-a-target="chat-scrollable-area-list"]'),
      document.querySelector('.chat-scrollable-area'),
      document.querySelector('#root')
    ].filter(Boolean);

    for (const container of chatContainers) {
      if (container.__scClickHighlightBound) continue;
      container.addEventListener('click', onChatClick, { capture: true });
      container.__scClickHighlightBound = true;
    }
  }

  function watchForChat() {
    const root = document.body;
    const mo = new MutationObserver(() => {
      attachDelegatedHandler();
    });
    mo.observe(root, { childList: true, subtree: true });
    attachDelegatedHandler();
  }

  function setupToggleHotkey() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.code === 'KeyC') {
        scriptEnabled = !scriptEnabled;
        console.log(`[Highlight Script] ${scriptEnabled ? 'Enabled' : 'Disabled'}`);
      }
    });
  }

  function init() {
    insertStyles();
    watchForChat();
    setupToggleHotkey();
    console.log('[Highlight Script] Ready. Alt+C to toggle.');
  }

  init();

})();
