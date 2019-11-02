var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterStats extends Bloc {

	constructor (src, ctx) {

		super("filterstats", src, ctx);
		this.f = (src, ins) => {

			var parsing = value => isNaN(value) ? parseInt(value, 10) : value;
			var checkmana = target => (ins[0] === null || (target.mana && parsing(target.mana) >= ins[0])) && (ins[1] === null || (target.mana && parsing(target.mana) <= ins[1]));
			var checkatk = target => (ins[2] === null || (target.atk && parsing(target.atk) >= ins[2])) && (ins[3] === null || (target.mana && parsing(target.atk) <= ins[3]));
			var checkhp = target => (ins[4] === null || (target.hp && parsing(target.hp) >= ins[4])) && (ins[5] === null || (target.hp && parsing(target.hp) <= ins[5]));
			var checkrange = target => (ins[6] === null || (target.range && parsing(target.range) >= ins[6])) && (ins[7] === null || (target.range && parsing(target.range) <= ins[7]));
			var cardfilter = target => checkmana(target) && checkatk(target) && checkhp(target) && checkrange(target);
			
			return [cardfilter, cardfilter];
		};
		this.types = [Types.int, Types.int, Types.int, Types.int, Types.int, Types.int, Types.int, Types.int];
	}
}

module.exports = FilterStats;