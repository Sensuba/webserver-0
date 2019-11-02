var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachEffect extends Bloc {

	constructor (src, ctx) {

		super("foreffect", src, ctx, true);
		this.f = (src, ins, image) => {
			var card = ins[0], targets = ins[1];
			card.getInnerEffects().forEach (eff => {
				if (targets === null || targets(eff)) {
					this.out = [eff];
					if (this["for each"])
						this["for each"].execute(image);
				}
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(image);
			return;
		}
		this.types = [Types.card, Types.effecttype];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = ForEachEffect;