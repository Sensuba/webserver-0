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

		var ins = this.computeIn();
		var req = ins[0];
		var tar = this.target ? (req ? (src, target) => (req(src, target) && (!target.card || target.card.targetable)) : (src, target) => true) : null;
		owner.faculties.push(new EAction(new Event((src, target) => {
			if (target)
				this.chosen = target;
			this.execute({src: owner, image: image});
		}, tar), ins[1]));
	}
}

module.exports = Action;