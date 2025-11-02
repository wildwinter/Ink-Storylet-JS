import { Storylets } from "../../../engine/storylets.js"
import { MapSymbolManager } from "./map.js"

// Set up map first
// -----------------------

const handleSymbolClick = (id, title) => {
    //console.log(`Symbol clicked: ${title} (ID: ${id})`);
    
    const storylet = storylets.GetAvailableStoryletsWithTag("loc", id)[0];
    chooseStorylet(storylet);
};

MapSymbolManager.init("#map-container", handleSymbolClick);

MapSymbolManager.addSymbol({left: "40%", top: "25%", id: "town_hall", title: "Town Hall 🏛️", description: "The civic heart of the town. Built in 1898."});
MapSymbolManager.addSymbol({left: "77%", top: "37%", id: "library", title: "The Library 📚", description: "Historic records and modern media center."});
MapSymbolManager.addSymbol({left: "71.5%", top: "85%", id: "east", title: "East House 🏠", description: "House belonging to the East family."});
MapSymbolManager.addSymbol({left: "22%", top: "62%", id: "bar", title: "Frog & Horses 🍺", description: "Local bar and club."});
MapSymbolManager.addSymbol({left: "56%", top: "35%", id: "cave", title: "A Cave 🌊", description: "Cave which the river disappears into."});

// -----------------------
var storyRoot = document.querySelector('#story');

// Load Ink story.
var story = new inkjs.Story(storyContent);

// Set up Storylets
var storylets = new Storylets(story);

// Do this when the storylet availability check is completed
storylets.onUpdated = onStoryletsUpdated;

// Add a reset button
const resetButtonContainer = document.getElementById('reset-container');
const resetButton = document.createElement('button');
resetButton.textContent = "Reset Story";
resetButton.addEventListener('click', reset);
resetButtonContainer.appendChild(resetButton);

// Kick off storylet processing which will take at least a frame.
updateStorylets();

function updateStorylets() {
    storylets.StartUpdate();
}

function scrollToBottom() {
    storyRoot.scrollTop = storyRoot.scrollHeight;
}

function onStoryletsUpdated() {

    MapSymbolManager.iterateSymbols(function(symbolElement, locationId) {
        // Show or hide symbol based on storylet availability
        const available = storylets.GetFirstAvailableStoryletWithTag("loc", locationId);
        if (available) {
            MapSymbolManager.setSymbolDesc(locationId, storylets.getStoryletTag(available, "desc", ""));
            MapSymbolManager.showSymbol(locationId);
        } else {
            MapSymbolManager.hideSymbol(locationId);
        }
    });

    if (storylets.GetAvailable().length == 0) {
        alert("Story complete! Close this to reset.");
        reset();
        return;
    }
}

function chooseStorylet(storyletName) {
    MapSymbolManager.lockMap();
    storylets.ChooseStorylet(storyletName);
    
    var para = document.createElement('h3');
    para.innerHTML = storylets.getStoryletTag(storyletName, "desc", "--");
    storyRoot.appendChild(para);

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
        // Ink complete

        var hr = document.createElement('hr');
        storyRoot.appendChild(hr);

        MapSymbolManager.unlockMap();

        updateStorylets();
        return;
    }

    var ul = document.createElement('ul');
    ul.classList.add("choices");

    // Create HTML choices from ink choices
    story.currentChoices.forEach(function (choice) {

        var para = document.createElement('li');
        para.classList.add("choice");
        para.innerHTML = `<a href='#'>${choice.text}</a>`
        ul.appendChild(para);

        // Click on choice
        var paraAnchor = para.querySelectorAll("a")[0];
        paraAnchor.addEventListener("click", function (event) {

            event.preventDefault();

            chooseChoice(choice.index);
        });
    });

    storyRoot.appendChild(ul);

    scrollToBottom();
}

function chooseChoice(index) {
    story.ChooseChoiceIndex(index);
    removeAllChildrenWith(storyRoot, ".choices");
    runInk();
}

function reset() {
    story.ResetState();
    storylets.Reset();

    MapSymbolManager.unlockMap();

    removeAllChildren(storyRoot);

    updateStorylets();
}

function removeAllChildrenWith(el, selector) {
    var elements = el.querySelectorAll(selector);
    for (var i = 0; i < elements.length; i++) {
        var child = elements[i];
        child.parentNode.removeChild(child);
    }
}

function removeAllChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}