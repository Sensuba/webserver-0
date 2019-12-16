var Bloc = require('./Bloc');
var Types = require('./Types');

class LockStats extends Bloc {

	constructor (src, ctx) {

		super("lockstats", src, ctx);
		this.f = (src, ins) => [ x => {
			if (ins[0] || ins[0] === 0)
				x.mana = Math.max(0, ins[0]);
			if (ins[1] || ins[1] === 0)
				x.atk = Math.max(0, ins[1]);
			if (ins[2] || ins[2] === 0)
				x.hp = Math.max(0, ins[2]);
			if (ins[3] || ins[3] === 0)
				x.range = Math.max(0, ins[3]);
			if (ins[4] || ins[4] === 0)
				x.ol = Math.max(0, ins[4]);
			return x;
		}];
		this.types = [Types.int, Types.int, Types.int, Types.int, Types.int];
	}
}

module.exports = LockStats;