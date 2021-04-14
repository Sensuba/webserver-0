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
		owner.passives.push(new Listener(owner, own => that.src.gameboard.subscribe("charattack", (t,s,d) => {
			if (s === own) {
				this.victim = d[0];
				if (that.unsub1)
					that.unsub1();
				that.unsub1 = that.src.gameboard.subscribe("damagecard", (t,s,d) => {
					if (s === this.victim && d[1] === own && own.onBoard && s.chp !== undefined && s.chp <= 0) {
						that.unsub1();
						delete that.unsub1;
						if (that.unsub2)
							that.unsub2();
						that.unsub2 = that.src.gameboard.subscribe("destroycard", (t2,s2,d2) => {
							if (this.victim === s2 && s2.isType("character")) {
								that.execute({src: own, image: image});
								that.unsub2();
								delete that.unsub2;
							}
						});
					}
				});
			}
		})));
		owner.innereffects.push(this);
	}
}

module.exports = Frenzy;