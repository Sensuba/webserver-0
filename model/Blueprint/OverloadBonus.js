var Bloc = require('./Bloc');

class OverloadBonus extends Bloc {

	constructor (src, ctx) {

		super("olbonus", src, ctx);
		this.f = (src, ins) => [0];
	}
}

module.exports = OverloadBonus;