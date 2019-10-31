var Bloc = require('./Bloc');
var Types = require('./Types');

class ExtraMana extends Bloc {

	constructor (src, ctx) {

		super("extramana", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].manapool.addExtraMana(ins[1]);
			return [];
		};
		this.types = [Types.area, Types.int];
	}
}

module.exports = ExtraMana;