// ==UserScript==
// @name         GameMath Book Enhanced
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  try to take over the world!
// @author       XReaper95
// @match        https://gamemath.com/book/*
// @exclude      https://gamemath.com/book/answers.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const footnoteRefs = document.getElementsByClassName("FootnoteRef");

    // nothing to do if there are no footnotes
    if (!footnoteRefs) return;

    // ==================== Fix pages with broken footnote references ====================
    // footnotes ID are ordered starting from 0, so just set the same
    // for the references, in top to bottom order
    for (const [idx, ref] of Array.from(footnoteRefs).entries()) {
        ref.href = `#footnote_${idx}`
    }

    // ==================== Add a tooltip with the footnote text to the link ====================
    for (const ref of footnoteRefs) {
        const footnoteId = ref.href.split("#")[1]
        const footnote = document.getElementById(footnoteId)
        ref.title = footnote.textContent
    }

    // ==================== Add links to exercises answers (TODO) ====================
//     const exercisesTitle = document.getElementById("exercises")

//     const link = document.createElement("a")
//     link.href = ""
//     link.textContent = " (answers)"
//     link.style.backgroundColor = "cyan"

//     const div = wrap(exercisesTitle, "div")
//     div.append(link)

//     align(exercisesTitle)
//     align(link)
})();

function wrap(node, tag) {
  const wrapper = document.createElement(tag)
  node.parentNode.insertBefore(wrapper, node);
  node.previousElementSibling.appendChild(node);
  return wrapper
}

function align(node){
    node.style.display = "inline-block"
    node.style.verticalAlign = "top"
}