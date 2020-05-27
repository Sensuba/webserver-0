var AI = require("./AI");

class TrainingAI extends AI {

	constructor (gameboard, no) {

		super(gameboard, no);
		this.deck = this.generateDeck();
	}

	act () {

		return { type: "endturn" };
	}

	generateDeck () {

		return {
		  hero: 1,
		  body: [
		    103, 103, 105, 105, 117,
		    117, 126, 126, 130, 130,
		    132, 132, 150, 150, 325,
		    325, 157, 157, 160, 160,
		    177, 177, 108, 108, 302,
		    302, 328, 328, 336, 336
		  ]
		}
	}
}

module.exports = TrainingAI;