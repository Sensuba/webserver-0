var Bloc = require('./Bloc');
var Types = require('./Types');

class LastWill extends Bloc {

	constructor (src, ctx) {

		super("lw", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
	}

	setup () {

		this.src.gameboard.subscribe("destroycard", (t,s,d) => {
			if (s === this.src && this.src.onBoard)
				this.execute();
		});
	}
}

module.exports = LastWill;