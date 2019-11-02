var Bloc = require('./Bloc');
var Types = require('./Types');
var Listener = require('../Listener');

class LastWill extends Bloc {

	constructor (src, ctx) {

		super("lw", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
	}

	setup (owner, image) {

		var that = this;
		owner.passives.push(new Listener(owner, () => that.src.gameboard.subscribe("destroycard", (t,s,d) => {
			if (s === owner && owner.onBoard)
				that.execute(image);
		})));
	}
}

module.exports = LastWill;