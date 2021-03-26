var Bloc = require('./Bloc');
var Types = require('./Types');

class ClearHazards extends Bloc {

	constructor (src, ctx) {

		super("clearhazards", src, ctx);
		this.f = (src, ins) => {
			ins[0].clearHazards(ins[1]);
			return [];
		};
		this.types = [Types.tile, Types.hazard];
	}
}

module.exports = ClearHazards;