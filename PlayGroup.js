
class PlayGroup {

	constructor () {

		this.plays = [];
	}

	push (play) {

		this.plays.push(play);
	}

	get empty () {

		return this.plays.length === 0;
	}

	get valued () {

		return this.plays.every(p => p.valued);
	}
}

module.exports = PlayGroup;