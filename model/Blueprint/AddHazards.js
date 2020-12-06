var Bloc = require('./Bloc');
var Types = require('./Types');

class AddHazards extends Bloc {

	constructor (src, ctx) {

		super("addhazards", src, ctx);
		this.f = (src, ins) => {
			ins[0].changeHazards(ins[1]);
			return [];
		};
		this.types = [Types.tile, Types.hazard];
	}
}

module.exports = AddHazards;