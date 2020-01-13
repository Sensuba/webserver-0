
class Script {

	constructor (mission) {

		this.data = require("./chapters/" + mission.mission + "/" + mission.chapter + ".json");
	}
}

module.exports = Script;

/*

BASICS

YOU 0/2000
no hand
OPN 0/1200, start
no hand

___opn
mana up
{ phase: 0,  }
300/300
___you
draw 400/400
["Your opponent played a figure that will fight for him. Summon your own figures to respond."]
[ highlight mana bar ]
["You need mana to play cards. Your mana jauge is empty right now."]
[ hightlight hero ]
["Select you hero and create a mana receptacle. You need at least that to play cards."]
mana up
[ highlight figure ]
["This figure cost 1 mana to play. Select the card then the tile you want to summon them on."]
play 400/400
["Your figure will be able to act next turn. End your turn for now."]
___opn
mana up
attack
play 600/400
___you
draw 600/600
[ highlight your figure ]
[ "When figures do fight, each one loses HP equal to the opponent's ATK. If one's HP reach 0, the character dies." ]
[ "Your figure has been damaged and only has 100 HP left." ]
[ highlight hero ]
[ "You need more mana to make strong plays. Do not forget to create a mana receptacle every turn." ]
mana up
play 600/600
[ highlight figure ]
[ "The figure you summoned has to wait one turn, but the one you summoned last turn can act. Attack the enemy figure!" ]
attack
___opn
mana up
fire whirl
___you
draw "draw 2"
[ highlight spell ]
[ "Hey, that's a spell. Cast it to resolve its effect instantly."]
mana up
attack
play draw 2
draw 400/400
draw "1000 damage"
play 400/400
___opn
mana up
play 600/400
___you
draw 600/600
win

*/