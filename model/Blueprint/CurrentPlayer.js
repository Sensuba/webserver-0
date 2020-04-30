var Bloc = require('./Bloc');

class CurrentPlayer extends Bloc {

	constructor (src, ctx) {

		super("current", src, ctx);
		this.f = (src, ins) => [ src.gameboard.currentArea ];
		this.types = [];
	}
}

module.exports = CurrentPlayer;