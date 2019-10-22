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
	}

	setup (owner, image) {

		var req = this.in[0]();
		var tar = this.target ? (req ? (src, target) => (req(src, target) && (!target.card || target.card.targetable)) : (src, target) => true) : null;
		owner.events.push(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute(image);
		}, tar));
	}
}

module.exports = Play;