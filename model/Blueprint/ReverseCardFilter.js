var Bloc = require('./Bloc');
var Types = require('./Types');

class ReverseCardFilter extends Bloc {

	constructor (src, ctx) {

		super("revcfilter", src, ctx);
		this.f = (src, ins) => [target => !ins[0](target)];
		this.types = [Types.cardfilter];
	}
}

module.exports = ReverseCardFilter;