~ add_deck("deck1")

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _deck1() ===
~ return true

=== deck1_intro ===
#desc: This is the intro
Hi, welcome to this test.
-> END

=== function _deck1_repeater() ===
// Taking advantage of the Ink built in  - a knot is also a count of playing that knot!
// So this returns true if deck1_intro has been played.
~ return deck1_intro
=== deck1_repeater ===
#st-repeat: true
#desc: This is a repeating storylet.
I will always come back.
+ [Hello there...]
    Hello!
+ [Not you again!]
    Sorry! That's how I work.
-
-> END

=== function _deck1_unlock() ===
// Taking advantage of the Ink built in  - a knot is also a count of playing that knot!
// So this returns true if deck1_intro has been played.
~ return deck1_intro and not wizards_allowed
=== deck1_unlock ===
#st-repeat: true
#desc: Unlocks deck 2!
Do you want to be a wizard?
+ [Yes]
    You're a wizard!
    Unlocked deck 2.
    ~ wizards_allowed = true
+ [No]
    Never mind. This will repeat now until you change your mind.
-
-> END