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
					if (!lcost || card.mana < lcost.mana)
						lcost = card;
					if (!hcost || card.mana > hcost.mana)
						hcost = card;
					if (!latk || card.atk < latk.atk)
						latk = card;
					if (!hatk || card.atk > hatk.atk)
						hatk = card;
					if (!lhp || (card.chp || card.hp) < (lhp.chp || lhp.hp))
						lhp = card;
					if (!hhp || (card.chp || card.hp) > (hhp.chp || hhp.hp))
						hhp = card;
				});
			});
			
			return [lcost, hcost, latk, hatk, lhp, hhp];
		};
		this.types = [Types.locations, Types.cardfilter];
	}
}

module.exports = Extremum;