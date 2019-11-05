var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachEffect extends Bloc {

	constructor (src, ctx) {

		super("foreffect", src, ctx, true);
		this.f = (src, ins, props) => {
			var card = ins[0], targets = ins[1];
			card.innereffects.forEach (eff => {
				if (targets === null || targets(eff)) {
					this.out = [eff];
					if (this["for each"])
						this["for each"].execute(props);
				}
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.card, Types.effecttype];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = ForEachEffect;