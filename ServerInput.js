// ==UserScript==
// @name         Server Input Textbox
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Easily join servers
// @author       Hexay
// @match        https://www.roblox.com/games/3214114884/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// ==/UserScript==

(function() {
    function initialize() {
        const containerDiv = document.createElement("div");
        const newTextbox = document.createElement("input");
        newTextbox.type = "text";
        newTextbox.id = "textbox1";
        newTextbox.placeholder = "Enter server here";
        newTextbox.classList.add("form-control");
        const addButton = document.createElement("button");
        addButton.textContent = "Submit";
        addButton.classList.add("btn", "btn-primary", "btn-sm");
        containerDiv.appendChild(newTextbox);
        containerDiv.appendChild(addButton);
        const targetElement = document.querySelector("#game-detail-page > div.col-xs-12.btr-game-main-container.section-content > div.col-xs-12.game-main-content.remove-panel.follow-button-enabled > div.game-calls-to-action > div.game-title-container");
        if (targetElement) {
            targetElement.appendChild(containerDiv);

            function handleSubmit() {
                const inputValue = newTextbox.value;
                const matches = inputValue.match(/"(\d+)",\s*"([^"]+)"/);
                if (matches && matches.length === 3) {
                    const gameID = matches[1];
                    const instanceID = matches[2];
                    Roblox.GameLauncher.joinGameInstance(gameID, instanceID)
                }
                newTextbox.value = ""
            }
        }
        addButton.addEventListener("click", handleSubmit);
    }

    initialize();
})();
