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

const url = document.URL

const parts = url.split('?');
if (parts.length === 2) {
    const queryParams = parts[1].split(',');
    if (queryParams.length === 2) {
        const gameID = queryParams[0];
        const instanceID = queryParams[1];
        console.log('Game ID:', gameID);
        console.log('Instance ID:', instanceID);
        Roblox.GameLauncher.joinGameInstance(gameID, instanceID)
    }
}
