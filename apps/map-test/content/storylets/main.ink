~ add_deck("main")

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _main() ===
~ return get_map()=="main"

=== main_start ===
#desc: The Beginning
#loc: east
This is the starting point of your adventure, in the East house.
-> END

=== function _main_bar() ===
// Taking advantage of the Ink built in - a knot is also a count of playing that knot!
// So this returns true if main_start has been played.
~ return main_start

=== main_bar ===
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

=== function _main_library() ===
~ return main_start and not am_wizard

=== main_library ===
#st-repeat: true
#desc: Read the Magic Book
#loc: library
Do you want to read the magic book?
+ [Yes.]
    Congratulations, you're a wizard!
    We've unlocked so much more to do! (Unlocked wizard storylets.)
    ~ am_wizard = true
+ [No.]
    Never mind. But you can always come back here and read it later. (Repeating storylet.)
-
-> END