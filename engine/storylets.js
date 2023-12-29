
function GetAllKnotIDs(story) {
    // This is a hack which works on the current
    // Ink runtime but beware!
    var knotList = [];

    var mainContentContainer = story.mainContentContainer;
    if (mainContentContainer == null)
        return knotList;

    var keys = mainContentContainer.namedOnlyContent.keys();

    for (const item of keys) {
        knotList.push(item);
    }

    return knotList;
}

class DeckContents {
    storyletNames = [];
}

class StoryletStats {
    used = false;
    tags = {};

    load(savedObj) {
        this.used = savedObj;
    }

    save() {
        return this.used;
    }
}

export class Storylets {

    // Number of storylets to requery every update frame.
    static UPDATE_COUNT = 10;
    // MS between update frames
    static UPDATE_RATE_MS = 16;

    #story = null;
    #decks = {};
    #available = [];
    #knotNames = [];
    #stats = {};
    #rebuildList = [];
    onUpdated = null;
    #updateRunning = null;

    constructor(story) {
        this.#story = story;
        this.#bindFunctions();
        this.#init()
    }

    #bindFunctions() {
        this.#story.BindExternalFunction("add_deck", (deck_name) => this.#i_add_deck(deck_name));
    }

    #init() {
        // Chew through Ink to give it a chance to set up vars and call
        // starts of .ink files etc.
        this.#story.ContinueMaximally();

        // Grab all the knot IDs in the whole Ink story.
        this.#knotNames = GetAllKnotIDs(this.#story);

        // For each Deck added, build a list of storylets.
        this.#buildDecks();
    }

    // ------------------------- Ink External Functions ------------------------

    #i_add_deck(deckName) {
        //console.log("Add deck:" + deckName);
        this.#decks[deckName] = new DeckContents();
    }

    // -------------------------------------------------------------------------

    #buildDecks() {
        for (const deckName in this.#decks) {
            var storyletNames = [];

            for (const knotName of this.#knotNames) {
                if (!knotName.startsWith(deckName))
                    continue;

                storyletNames.push(knotName);
                this.#readTags(knotName);
            }

            this.#decks[deckName].storyletNames = storyletNames;
            //console.log("DECK:" + deckName);
            //console.log(deckKnots.join());
        }
    }

    Reset() {
        this.#decks = {};
        this.#available = [];
        this.#knotNames = [];
        this.#stats = {};
        this.#rebuildList = [];
        this.#cancelUpdate();
        this.#init();
        this.StartUpdate();
    }

    ListDecks() {
        return Object.keys(this.#decks).join();
    }

    GetAvailable() {
        return this.#available;
    }

    ChooseStorylet(storyletName) {
        this.#markStoryletUsed(storyletName);
        this.#story.ChoosePathString(storyletName);
    }

    SaveJson() {
        var saveStats = {};
        for (const key in this.#stats) {
            var stats = this.#stats[key];
            saveStats[key] = stats.save();
        }
        return JSON.stringify(saveStats);
    }

    LoadJson(saveStats) {
        var savedObject = JSON.parse(saveStats);
        for (const key in savedObject) {
            var stats = this.#getStoryletStats(key);
            stats.load(savedObject[key]);
        }
    }

    #cancelUpdate() {
        if (this.#updateRunning == null)
            return;
        clearTimeout(this.#updateRunning);
        this.#updateRunning = null;
    }

    StartUpdate() {
        this.#cancelUpdate()

        this.#rebuildList = [];
        this.#available = [];

        for (const deckName in this.#decks) {
            var deckAvailable = this.#checkDeckAvailable(deckName);
            //console.log("Deck " + deckName + " available:" + deckAvailable);

            if (!deckAvailable)
                continue;

            const deck = this.#decks[deckName];

            for (const storyletName of deck.storyletNames) {
                this.#rebuildList.push(storyletName);
            }
        }
        var rcv = this;
        this.#updateRunning = setTimeout(function () { rcv.#processUpdateChunk(); }, Storylets.UPDATE_RATE_MS);
    }

    #processUpdateChunk() {
        var count = Math.min(Storylets.UPDATE_COUNT, this.#rebuildList.length);

        for (var i = 0; i < count; i++) {
            var storyletName = this.#rebuildList.shift();

            var storyletAvailable = this.#checkStoryletAvailable(storyletName)
            if (!storyletAvailable)
                continue;

            this.#available.push(storyletName);
        }

        if (this.#rebuildList.length > 0) {
            var rcv = this;
            this.#updateRunning = setTimeout(function () { rcv.#processUpdateChunk(); }, Storylets.UPDATE_RATE_MS);
            return;
        }
        this.#updateRunning = null;
        if (this.onUpdated != null)
            this.onUpdated();
    }

    // Call the _<deckName>() function. If true, the storylets in this deck
    // will be checked and included.
    #checkDeckAvailable(deckName) {
        var fnName = "_" + deckName;
        if (!this.#knotNames.includes(fnName)) {
            console.error("Deck function: " + fnName + " is missing.");
            return false;
        }
        return this.#story.EvaluateFunction(fnName);
    }

    // Call the _<storyletName>() function. If true, the storylet will be included.
    // If it doesn't exist, true is assumed.
    #checkStoryletAvailable(storyletName) {

        var shouldRepeat = this.getStoryletTag(storyletName, "st-repeat", false);
        if (!shouldRepeat) {

            // One-use only
            if (this.#isStoryletUsed(storyletName))
                return false;
        }

        var fnName = "_" + storyletName;

        // Default - storylet is available if the function doesn't exist
        if (!this.#knotNames.includes(fnName)) {
            return true;
        }

        return this.#story.EvaluateFunction(fnName);
    }

    #getStoryletStats(storyletName) {
        if (!this.#stats.hasOwnProperty(storyletName)) {
            this.#stats[storyletName] = new StoryletStats();
        }
        return this.#stats[storyletName];
    }

    #markStoryletUsed(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        stats.used = true;
    }

    #isStoryletUsed(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        return stats.used;
    }

    #getStoryletTags(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        return stats.tags;
    }

    getStoryletTag(storyletName, tagName, defaultValue) {
        var tags = this.#getStoryletTags(storyletName);
        if (!tags.hasOwnProperty(tagName))
            return defaultValue;
        return tags[tagName];
    }

    #readTags(storyletName) {
        var stats = this.#getStoryletStats(storyletName);

        var tags = {};
        var inTags = this.#story.TagsForContentAtPath(storyletName);
        if (inTags != null) {
            for (var tag of inTags) {
                var value = true;

                if (tag.includes(":")) {
                    var parts = tag.split(":");
                    tag = parts[0].trim();
                    if (parts.length > 1) {
                        value = parts[1].trim();
                        if (value.toLowerCase() == "true")
                            value = true;
                        else if (value.toLowerCase() == "false")
                            value = false;
                    }
                }

                tags[tag] = value;
            }
        }
        stats.tags = tags;
    }
}