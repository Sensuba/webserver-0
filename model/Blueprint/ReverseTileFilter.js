var Bloc = require('./Bloc');
var Types = require('./Types');

class ReverseTileFilter extends Bloc {

	constructor (src, ctx) {

		super("revtfilter", src, ctx);
		this.f = (src, ins) => [(src, target) => !ins[0](src, target)];
		this.types = [Types.tilefilter];
	}
}

module.exports = ReverseTileFilter;