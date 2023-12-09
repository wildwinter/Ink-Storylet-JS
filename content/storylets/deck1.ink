~ add_deck("deck1")

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _deck1() ===
~ return true

=== function _deck1_storylet1() ===
~ return false
=== deck1_storylet1 ===
Deck 1, Storylet 1
-> END

=== deck1_storylet2 ===
#st-repeat: true
Deck 1, Storylet 2
+ [Choice 1]
    Hello!
+ [Choice 2]
    Goodbye!
-
-> END

=== deck1_storylet3 ===
Deck 1, Storylet 3
-> END