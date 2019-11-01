var Bloc = require('./Bloc');

class Trap extends Bloc {

	constructor (src, ctx) {

		super("trap", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [];
		this.out = [this];
	}

	setup (owner, image) {

		this.src.gameboard.subscribe("draw", (t,s,d) => {
			if (d[0] === owner) {
				owner.goto(owner.area.court);
				owner.gameboard.notify("trap", owner);
				this.execute(image);
				owner.destroy();
				owner.gameboard.update();
			}
		});
	}
}

module.exports = Trap;