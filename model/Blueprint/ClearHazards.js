var Bloc = require('./Bloc');
var Types = require('./Types');

class ClearHazards extends Bloc {

	constructor (src, ctx) {

		super("clearhazards", src, ctx);
		this.f = (src, ins) => {
			delete ins[0].clearHazards();
			return [];
		};
		this.types = [Types.tile];
	}
}

module.exports = ClearHazards;