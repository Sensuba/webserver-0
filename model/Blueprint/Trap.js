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
		var listener = new Listener(owner, () => that.src.gameboard.subscribe("draw", (t,s,d) => {
			if (d[0] === owner) {
				that.act = () => {
					if (!owner.inHand && !(owner.location.id.type != "capsule"))
						return;
					owner.goto(owner.area.court);
					owner.gameboard.notify("trap", owner);
					that.execute({src: owner, image: image});
					owner.destroy();
					owner.gameboard.update();
				}
				if (owner.area.court.isEmpty)
					that.act();
				else {
					owner.goto(owner.area.capsule);
					let unsub = that.src.gameboard.subscribe("cardmove", (t2,s2,d2) => {
						if (owner.area.court.isEmpty) {
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