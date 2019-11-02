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
		var trigger = (t,s,d) => {
			if (s === owner && owner.onBoard)
				that.execute(image);
		};
		var listener = new Listener(owner, () => that.src.gameboard.subscribe("destroycard", trigger));
		listener.effecttype = "last will";
		listener.trigger = trigger;
		owner.passives.push(listener);
	}
}

module.exports = LastWill;