var Bloc = require('./Bloc');
var Types = require('./Types');

class Data extends Bloc {

	constructor (name, src, ctx, d) {

		super(name, src, ctx);
		this.f = (src, ins) => d(ins[0]);
		this.types = [Types.data];
	}
}

module.exports = Data;