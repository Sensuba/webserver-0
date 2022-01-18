var Bloc = require('./Bloc');
var Listener = require('../Listener');

class Trap extends Bloc {

	constructor (src, ctx) {

		super("trap", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
	}

	setup (owner, image) {

		var that = this;
		var listener = new Listener(owner, own => that.src.gameboard.subscribe("draw", (t,s,d) => {
			if (d[0] === own) {
				that.act = () => {
					if (!own.inHand && !(own.location.id.type === "capsule"))
						return;
					own.goto(own.area.court);
					own.gameboard.notify("trap", own, undefined, own.finalMana, own.finalOverload);
					that.execute({src: own, image: image});
					own.destroy();
					own.gameboard.update();
				}
				if (own.area.court.isEmpty) {
					own.finalMana = own.eff.mana;
					own.finalOverload = own.eff.ol;
					that.act();
				}
				else {
					own.finalMana = own.eff.mana;
					own.finalOverload = own.eff.ol;
					own.goto(own.area.capsule);
					let unsub = that.src.gameboard.subscribe("cardmove", (t2,s2,d2) => {
						if (own.area.court.isEmpty) {
							unsub();
							that.act();
						}
					});
				}
			}
		}), true);
		owner.passives.push(listener);
	}
}

module.exports = Trap;