var Bloc = require('./Bloc');
var Types = require('./Types');
var Listener = require('../Listener');

class LastWill extends Bloc {

	constructor (src, ctx) {

		super("lw", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var that = this;
		var listener = new Listener(owner, () => that.src.gameboard.subscribe("destroycard", (t,s,d) => {
			if (s === owner && owner.onBoard)
				that.trigger(owner, image);
		}));
		owner.passives.push(listener);
		owner.innereffects.push(this);
	}
}

module.exports = LastWill;