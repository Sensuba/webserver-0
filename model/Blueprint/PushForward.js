var Bloc = require('./Bloc');
var Types = require('./Types');

class PushForward extends Bloc {

	constructor (src, ctx) {

		super("pushforward", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].pushForward();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = PushForward;