var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachTile extends Bloc {

	constructor (src, ctx) {

		super("fortile", src, ctx, true);
		this.f = (src, ins) => {
			var area = ins[0], targets = ins[1];
			area.forEach (tile => {
				if (tile.occupied && ins[1](src, tile)) {
					this.out = [tile];
					if (this["for each"])
						this["for each"].execute();
				}
			})
			this.out = null;
			if (this.completed)
				this.completed.execute();
			return;
		}
		this.types = [Types.locations, Types.tilefilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = ForEachTile;