var Bloc = require('./Bloc');
var Types = require('./Types');

class LastWill extends Bloc {

	constructor (src, ctx) {

		super("lw", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
	}

	setup (owner, image) {

		this.src.gameboard.subscribe("destroycard", (t,s,d) => {
			if (s === owner && owner.onBoard)
				this.execute(image);
		});
	}
}

module.exports = LastWill;