var Bloc = require('./Bloc');
var Types = require('./Types');

class PushBack extends Bloc {

	constructor (src, ctx) {

		super("pushback", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].pushBack();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = PushBack;