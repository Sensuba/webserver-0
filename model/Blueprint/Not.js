var Bloc = require('./Bloc');
var Types = require('./Types');

class Not extends Bloc {

	constructor (src, ctx) {

		super("opnot", src, ctx);
		this.f = (src, ins) => [!ins[0]];
		this.types = [Types.bool];
	}
}

module.exports = Not;