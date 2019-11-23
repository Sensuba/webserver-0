var Bloc = require('./Bloc');
var Types = require('./Types');
var Listener = require('../Listener');

class Frenzy extends Bloc {

	constructor (src, ctx) {

		super("frenzy", src, ctx, true);
		this.f = (src, ins) => [this, this.victim];
		this.types = [];
		this.out = [this, null];
	}

	setup (owner, image) {

		var that = this;
		owner.passives.push(new Listener(owner, () => that.src.gameboard.subscribe("damagecard", (t,s,d) => {
			if (d[1] === owner && owner.onBoard && owner.area.isPlaying && s.chp !== undefined && s.chp <= 0) {
				that.victim = s;
				that.unsubVictim = that.src.gameboard.subscribe("destroycard", (t2,s2,d2) => {
					if (that.victim === s2) {
						that.execute({src: owner, image: image});
						that.unsubVictim();
					}
				});
			}
		})));
	}
}

module.exports = Frenzy;