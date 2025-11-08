~ add_deck("cave")

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _cave() ===
~ return get_map()=="cave"

=== cave_exit ===
#st-repeat: true
#desc: Leave the cave
#loc: exit
+ [Leave the cave.]
    ~ set_map("main")
-
You go back into the world.
-> END

=== cave_well ===
#st-repeat: true
#desc: Examine the well
#loc: well
The well is dry.
-> END