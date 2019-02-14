var Bloc = require('./Bloc');
var Types = require('./Types');

class LevelUp extends Bloc {

	constructor (src, ctx) {

		super("levelup", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].levelUp();
			return [];
		};
		this.types = [Types.card];
	}
}

module.exports = LevelUp;