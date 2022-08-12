var Bloc = require('./Bloc');
var Types = require('./Types');

class Cast extends Bloc {

	constructor (src, ctx) {

		super("cast", src, ctx, true);
		this.f = (src, ins) => {
			var card = ins[0];
			card.finalMana = card.eff.mana;
			let folafter = card.location && card.location.id.type === "capsule";
			if (!folafter)
				card.finalOverload = card.eff.ol;
			card.goto(card.area.court);
			if (folafter)
				card.finalOverload = card.eff.ol;
			card.autocast = true;
			var hastarget = card.events.some(event => event.requirement);
			card.gameboard.notify("autocast", card, hastarget ? ins[1] : undefined, card.finalMana, card.finalOverload);
			card.events.forEach(event => event.execute(card.gameboard, card, ins[1]));
			card.destroy();
			card.gameboard.update();
			return [];
		};
		this.types = [Types.card, Types.location];
	}
}

module.exports = Cast;