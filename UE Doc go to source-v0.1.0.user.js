// ==UserScript==
// @name         UE Doc go to source
// @namespace    XReaper Scripts
// @version      0.1.0
// @description  Create links in the Unreal Engine C++ API documentation to the source on GitHub. Requires source access.
// @author       XReaper
// @match        https://dev.epicgames.com/documentation/en-us/unreal-engine/API/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epicgames.com
// @grant        none
// @run-at       document-idle
// @updateURL    https://github.com/XReaper95/Userscripts/raw/refs/heads/main/UE%20Doc%20go%20to%20source-v0.1.0.user.js
// @downloadURL  https://github.com/XReaper95/Userscripts/raw/refs/heads/main/UE%20Doc%20go%20to%20source-v0.1.0.user.js
// @require https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.3/waitForKeyElements.js

// ==/UserScript==

(function() {
    'use strict';

    const ghEnginePathBase = "https://github.com/EpicGames/UnrealEngine/blob/"

    runScript()

    // watch URL changes (for link navigation)
    {
        let previousUrl = ""
        const urlChangeObserver = new MutationObserver(() => {
            if (location.href !== previousUrl) {
                previousUrl = location.href
                runScript()
            }
        })
        urlChangeObserver.observe(document, {childList: true, subtree: true})
    }


    function runScript(){
        const linkCreator = (referencesNode) => {
            const version = resolveEngineVersion(referencesNode)
            createLinkForHeader(referencesNode, version)
            createLinkForSources(referencesNode, version)
        }

        waitForKeyElements(() => {
            const references = document.getElementById("references")
            const referencesTable = references?.nextSibling.nextSibling.firstChild
            if (referencesTable) {
                return [referencesTable] // this function should always return some list of nodes
            }
            return null
        }, linkCreator, undefined, undefined, 30)
    }

    function resolveEngineVersion(referencesTableNode) {
        const module = getContentFromReferencesTable(referencesTableNode, 1)

        if(!module) {
            // probably a parsing error, maybe page layout changed
            console.error("[Script][UE Doc go to source]: Cannot find module")
            return
        }

        // this points to the latest version always
        var engineVersion = "release"

        const moduleQueryParameters = module.firstChild.getAttribute("data-queryparams")

        if(moduleQueryParameters) { // when this property is available, we are requesting a version different from latest
            engineVersion = JSON.parse(moduleQueryParameters)?.application_version
        }

        return engineVersion
    }

    function createLinkForHeader(referencesTableNode, engineVersion) {
        const headerPath = getContentFromReferencesTable(referencesTableNode, 2)

        if(!headerPath) {
            // probably a parsing error, maybe page layout changed
            console.error("[Script][UE Doc go to source]: Cannot find header")
            return
        }

        createLink(headerPath, "Header", engineVersion)
    }

    function createLinkForSources(referencesTableNode, engineVersion) {
        const sourcesPath = getContentFromReferencesTable(referencesTableNode, 4)

        if(!sourcesPath) {
            // no error, source is optional
            return
        }
        sourcesPath
        createLink(sourcesPath, "Source", engineVersion)
    }

    function createLink(path, what, engineVersion) {
        const originalPath = path.innerHTML
        const a = document.createElement('a')
        a.title = `Link to ${what} file on GH`
        a.href = ghEnginePathBase + engineVersion + originalPath
        a.target = "_blank" // open in new tab
        a.innerHTML = originalPath
        path.innerHTML = ""
        path.appendChild(a)
    }

    function getContentFromReferencesTable(referencesTableNode, itemPosition) {
        const row = referencesTableNode.rows[itemPosition]
        return row?.getElementsByTagName("td")[1]
    }
})();