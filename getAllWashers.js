// ==UserScript==
// @name         Auto Reservation & Conditional Refresh
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically make a reservation and refresh only after all machines are reserved.
// @author       OpenAI
// @match        https://washnet.co.uk/en/laundry/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=washnet.co.uk
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        waitForElement("body > div.page > div.wrapper > div > div.machineBlock > div > div.liveBlock", () => {
            setTimeout(clickReservationButton, 2000); // Wait 2 seconds for content to load
        });
    });

    // Function to wait for an element to appear
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                obs.disconnect();
                callback();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // Function to find and click the "Make reservation" button
    function clickReservationButton() {
        const reservationButtons = Array.from(document.querySelectorAll('label.btn'))
            .filter(el => el.textContent.trim() === "Make reservation");

        if (reservationButtons.length > 0) {
            // Loop through all available reservation buttons
            reservationButtons.forEach(label => {
                const controlId = label.getAttribute('for');

                fetch("https://washnet.co.uk/en/laundry/university-of-exeter-holland-hall-281?PaymentCancelled=true&TransactionId=Tgt8PBSUEQI", {
                    headers: {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,la;q=0.7,hr;q=0.6,ga;q=0.5",
                        "cache-control": "max-age=0",
                        "content-type": "application/x-www-form-urlencoded",
                        "priority": "u=0, i",
                        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "same-origin",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    referrer: "https://washnet.co.uk/en/laundry/university-of-exeter-holland-hall-281?PaymentCancelled=true&TransactionId=TgtRHPBSUEQI",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: `controlId=${controlId}&machinetypeid=2&machinereservation=Reserve`,
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                })
                .then(response => {
                    if (response.ok) {
                        console.log(`Reservation for controlId ${controlId} sent successfully.`);
                    } else {
                        console.error(`Reservation for controlId ${controlId} failed.`);
                    }
                })
                .catch(error => console.error(`Error reserving controlId ${controlId}:`, error));
            });

        } else {
            console.log("All machines have been reserved. Refreshing in 10 seconds...");

            // Refresh the page after 10 seconds if no reservation buttons are left
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        }
    }
})();
