// ==UserScript==
// @name         Auto Click Make Reservation
// @namespace    http://tampermonkey.net/
// @version      2025-01-10
// @description  Automatically clicks the "Make reservation" button if available, otherwise refreshes the page. Stops after a successful reservation.
// @author       You
// @match        https://washnet.co.uk/en/laundry/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=washnet.co.uk
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  let reservationMade = false; // Flag to stop the script after reservation

  // Function to wait for a specific element to exist
  function waitForElement(selector, callback) {
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        callback();
      }
    }, 500); // Check every 500ms
  }

  // Function to observe changes in the liveBlock to detect reservation success
  function observeReservationConfirmation() {
    const targetNode = document.querySelector("body > div.page > div.wrapper > div > div.machineBlock > div > div.liveBlock");
    if (!targetNode) return;

    const observer = new MutationObserver(() => {
      if (reservationMade) {
        observer.disconnect();
        console.log('Reservation confirmed. Script stopped.');
      }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
  }

  // Function to search and click the "Make reservation" button
  function clickReservationButton() {
    if (reservationMade) return; // Stop the script if reservation is made

    const labels = document.querySelectorAll('label.btn');
    let buttonClicked = false;

    labels.forEach(label => {
      if (label.textContent.trim().toLowerCase() === 'make reservation') {
        label.click();
        buttonClicked = true;
        reservationMade = true; // Set flag to stop further actions
        console.log('"Make reservation" button clicked. Monitoring for confirmation...');
        observeReservationConfirmation(); // Start observing for confirmation
      }
    });

    if (!buttonClicked && !reservationMade) {
      console.log('No "Make reservation" button found. Refreshing page...');
      setTimeout(() => {
        location.reload();
      }, 3000); // Refresh after 3 seconds
    }
  }

  // Wait for the specific element to exist, then search for the button
  window.addEventListener('load', () => {
    waitForElement("body > div.page > div.wrapper > div > div.machineBlock > div > div.liveBlock", () => {
      setTimeout(clickReservationButton, 2000); // Delay for 2 seconds to allow page content to load
    });
  });
})();
