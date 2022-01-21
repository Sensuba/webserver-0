var Bloc = require('./Bloc');
var Types = require('./Types');

class Animation extends Bloc {

	constructor (src, ctx) {

		super("animation", src, ctx, true);
		this.f = (src, ins) => {
			src.gameboard.notify("animation", src.gameboard, { type: "string", value: ins[0] });
			return [];
		};
		this.types = [Types.string];
	}
}

module.exports = Animation;