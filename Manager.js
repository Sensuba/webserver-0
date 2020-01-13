var GameBoard = require('./model/GameBoard');

class Manager {

	constructor (type) {

		this.type = type;
		this.game = new GameBoard();
	}

	start () {

		this.started = true;
	}

	finish () {

		this.game.ended = true;
	}

	get finished () {

		return this.game.ended;
	}
}

module.exports = Manager;