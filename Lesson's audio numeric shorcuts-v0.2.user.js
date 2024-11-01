// ==UserScript==
// @name         Lesson's audio numeric shorcuts
// @namespace    http://tampermonkey.net/
// @version      v0.2
// @description  change the shortcuts for the lessons's audio to the number row
// @author       XReaper95
// @match        https://www.wanikani.com/subject-lessons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('turbo:before-render', newPageLoaded);
    newPageLoaded();
})();

function newPageLoaded(pageLoadEvent) {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                addShortcuts()
                return
            }
        }
    };
    // the MutationObserver is needed because the contents
    // of the page will change dynamically
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    if (pageLoadEvent) {
        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: false };
        // Start observing the target node for configured mutations
        observer.observe(pageLoadEvent.detail.newBody, config);
    } else {
        addShortcuts()
    }
}

function addShortcuts(){
    const readings = document.getElementsByClassName("reading-with-audio__audio-item")
    if (!readings) return;

    let currentHotkeyIdx = 1;
    for (const reading of readings) {
        // add from 1 to 9
        if (currentHotkeyIdx <= 9){
            reading.setAttribute("data-hotkey", currentHotkeyIdx.toString())
            currentHotkeyIdx++;
        }
    }
}