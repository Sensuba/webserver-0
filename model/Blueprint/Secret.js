var Bloc = require('./Bloc');
var Types = require('./Types');
var Listener = require('../Listener');

class Secret extends Bloc {

	constructor (src, ctx) {

		super("secret", src, ctx, true);
		this.f = (src, ins) => [this, this.data];
		this.types = [];
		this.out = [this, null];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var that = this;
		this.activate = data => {
			owner.secretcount = (owner.secretcount || 0) + 1;
			var param = 1;
			if (owner.secretparam !== undefined)
				param = owner.secretparam;
			if (param < 1 || owner.secretcount < param)
				return;
			that.data = data;
			owner.location.area.manapool.use(owner.eff.mana);
			var loc = owner.location;
			owner.goto(owner.location.area.court);
			owner.gameboard.notify("triggersecret", owner);
			owner.location = loc;
			that.trigger(owner, image);
			owner.location = owner.location.area.court;
			owner.destroy();
		}
		owner.innereffects.push(this);
	}
}

module.exports = Secret;