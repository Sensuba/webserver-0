var Bloc = require('./Bloc');
var Types = require('./Types');

class StoreLocation extends Bloc {

	constructor (src, ctx) {

		super("writelocvar", src, ctx, true);
		this.f = (src, ins) => {
			(ins[2] || src).setVariable(ins[0], ins[1]);
			return [];
		};
		this.types = [Types.string, Types.location, Types.card];
	}
}

module.exports = StoreLocation;