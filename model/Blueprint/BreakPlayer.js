var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakPlayer extends Bloc {

	constructor (src, ctx) {

		super("brkplayer", src, ctx);
		this.f = (src, ins) => [ins[0].field.tiles, ins[0].hand, ins[0].deck, ins[0].opposite, ins[0].isPlaying];
		this.types = [Types.area];
	}
}

module.exports = BreakPlayer;