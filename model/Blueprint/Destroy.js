var Bloc = require('./Bloc');
var Types = require('./Types');

class Destroy extends Bloc {

	constructor (src, ctx) {

		super("destroy", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].destroy();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Destroy;