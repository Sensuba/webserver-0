var Bloc = require('./Bloc');
var Types = require('./Types');
var EAction = require('../Action');
var Event = require('../Event');

class Action extends Bloc {

	constructor (src, ctx, target) {

		super("action", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter, Types.string];
		this.target = target;
		this.out = [this, null, null];
	}

	setup (owner, image) {

		var req = this.computeIn()[0];
		req = this.target ? (req ? req : (src, target) => true) : null;
		owner.faculties.push(new EAction(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute(image);
		}, req)));
	}
}

module.exports = Action;