var Bloc = require('./Bloc');

class LimitBreak extends Bloc {

	constructor (src, ctx) {

		super("limitbrk", src, ctx);
		this.f = (src, ins) => [0];
	}
}

module.exports = LimitBreak;