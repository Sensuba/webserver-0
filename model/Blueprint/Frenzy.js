var Bloc = require('./Bloc');
var Types = require('./Types');

class Frenzy extends Bloc {

	constructor (src, ctx) {

		super("frenzy", src, ctx, true);
		this.f = (src, ins) => [this, this.victim];
		this.types = [];
		this.out = [this, null];
	}

	setup (owner, image) {

		this.src.gameboard.subscribe("charattack", (t,s,d) => {
			if (s === owner && owner.onBoard && d[0].chp !== undefined && d[0].chp <= 0) {
				this.victim = d[0];
				this.execute(image);
			}
		});
	}
}

module.exports = Frenzy;