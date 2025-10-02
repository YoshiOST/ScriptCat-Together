// ==UserScript==
// @name         Floating Nav Menu (Bottom Right) with Rows
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Floating vertical nav menu with support for rows of buttons
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- Create container ---
    const container = document.createElement("div");
    container.id = "floatingNavMenu";
    Object.assign(container.style, {
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
            background: "#222",
            color: "#fff",
            cursor: "pointer",
            flex: "1", // allow even spacing in rows
        });
        btn.addEventListener("mouseover", () => { btn.style.background = "#444"; });
        btn.addEventListener("mouseout", () => { btn.style.background = "#222"; });
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
        container.appendChild(row);
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
        container.appendChild(row);
    }

    // --- Insert into page ---
    document.body.appendChild(container);

    // --- Example usage ---
    addButton("Footnotes", () => window.location.href = "/");
    addButton("UI", () => window.location.href = "/");
    addRow([
        ["<", () => location.reload()],
        [">", () => alert("Hello from nav menu!")]
    ]);
    // addButton("Profile", () => window.location.href = "/profile");

})();
