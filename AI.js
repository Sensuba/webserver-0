
class AI {

	constructor (gameboard, no) {

		this.gameboard = gameboard;
		this.no = no;
	}

	get area () {

		return this.gameboard ? this.gameboard.areas[this.no] : null;
	}

	act () {

		return null;
	}
}

module.exports = AI;