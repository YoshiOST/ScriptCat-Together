// eslint-disable-next-line userscripts/align-attributes
// eslint-disable-next-line userscripts/no-invalid-metadata
// ==UserScript==
// @name         WEBUS Bible Reader + ShortCuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Example userscript for local files
// @author       You
// @match        file:///*/eng-web_html/*.htm
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

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
