var Bloc = require('./Bloc');
var Types = require('./Types');
var ESkill = require('../Skill');
var Event = require('../Event');

class Skill extends Bloc {

	constructor (src, ctx, target) {

		super("skill", src, ctx, true);
		this.f = (src, ins) => [this, this.chosen ? this.chosen.card : null, this.chosen];
		this.types = [Types.tilefilter, Types.string, Types.int];
		this.target = target;
		this.out = [this, null, null];
	}

	setup (owner, image) {

		var ins = this.computeIn();
		var req = ins[0];
		var tar = this.target ? (req ? (src, target) => (req(src, target) && (!target.card || !target.card.hasState("exaltation"))) : (src, target) => true) : null;
		owner.faculties.push(new ESkill(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute(image);
		}, tar), ins[2]));
	}
}

module.exports = Skill;