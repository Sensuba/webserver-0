
class Tilefilter {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.name)
			this.name = Types.string(basis.name);
		if (basis.atk)
			this.atk = Types.int(basis.atk);
		if (basis.hp)
			this.hp = Types.int(basis.hp);
		if (basis.range)
			this.range = Types.int(basis.range);
	}

	compute (ctx) {

		if (this.name) var name = this.name(ctx);
		if (this.atk) var atk = this.atk(ctx);
		if (this.hp) var hp = this.hp(ctx);
		if (this.range) var range = this.range(ctx);

		return tile => {

			if (this.name && !(tile.occupied && tile.card && tile.card.nameCard && tile.card.nameCard == name))
				return false;

			if (this.atk && !(tile.occupied && tile.card && tile.card.atk && tile.card.atk == atk))
				return false;

			if (this.hp && !(tile.occupied && tile.card && tile.card.chp && tile.card.chp == hp))
				return false;

			if (this.range && !(tile.occupied && tile.card && tile.card.range && tile.card.range == range))
				return false;

			return true;
		}
	}
}

module.exports = Tilefilter;