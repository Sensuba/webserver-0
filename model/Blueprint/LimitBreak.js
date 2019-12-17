var Bloc = require('./Bloc');

class LimitBreak extends Bloc {

	constructor (src, ctx) {

		super("limitbrk", src, ctx);
		this.f = (src, ins) => [ src.eff.lb || (src.eff.overload && src.eff.ol && src.eff.ol > src.eff.overload ? Math.floor(src.eff.ol/src.eff.overload) : 0) ];
	}
}

module.exports = LimitBreak;