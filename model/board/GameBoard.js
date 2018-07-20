var Area = require("./Area");

class GameBoard {

	constructor (d1, d2) {

		this.id = { type: "gameboard", no: 0 };

		this.data = {
			cardIds: 0
		}

		this.areas = [
			new Area(0, d1, this),
			new Area(1, d2, this)
		];

		this.notify = () => {};
	}

	start (area) {

		area = area || this.areas[Math.floor(Math.random()*2)];
		this.currentArea = area;
		this.currentArea.draw (4);
		this.currentArea.opposite.draw (5);
		//otherArea.duellist.manapool.NewGem();
		this.currentArea.newTurn ();
		//console.log(this.currentArea.hand.cards);
	}

	newTurn () {

		this.currentArea = currentArea.opposite;
		this.currentArea.newTurn();
	}

	getCardId () {

		return this.data.cardIds++;
	}
}

module.exports = GameBoard;