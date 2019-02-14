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
	}

	setup () {

		var ins = this.computeIn();
		var req = ins[0];
		req = this.target ? (req ? req : (src, target) => true) : null;
		this.src.faculties.push(new ESkill(new Event(target => {
			if (target)
				this.chosen = target;
			this.execute();
		}, req), ins[2]));
	}
}

module.exports = Skill;