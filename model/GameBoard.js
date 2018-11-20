var Area = require("./Area");

class GameBoard {

	constructor () {

		this.id = { type: "gameboard", no: 0 };

		this.notify = () => {};
		this.whisper = () => {};
	}

	init (d1, d2) {

		this.data = {
			cards: []
		}

		this.areas = [
			new Area(0, d1, this),
			new Area(1, d2, this)
		];
	}

	start (area) {

		this.notify("start", this.id);
		area = area || this.areas[Math.floor(Math.random()*2)];
		this.currentArea = area;
		this.currentArea.draw (4);
		this.currentArea.opposite.draw (5);
		//otherArea.duellist.manapool.NewGem();
		this.currentArea.newTurn ();
		//console.log(this.currentArea.hand.cards);
	}

	get tiles() {

		return this.areas[0].field.tiles.concat(this.areas[1].field.tiles);
	}

	newTurn () {

		this.currentArea = this.currentArea.opposite;
		this.currentArea.newTurn();
	}

	command (cmd, player) {

		switch (cmd.type) {
		case "play":
			this.data.cards[cmd.id.no].play(cmd.targets ? cmd.targets.map(id => this.tiles.find(t => t.id.no === id.no)) : undefined);
			break;
		case "endturn":
			if (this.areas[player].isPlaying)
				this.newTurn();
			break;
		default: break;
		}
	}

	registerCard (card) {

		this.data.cards.push(card);
		return this.data.cards.length-1;
	}
}

module.exports = GameBoard;