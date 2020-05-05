var Bloc = require('./Bloc');
var Types = require('./Types');

class Wait extends Bloc {

	constructor (src, ctx) {

		super("wait", src, ctx, true);
		this.f = (src, ins) => {
			src.gameboard.notify("wait", src.gameboard, { type: "int", value: ins[0] });
			return [];
		};
		this.types = [Types.int];
	}
}

module.exports = Wait;