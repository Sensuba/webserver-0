var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('../Event');

class Play extends Bloc {

	constructor (src, ctx, target) {

		super("play", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter];
		this.target = target;
		this.out = [this, null, null];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var req = this.in[0]();
		var tar = this.target ? (req ? (src, target) => (this.in[0]()(src, target) && (!target.card || target.card.targetableBy(owner))) : (src, target) => true) : null;
		owner.events.push(new Event((src, target) => {
			if (target)
				this.chosen = target;
			this.trigger(owner, image);
		}, tar));
		owner.innereffects.push(this);
	}
}

module.exports = Play;