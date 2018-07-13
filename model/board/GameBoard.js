var Area = require("./Area");

class GameBoard {

	constructor (d1, d2) {

		this.id = { type: "gameboard", "no": 0 };

		this.data = {
			cardIds: 0
		}

		this.areas = [
			new Area(0, d1, this),
			new Area(1, d2, this)
		];
	}

	getCardId () {

		return this.data.cardIds++;
	}
}

module.exports = GameBoard;