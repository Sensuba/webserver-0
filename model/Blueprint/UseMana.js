var Bloc = require('./Bloc');
var Types = require('./Types');

class UseMana extends Bloc {

	constructor (src, ctx) {

		super("usemana", src, ctx, true);
		this.f = (src, ins) => [ins[0].manapool.use(ins[1])];
		this.types = [Types.area, Types.int];
	}
}

module.exports = UseMana;