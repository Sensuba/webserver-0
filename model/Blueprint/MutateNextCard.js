var Bloc = require('./Bloc');
var Types = require('./Types');
var Aspect = require('../Aspect');

class MutateNextCard extends Bloc {

	constructor (src, ctx) {

		super("mutnext", src, ctx, true);
		this.f = (src, ins) => {
			var aspect = new Aspect(ins[2], x => this.in[1]({src: src, data: x})(x), [ins[2].hand, ins[2].court], ins[0]);
			var unsub1, unsub2;
			unsub1 = ins[3].subscribe((t,s,d) => {
				aspect.deactivate();
				unsub1();
				unsub2();
			});
			unsub2 = src.gameboard.subscribe("playcard", (t,s,d) => {
				if (aspect.targets(s)) {
					if (s.isType("spell")) {
						var unsubSpell;
						unsubSpell = src.gameboard.subscribe("destroycard", (t2,s2,d2) => {
							if (s === s2) {
								aspect.deactivate();
								unsub1();
								unsub2();
								unsubSpell();
							}
						});
					} else {
						aspect.deactivate();
						unsub1();
						unsub2();
					}
				}
			});
			src.gameboard.notify("nextcard", ins[2], src, {type: "int", value: this.mutno});
			return [];
		};
		this.types = [Types.cardfilter, Types.mutation, Types.area, Types.event];

		if (!src.mutdata)
			src.mutdata = [];
		src.mutdata.push(this);
		this.mutno = src.mutdata.length-1;
	}

	getMutation () {

		return {effect: this.in[1](), targets: this.in[0](), end: this.in[3]()};
	}
}

module.exports = MutateNextCard;