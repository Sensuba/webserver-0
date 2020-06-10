
class DuelData {

	constructor () {

		this.gameplan = { pressure: 0.5, control: 0.5, development: 0.5, value: 0.5, invest: 0.5 }
	}

	setupGameplan (gameplan) {

		this.gameplan = Object.assign(this.gameplan, gameplan);
	}
}

module.exports = DuelData;