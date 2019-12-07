var Bloc = require('./Bloc');
var Types = require('./Types');

class ClearVariable extends Bloc {

	constructor (src, ctx) {

		super("clearvar", src, ctx, true);
		this.f = (src, ins) => {
			(ins[1] || src).clearVariable(ins[0]);
			return [];
		};
		this.types = [Types.string, Types.card];
	}
}

module.exports = ClearVariable;