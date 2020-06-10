

class Int {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.mana) {
			this.mana = Types.player(basis.mana);
			this.mode = "mana";
		} else if (basis.level) {
			this.level = Types.player(basis.level);
			this.mode = "level";
		}
	}

	compute (ctx) {

		switch (this.mode) {
		case "mana": return this.mana(ctx).manapool.mana;
		case "level": return this.level(ctx).hero.level;
		default: return 0;
		}
	}
}

module.exports = Int;