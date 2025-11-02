~ add_deck("deck2")
VAR wizards_allowed = false

// If this returns false, none of the storylets
// in this deck are checked for availability.
=== function _deck2() ===
~ return wizards_allowed

=== deck2_storylet1 ===
#desc: Read the Wizard Library Shelves
#loc: library
Now you're a wizard, you can read what's on the library shelves!
Let's say you've read them all. No need to come back again.
-> END

=== deck2_storylet2 ===
#desc: Search the Magic Cave
#loc: cave
This is the magic cave, which only wizards can search!
Inside you find nothing much.
-> END

=== deck2_storylet3 ===
#desc: A Visit Back Home
#loc: east
Home looks different now you're a wizard.
-> END