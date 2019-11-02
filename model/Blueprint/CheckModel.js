var Bloc = require('./Bloc');
var Types = require('./Types');

class CheckModel extends Bloc {

	constructor (src, ctx) {

		super("checkmodel", src, ctx);
		this.f = (src, ins) => [ins[1](ins[0])];
		this.types = [Types.model, Types.modelfilter];
	}
}

module.exports = CheckModel;