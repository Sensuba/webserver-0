var Bloc = require('./Bloc');
var Types = require('./Types');

class StoreInteger extends Bloc {

	constructor (src, ctx) {

		super("writeintvar", src, ctx, true);
		this.f = (src, ins) => {
			(ins[2] || src).setVariable(ins[0], ins[1]);
			return [];
		};
		this.types = [Types.string, Types.int, Types.card];
	}
}

module.exports = StoreInteger;