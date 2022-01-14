var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachStartingCard extends Bloc {

	constructor (src, ctx) {

		super("forstart", src, ctx, true);
		this.f = (src, ins, props) => {
			var area = ins[0], targets = ins[1];
			if (area.deck.starting) {
				area.deck.starting.filter(model => (targets === null || targets(model))).forEach (model => {
					this.out = [model];
					if (this["for each"])
						this["for each"].execute(props);
				})
				this.out = null;
			}
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.area, Types.modelfilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = ForEachStartingCard;