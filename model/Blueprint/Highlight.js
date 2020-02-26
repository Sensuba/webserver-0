var Bloc = require('./Bloc');
var Types = require('./Types');

class Highlight extends Bloc {

	constructor (src, ctx) {

		super("highlight", src, ctx, true);
		this.f = (src, ins) => this.src.gameboard.whisper("highlight", ins[1].id.no, ins[0].id);
		this.types = [Types.card, Types.area];
	}
}

module.exports = Highlight;