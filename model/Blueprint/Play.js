var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('../Event');

class Play extends Bloc {

	constructor (src, ctx, target) {

		super("play", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter];
		this.target = target;
	}

	setup () {

		var req = this.computeIn()[0];
		var reqf = this.target ? (req ? (target => req(this.src, target)) : (target => true)) : null;
		this.src.events.push(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute();
		}, reqf));
	}
}

module.exports = Play;