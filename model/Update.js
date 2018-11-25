var Card = require("./Card");

class Update {

	constructor (event, gameboard) {

		this.event = event;
		this.gameboard = gameboard;
		this.gameboard.updates.push(this);
	}

	trigger () {

		this.gameboard.updates.shift();
		this.event();
	}
}

module.exports = Update;