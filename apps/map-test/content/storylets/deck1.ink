~ add_deck("deck1")

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _deck1() ===
~ return true

=== deck1_intro ===
#desc: The Beginning
#loc: east
This is the starting point of your adventure, in the East house.
-> END

=== function _deck1_repeater() ===
// Taking advantage of the Ink built in  - a knot is also a count of playing that knot!
// So this returns true if deck1_intro has been played.
~ return deck1_intro
=== deck1_repeater ===
#st-repeat: true
#desc: A Night in the Bar
#loc: bar
You can always have another drink.
(Repeating storylet!)
+ [Have a drink...]
    (drinking noise) Mmm, lovely.
+ [Not this time...]
    See you next time, buddy!
-
-> END

=== function _deck1_unlock() ===
// Taking advantage of the Ink built in  - a knot is also a count of playing that knot!
// So this returns true if deck1_intro has been played.
~ return deck1_intro and not wizards_allowed

=== deck1_unlock ===
#st-repeat: true
#desc: Read the Magic Book
#loc: library
Do you want to read the magic book?
+ [Yes.]
    Congratulations, you're a wizard!
    We've unlocked so much more to do! (Unlocked deck 2.)
    ~ wizards_allowed = true
+ [No.]
    Never mind. But you can always come back here and read it later. (Repeating storylet.)
-
-> END