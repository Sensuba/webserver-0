var Bloc = require('./Bloc');
var Event = require('../Event');

class Play extends Bloc {

	constructor (src, ctx) {

		super("play", src, ctx);
	}

	setup () {

		this.src.event = new Event(() => this.execute(), null);
	}
}

module.exports = Play;