var Bloc = require('./Bloc');
var Types = require('./Types');
var ESkill = require('../Skill');
var ASkill = require('../ArtifactSkill');
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
		var tar = this.target ? (req ? (src, target) => (req(src, target) && (!target.card || target.card.targetable)) : (src, target) => true) : null;
		var e = new Event((src, target) => {
			if (target)
				this.chosen = target;
			this.execute(src);
		}, tar);
		var skill = owner.isType("artifact") ? new ASkill(e, ins[2]) : new ESkill(e, ins[2]);
		owner.faculties.push(skill);
	}
}

module.exports = Skill;