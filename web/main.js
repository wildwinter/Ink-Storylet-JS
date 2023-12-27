import { Storylets } from "../engine/storylets.js"

var storyRoot = document.querySelector('#story');
var storyletRoot = document.querySelector("#storylets")

// Load Ink story.
var story = new inkjs.Story(storyContent);

// Set up Storylets
var storylets = new Storylets(story);

// Do this when the storylet availability check is completed
storylets.onUpdated = onStoryletsUpdated;

// Kick off storylet processing which will take at least a frame.
updateStorylets();

function updateStorylets() {
    storylets.StartUpdate();
    removeAllChildren(storyletRoot);
    var para = document.createElement('h2');
    para.innerHTML = "Updating Storylets";
    storyletRoot.appendChild(para);
}

function scrollToBottom() {
    storyRoot.scrollTop = storyRoot.scrollHeight;
}

function onStoryletsUpdated() {

    removeAllChildren(storyletRoot);

    var para = document.createElement('h2');
    para.innerHTML = "Available Storylets";
    storyletRoot.appendChild(para);
    addButtons();

    if (storylets.GetAvailable().length == 0) {
        para = document.createElement('p');
        para.innerHTML = "No storylets available. Story ended!"
        storyletRoot.appendChild(para);
        return;
    }

    para = document.createElement('p');
    para.innerHTML = "Pick a storylet to play:";
    storyletRoot.appendChild(para);

    storylets.GetAvailable().forEach(function (storyletName) {

        // Create paragraph with anchor element
        var para = document.createElement('p');
        para.classList.add("storylet");
        var content = `<a href='#'>${storyletName}</a>`;
        var desc = storylets.getStoryletTag(storyletName, "desc", null);
        if (desc != null)
            content += `<div class="desc">${desc}</div>`;

        para.innerHTML = content;

        storyletRoot.appendChild(para);

        // Click on choice
        var paraAnchor = para.querySelectorAll("a")[0];
        paraAnchor.addEventListener("click", function (event) {

            // Don't follow <a> link
            event.preventDefault();

            // Tell the story where to go next
            chooseStorylet(storyletName);
        });
    });
}

function chooseStorylet(storyletName) {
    storylets.ChooseStorylet(storyletName);
    removeAllChildren(storyletRoot);
    var para = document.createElement('h2');
    para.innerHTML = "Running story...";
    storyletRoot.appendChild(para);
    runInk();
}

function runInk() {

    while (story.canContinue) {

        // Get ink to generate the next paragraph
        var paragraphText = story.Continue();

        // Create paragraph element (initially hidden)
        var para = document.createElement('p');
        para.innerHTML = paragraphText;
        storyRoot.appendChild(para);
    }

    if (story.currentChoices.length == 0) {
        updateStorylets();
        return;
    }

    // Create HTML choices from ink choices
    story.currentChoices.forEach(function (choice) {

        // Create paragraph with anchor element
        var para = document.createElement('p');
        para.classList.add("choice");
        para.innerHTML = `<a href='#'>${choice.text}</a>`
        storyRoot.appendChild(para);

        // Click on choice
        var paraAnchor = para.querySelectorAll("a")[0];
        paraAnchor.addEventListener("click", function (event) {

            // Don't follow <a> link
            event.preventDefault();

            chooseChoice(choice.index);
        });
    });

    scrollToBottom();
}

function chooseChoice(index) {
    story.ChooseChoiceIndex(index);
    runInk();
}

function reset() {
    story.ResetState();
    storylets.Reset();

    removeAllChildren(storyRoot);

    updateStorylets();
}

function addButtons() {
    let para = document.createElement('p');
    para.addEventListener("click", function (event) {
        reset();
    });
    var content = `<a href='#'>Restart</a>`;
    para.innerHTML = content;
    storyletRoot.appendChild(para);
    var paraAnchor = para.querySelectorAll("a")[0];
    paraAnchor.addEventListener("click", function (event) {

        // Don't follow <a> link
        event.preventDefault();

        reset();
    });
}

function removeAllChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}