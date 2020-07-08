var Bloc = require('./Bloc');
var Types = require('./Types');

class Cast extends Bloc {

	constructor (src, ctx) {

		super("cast", src, ctx, true);
		this.f = (src, ins) => {
			var card = ins[0];
			card.goto(card.area.court);
			card.autocast = true;
			var hastarget = card.events.some(event => event.requirement);
			card.gameboard.notify("trap", card, hastarget ? ins[1] : undefined);
			card.events.forEach(event => event.execute(card.gameboard, card, ins[1]));
			card.destroy();
			card.gameboard.update();
			return [];
		};
		this.types = [Types.card, Types.location];
	}
}

module.exports = Cast;