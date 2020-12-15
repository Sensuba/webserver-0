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
					owner.goto(owner.area.court);
					owner.gameboard.notify("trap", owner);
					that.execute({src: owner, image: image});
					owner.destroy();
					owner.gameboard.update();
				}
				if (owner.area.court.isEmpty)
					that.act();
				else if (!that.trapCasting) {
					owner.goto(owner.area.capsule);
					that.trapCasting = true;
					that.unsub = that.src.gameboard.subscribe("cardmove", (t2,s2,d2) => {
						if (owner.area.court.isEmpty) {
							that.unsub();
							delete that.unsub;
							that.act();
							delete that.trapCasting;
						}
					});
				}
			}
		}), true);
		owner.passives.push(listener);
	}
}

module.exports = Trap;