var Bloc = require('./Bloc');
var Types = require('./Types');

class Variation extends Bloc {

	constructor (src, ctx) {

		super("variation", src, ctx);
		this.f = (src, ins) => [ x => {
			if (ins[0])
				x.mana = Math.max(0, x.mana + ins[0]);
			if (ins[1])
				x.atk = Math.max(0, x.atk + ins[1]);
			if (ins[2]) {
				x.hp = Math.max(0, x.hp + ins[2]);
				if (ins[2] < 0)
					x.negativehpmodifier = ins[2];
			}
			if (ins[3])
				x.range = Math.max(0, x.range + ins[3]);
			if (ins[4])
				x.ol = Math.max(0, x.ol + ins[4]);
			return x;
		}];
		this.types = [Types.int, Types.int, Types.int, Types.int, Types.int];
	}
}

module.exports = Variation;