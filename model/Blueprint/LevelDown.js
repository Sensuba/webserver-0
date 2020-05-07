var Bloc = require('./Bloc');
var Types = require('./Types');

class LevelDown extends Bloc {

	constructor (src, ctx) {

		super("leveldown", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].levelDown();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = LevelDown;