
class Tilefilter {

	constructor (basis) {

		var Types = require("./Types");
		if (basis.and) {
			this.and = Types.array(Types.tilefilter, basis.and);
			this.mode = "and";
		} else if (basis.not) {
			this.not = Types.tilefilter(basis.not);
			this.mode = "not";
		}
		if (basis.name)
			this.name = Types.string(basis.name);
		if (basis.mana)
			this.mana = Types.int(basis.mana);
		if (basis.atk)
			this.atk = Types.int(basis.atk);
		if (basis.hp)
			this.hp = Types.int(basis.hp);
		if (basis.range)
			this.range = Types.int(basis.range);
		if (basis.coverage !== undefined)
			this.coverage = Types.bool(basis.coverage);
		if (basis.flying !== undefined)
			this.flying = Types.bool(basis.flying);
	}

	compute (ctx) {

		switch (this.mode) {
		case "and": return tile => this.and.every(filter => filter(ctx)(tile));
		case "not": return tile => !this.not(ctx)(tile);
		default: break;
		}

		if (this.name) var name = this.name(ctx);
		if (this.mana) var mana = this.mana(ctx);
		if (this.atk) var atk = this.atk(ctx);
		if (this.hp) var hp = this.hp(ctx);
		if (this.range) var range = this.range(ctx);
		if (this.coverage !== undefined) var coverage = this.coverage(ctx);
		if (this.flying !== undefined) var flying = this.flying(ctx);

		return tile => {

			if (this.name && !(tile.occupied && tile.card && tile.card.nameCard && tile.card.nameCard == name))
				return false;

			if (this.mana && !(tile.occupied && tile.card && tile.card.mana && tile.card.eff.mana == mana))
				return false;

			if (this.atk && !(tile.occupied && tile.card && tile.card.atk && tile.card.eff.atk == atk))
				return false;

			if (this.hp && !(tile.occupied && tile.card && tile.card.chp && tile.card.chp == hp))
				return false;

			if (this.range && !(tile.occupied && tile.card && tile.card.range && tile.card.eff.range == range))
				return false;

			if (this.coverage && !(tile.occupied && tile.card && tile.card.covered === coverage))
				return false;

			if (this.flying && !(tile.occupied && tile.card && tile.card.hasState("flying") === flying))
				return false;

			return true;
		}
	}
}

module.exports = Tilefilter;