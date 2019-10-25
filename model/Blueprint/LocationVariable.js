var Bloc = require('./Bloc');
var Types = require('./Types');

class LocationVariable extends Bloc {

	constructor (src, ctx) {

		super("locvar", src, ctx, true);
		this.f = (src, ins) => [src.getVariable(ins[0]), src.getVariable(ins[0]) !== undefined];
		this.types = [Types.string];
	}
}

module.exports = LocationVariable;