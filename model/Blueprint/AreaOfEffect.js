var Bloc = require('./Bloc');
var Types = require('./Types');

class AreaOfEffect extends Bloc {

	constructor (src, ctx) {

		super("aoe", src, ctx, true);
		this.f = (src, ins, image) => {
			var area = ins[0], targets = ins[1];
			area.forEach (tile => {
				if (tile.occupied && targets(tile.card)) {
					this.out = [tile.card];
					if (this["for each"])
						this["for each"].execute(image);
				}
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(image);
			return;
		}
		this.types = [Types.locations, Types.cardfilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = AreaOfEffect;