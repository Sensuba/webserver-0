var Reader = require('../model/Blueprint/Reader');

class Script {

	constructor (mission) {

		this.data = require("./chapters/" + mission.mission + "/" + mission.chapter + ".json");
	}

	rule (game) {

		game.areas[0].hero.scripts = [];
		this.data.events.forEach(event => {
			Reader.read(event, game.areas[0].hero);
			game.areas[0].hero.scripts.push(event);
		});
	}
}

module.exports = Script;