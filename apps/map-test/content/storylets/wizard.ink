~ add_deck("wizard")
VAR am_wizard = false

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _wizard() ===
// Because this doesn't depend on the current map, wizard stories could happen anywhere!
~ return am_wizard

=== wizard_visit_library ===
#desc: Read the Wizard Library Shelves
#loc: library
Now you're a wizard, you can read what's on the library shelves!
Let's say you've read them all. No need to come back again.
-> END

=== wizard_cave ===
#st-repeat: true
#desc: Search the Magic Cave
#loc: cave
This is the magic cave, which only wizards can search!
+ [Go into the cave.]
    ~ set_map("cave")
-
You go into the cave.
-> END

=== wizard_home_wizard ===
#desc: A Visit Back Home
#loc: east
Home looks different now you're a wizard.
-> END