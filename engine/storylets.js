
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
    #decks = {}
    #available = []
    #knotNames = []

    constructor(story) {
        this.#story = story;
        this.#bindFunctions();
        this.#init()
    }

    #bindFunctions() {
        this.#story.BindExternalFunction("get_name", () => { return "Fred3"; });
        this.#story.BindExternalFunction("add_deck", (deck_name) => this.#i_add_deck(deck_name));
    }

    #init() {
        this.#story.ContinueMaximally();
        console.log("Decks after init:" + Object.keys(this.#decks).length);
        this.#knotNames = GetAllKnotIDs(this.#story);
        this.#buildDecks();
        this.Update();
    }

    #i_add_deck(deckName) {
        console.log("Add deck:" + deckName);
        this.#decks[deckName] = {};
    }

    #buildDecks() {
        for (const deckName in this.#decks) {
            var deckKnots = [];

            for (const knotName of this.#knotNames) {
                if (knotName.startsWith(deckName)) {
                    deckKnots.push(knotName);
                }
            }

            this.#decks[deckName]["storyletNames"] = deckKnots;
            console.log("DECK:" + deckName);
            console.log(deckKnots.join());
        }
    }

    ListDecks() {
        return Object.keys(this.#decks).join();
    }

    ListAvailable() {
        return this.#available.join();
    }

    Update() {
        this.#available = [];

        for (const deckName in this.#decks) {
            var deckAvailable = this.#checkDeckAvailable(deckName);
            console.log("Deck " + deckName + " available:" + deckAvailable);

            if (!deckAvailable)
                continue;

            const deck = this.#decks[deckName];
            const deckKnots = deck["storyletNames"];

            for (const storyletName of deckKnots) {
                var storyletAvailable = this.#checkStoryletAvailable(storyletName)
                console.log("Storylet " + storyletName + " available:" + storyletAvailable);

                if (!storyletAvailable)
                    continue;

                this.#available.push(storyletName);
            }

        }
    }

    #checkDeckAvailable(deckName) {
        var fnName = "_" + deckName;
        if (!this.#knotNames.includes(fnName)) {
            console.error("Deck function: " + fnName + " is missing.");
            return false;
        }
        return this.#story.EvaluateFunction(fnName);
    }

    #checkStoryletAvailable(storyletName) {
        var fnName = "_" + storyletName;

        // Default - storylet is available if the function doesn't exist
        if (!this.#knotNames.includes(fnName)) {
            return true;
        }

        return this.#story.EvaluateFunction(fnName);
    }
}