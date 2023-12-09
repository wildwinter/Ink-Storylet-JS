
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


export class Storylets {

    #story = null;
    #decks = {};
    #available = [];
    #knotNames = [];
    #stats = {};

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

        // Move to the entrypoint, if it exists:
        if (this.#knotNames.includes("start"))
            this.#story.ChoosePathString("start");

        // Update the available storylets.
        this.Update();

    }

    // ------------------------- Ink External Functions ------------------------

    #i_add_deck(deckName) {
        //console.log("Add deck:" + deckName);
        this.#decks[deckName] = {};
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

            this.#decks[deckName]["storyletNames"] = storyletNames;
            //console.log("DECK:" + deckName);
            //console.log(deckKnots.join());
        }
    }

    Reset() {
        this.#decks = {};
        this.#available = [];
        this.#knotNames = [];
        this.#stats = {};
        this.#init();
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

    Update() {
        this.#available = [];

        for (const deckName in this.#decks) {
            var deckAvailable = this.#checkDeckAvailable(deckName);
            //console.log("Deck " + deckName + " available:" + deckAvailable);

            if (!deckAvailable)
                continue;

            const deck = this.#decks[deckName];
            const deckKnots = deck["storyletNames"];

            for (const storyletName of deckKnots) {
                var storyletAvailable = this.#checkStoryletAvailable(storyletName)
                //console.log("Storylet " + storyletName + " available:" + storyletAvailable);

                if (!storyletAvailable)
                    continue;

                this.#available.push(storyletName);
            }

        }
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
    #checkStoryletAvailable(storyletName) {

        var shouldRepeat = this.#getStoryletTag(storyletName, "st-repeat", false);
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
            this.#stats[storyletName] = { 'used': false, 'tags': {} };
        }
        return this.#stats[storyletName];
    }

    #markStoryletUsed(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        stats['used'] = true;
    }

    #isStoryletUsed(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        return stats['used'];
    }

    #getStoryletTags(storyletName) {
        var stats = this.#getStoryletStats(storyletName);
        return stats['tags'];
    }

    #getStoryletTag(storyletName, tagName, defaultValue) {
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
        stats['tags'] = tags;
    }
}