~ add_deck("deck2")
VAR wizards_allowed = false

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _deck2() ===
~ return wizards_allowed

=== deck2_storylet1 ===
#desc: This is Deck 2, Storylet 1.
#loc: library
Deck 2, Storylet 1
-> END

=== deck2_storylet2 ===
#desc: This is Deck 2, Storylet 2.
#loc: cave
Deck 2, Storylet 2
-> END

=== deck2_storylet3 ===
#desc: This is Deck 2, Storylet 3.
#loc: east
Deck 2, Storylet 3
-> END