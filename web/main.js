import { Storylets } from "../engine/storylets.js"

(function (storyContent) {
    //console.log("CREATE STORY");
    // Create ink story from the content using inkjs
    var story = new inkjs.Story(storyContent);

    // STORYLETS
    var storylets = new Storylets(story);
    storylets.onUpdated = function () {
        continueStory(true);
    };
    storylets.StartUpdate();
    // STORYLETS

    var savePoint = "";

    var storyContainer = document.querySelector('#story');
    var outerScrollContainer = document.querySelector('.outerContainer');

    // page features setup
    var hasSave = loadState();
    setupButtons(hasSave);

    // Set initial save point
    savePoint = story.state.toJson();

    // Kick off the start of the story!
    //continueStory(true);

    // Main story processing function. Each time this is called it generates
    // all the next content up as far as the next set of choices.
    function continueStory(firstTime) {

        var paragraphIndex = 0;
        var delay = 0.0;

        // Don't over-scroll past new content
        var previousBottomEdge = firstTime ? 0 : contentBottomEdgeY();

        // Generate story text - loop through available content
        while (story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();

            // Create paragraph element (initially hidden)
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);
            delay += 200.0;
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function (choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += 200.0;

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function (event) {

                // Don't follow <a> link
                event.preventDefault();

                // Remove all existing choices
                removeAll(".choice");

                // Tell the story where to go next
                story.ChooseChoiceIndex(choice.index);

                // This is where the save button will save from
                savePoint = story.state.toJson();

                // Aaand loop
                continueStory();
            });
        });

        // STORYLETS
        if (story.currentChoices.length == 0) {

            storylets.onUpdated = function () {

                if (storylets.GetAvailable().length == 0) {
                    var choiceParagraphElement = document.createElement('p');
                    choiceParagraphElement.innerHTML = "No storylets available."
                    storyContainer.appendChild(choiceParagraphElement);
                    showAfter(delay, choiceParagraphElement);
                    delay += 200.0;
                }

                storylets.GetAvailable().forEach(function (storyletName) {

                    // Create paragraph with anchor element
                    var choiceParagraphElement = document.createElement('p');
                    choiceParagraphElement.classList.add("storylet");
                    var content = `<a href='#'>${storyletName}</a>`;
                    var desc = storylets.getStoryletTag(storyletName, "desc", null);
                    if (desc != null)
                        content += `<div class="desc">${desc}</div>`;

                    choiceParagraphElement.innerHTML = content;

                    storyContainer.appendChild(choiceParagraphElement);

                    // Fade choice in after a short delay
                    showAfter(delay, choiceParagraphElement);
                    delay += 200.0;

                    // Click on choice
                    var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
                    choiceAnchorEl.addEventListener("click", function (event) {

                        // Don't follow <a> link
                        event.preventDefault();

                        // Remove all existing choices
                        removeAll(".choice");
                        removeAll(".storylet");

                        // Tell the story where to go next
                        storylets.ChooseStorylet(storyletName);

                        // This is where the save button will save from
                        savePoint = story.state.toJson();

                        // Aaand loop
                        continueStory();
                    });
                });
            }
            storylets.StartUpdate();
        }
        // END STORYLETS

        // Extend height to fit
        // We do this manually so that removing elements and creating new ones doesn't
        // cause the height (and therefore scroll) to jump backwards temporarily.
        storyContainer.style.height = contentBottomEdgeY() + "px";

        if (!firstTime)
            scrollDown(previousBottomEdge);

    }

    function restart() {
        story.ResetState();
        storylets.Reset();

        setVisible(".header", true);

        // set save point to here
        savePoint = story.state.toJson();

        continueStory(true);

        outerScrollContainer.scrollTo(0, 0);
    }

    // -----------------------------------
    // Various Helper functions
    // -----------------------------------

    // Fades in an element after a specified delay
    function showAfter(delay, el) {
        el.classList.add("hide");
        setTimeout(function () { el.classList.remove("hide") }, delay);
    }

    // Scrolls the page down, but no further than the bottom edge of what you could
    // see previously, so it doesn't go too far.
    function scrollDown(previousBottomEdge) {

        // Line up top of screen with the bottom of where the previous content ended
        var target = previousBottomEdge;

        // Can't go further than the very bottom of the page
        var limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
        if (target > limit) target = limit;

        var start = outerScrollContainer.scrollTop;

        var dist = target - start;
        var duration = 300 + 300 * dist / 100;
        var startTime = null;
        function step(time) {
            if (startTime == null) startTime = time;
            var t = (time - startTime) / duration;
            var lerp = 3 * t * t - 2 * t * t * t; // ease in/out
            outerScrollContainer.scrollTo(0, (1.0 - lerp) * start + lerp * target);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // The Y coordinate of the bottom end of all the story content, used
    // for growing the container, and deciding how far to scroll.
    function contentBottomEdgeY() {
        var bottomElement = storyContainer.lastElementChild;
        return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
    }

    // Remove all elements that match the given selector. Used for removing choices after
    // you've picked one, as well as for the CLEAR and RESTART tags.
    function removeAll(selector) {
        var allElements = storyContainer.querySelectorAll(selector);
        for (var i = 0; i < allElements.length; i++) {
            var el = allElements[i];
            el.parentNode.removeChild(el);
        }
    }

    // Used for hiding and showing the header when you CLEAR or RESTART the story respectively.
    function setVisible(selector, visible) {
        var allElements = storyContainer.querySelectorAll(selector);
        for (var i = 0; i < allElements.length; i++) {
            var el = allElements[i];
            if (!visible)
                el.classList.add("invisible");
            else
                el.classList.remove("invisible");
        }
    }

    // Helper for parsing out tags of the form:
    //  # PROPERTY: value
    // e.g. IMAGE: source path
    function splitPropertyTag(tag) {
        var propertySplitIdx = tag.indexOf(":");
        if (propertySplitIdx != null) {
            var property = tag.substr(0, propertySplitIdx).trim();
            var val = tag.substr(propertySplitIdx + 1).trim();
            return {
                property: property,
                val: val
            };
        }

        return null;
    }

    // Loads save state if exists in the browser memory
    function loadState() {

        try {
            var loaded = true;

            let savedState = window.localStorage.getItem('save-state');
            if (savedState) {
                story.state.LoadJson(savedState);
            }
            else {
                loaded = false;
            }

            if (loaded) {
                var savedStorylet = window.localStorage.getItem('save-storylets');
                if (savedStorylet) {
                    storylets.LoadJson(savedStorylet);
                }
                else {
                    loaded = false;
                }
            }

            return loaded;
        } catch (e) {
            console.debug("Couldn't load save state");
        }
        return false;
    }

    function saveState() {
        try {
            window.localStorage.setItem('save-state', savePoint);
            window.localStorage.setItem('save-storylets', storylets.SaveJson());
        } catch (e) {
            console.warn("Couldn't save state");
        }

    }

    // Used to hook up the functionality for global functionality buttons
    function setupButtons(hasSave) {

        let rewindEl = document.getElementById("rewind");
        if (rewindEl) rewindEl.addEventListener("click", function (event) {
            removeAll("p");
            removeAll("img");
            setVisible(".header", false);
            restart();
        });

        let saveEl = document.getElementById("save");
        if (saveEl) saveEl.addEventListener("click", function (event) {
            saveState();
            document.getElementById("reload").removeAttribute("disabled");
        });

        let reloadEl = document.getElementById("reload");
        if (!hasSave) {
            reloadEl.setAttribute("disabled", "disabled");
        }
        reloadEl.addEventListener("click", function (event) {
            if (reloadEl.getAttribute("disabled"))
                return;

            removeAll("p");
            removeAll("img");
            loadState();
            continueStory(true);
        });
    }

})(storyContent);
