var Bloc = require('./Bloc');
var Types = require('./Types');

class ReverseModelFilter extends Bloc {

	constructor (src, ctx) {

		super("revmfilter", src, ctx);
		this.f = (src, ins) => [target => !ins[0](target)];
		this.types = [Types.modelfilter];
	}
}

module.exports = ReverseModelFilter;