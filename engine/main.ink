INCLUDE ../content/storylets.ink

EXTERNAL get_name()
EXTERNAL add_deck(deck_name)

=== function get_name() ===
~ return "No name"

=== function add_deck(deck_name) ===
Deck added: {deck_name}
~ return

=== main ===
Once upon a time.
There was a storylet system.
{get_name()}
-> DONE