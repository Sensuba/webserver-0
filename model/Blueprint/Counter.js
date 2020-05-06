var Bloc = require('./Bloc');
var Types = require('./Types');

class Counter extends Bloc {

	constructor (src, ctx) {

		super("counter", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].counter();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Counter;