var Bloc = require('./Bloc');
var Types = require('./Types');

class Extremum extends Bloc {

	constructor (src, ctx) {

		super("extremum", src, ctx);
		this.f = (src, ins) => {

			var lcost, hcost, latk, hatk, lhp, hhp;

			ins[0].forEach(loc => {
				loc.cards.forEach(card => {
					if (ins[1] && !ins[1](card))
						return;
					var eff = card.eff || card;
					if (!lcost || eff.mana < lcost.eff.mana)
						lcost = card;
					if (!hcost || eff.mana > hcost.eff.mana)
						hcost = card;
					if (!latk || eff.atk < latk.eff.atk)
						latk = card;
					if (!hatk || eff.atk > hatk.eff.atk)
						hatk = card;
					if (!lhp || (eff.chp || eff.hp) < (lhp.eff.chp || lhp.eff.hp))
						lhp = card;
					if (!hhp || (eff.chp || eff.hp) > (hhp.eff.chp || hhp.eff.hp))
						hhp = card;
				});
			});
			
			return [lcost, hcost, latk, hatk, lhp, hhp];
		};
		this.types = [Types.locations, Types.cardfilter];
	}
}

module.exports = Extremum;