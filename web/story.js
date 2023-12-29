var storyContent = ﻿{"inkVersion":20,"root":[["ev","str","^deck1","/str",{"x()":"add_deck","exArgs":1},"pop","/ev","\n","\n","ev","str","^deck2","/str",{"x()":"add_deck","exArgs":1},"pop","/ev","\n","\n","\n",["done",{"#f":5,"#n":"g-0"}],null],"done",{"add_deck":[{"temp=":"deck_name"},"^Deck added: ","ev",{"VAR?":"deck_name"},"out","/ev","\n","ev","void","/ev","~ret",{"#f":1}],"start":["^Welcome to a storylet testbed. Click on a storylet to continue!","\n","end",{"#f":1}],"_deck1":["ev",true,"/ev","~ret",{"#f":1}],"deck1_intro":[{"#":"desc: This is the intro"},"^Hi, welcome to this test.","\n","end",{"#f":1}],"_deck1_repeater":["ev",{"CNT?":"deck1_intro"},"/ev","~ret",{"#f":1}],"deck1_repeater":[[{"#":"st-repeat: true"},{"#":"desc: This is a repeating storylet."},"^I will always come back.","\n","ev","str","^Hello there...","/str","/ev",{"*":".^.c-0","flg":4},"ev","str","^Not you again!","/str","/ev",{"*":".^.c-1","flg":4},{"c-0":["\n","^Hello!","\n",{"->":".^.^.g-0"},{"#f":5}],"c-1":["\n","^Sorry! That's how I work.","\n",{"->":".^.^.g-0"},{"#f":5}],"g-0":["end",{"#f":5}]}],{"#f":1}],"_deck1_unlock":["ev",{"CNT?":"deck1_intro"},{"VAR?":"wizards_allowed"},"!","&&","/ev","~ret",{"#f":1}],"deck1_unlock":[[{"#":"st-repeat: true"},{"#":"desc: Unlocks deck 2!"},"^Do you want to be a wizard?","\n","ev","str","^Yes","/str","/ev",{"*":".^.c-0","flg":4},"ev","str","^No","/str","/ev",{"*":".^.c-1","flg":4},{"c-0":["\n","^You're a wizard!","\n","^Unlocked deck 2.","\n","ev",true,"/ev",{"VAR=":"wizards_allowed","re":true},{"->":".^.^.g-0"},{"#f":5}],"c-1":["\n","^Never mind. This will repeat now until you change your mind.","\n",{"->":".^.^.g-0"},{"#f":5}],"g-0":["end",{"#f":5}]}],{"#f":1}],"_deck2":["ev",{"VAR?":"wizards_allowed"},"/ev","~ret",{"#f":1}],"deck2_storylet1":[{"#":"desc: This is Deck 2, Storylet 1."},"^Deck 2, Storylet 1","\n","end",{"#f":1}],"deck2_storylet2":[{"#":"desc: This is Deck 2, Storylet 2."},"^Deck 2, Storylet 2","\n","end",{"#f":1}],"deck2_storylet3":[{"#":"desc: This is Deck 2, Storylet 3."},"^Deck 2, Storylet 3","\n","end",{"#f":1}],"global decl":["ev",false,{"VAR=":"wizards_allowed"},"/ev","end",null],"#f":1}],"listDefs":{}};