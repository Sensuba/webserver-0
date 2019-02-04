var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakLocation extends Bloc {

	constructor (src, ctx) {

		super("brklocation", src, ctx);
		this.f = (src, ins) => [ins[0].area, ins[0].count, ins[0].isEmpty];
		this.types = [Types.location];
	}
}

module.exports = BreakLocation;