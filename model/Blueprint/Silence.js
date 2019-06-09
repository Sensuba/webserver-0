var Bloc = require('./Bloc');
var Types = require('./Types');

class Silence extends Bloc {

	constructor (src, ctx) {

		super("silence", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].silence();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = Silence;