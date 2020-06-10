const MAX_MANA = 20;
const MAX_GEMS = 3;

class ManaPool {

	constructor (area) {

		this.id = { type: "manapool", no: area.id.no };

		this.area = area;

		this.receptacles = [];
		this.gems = 0;
		this.extramana = 0;
		this.area.gameboard.register(this);
	}

	createReceptacle (filled = true) {

		if (this.maxMana < MAX_MANA) {
			this.receptacles.push(filled);
			this.area.gameboard.notify("createmana", this, { type: "boolean", value: filled });
		}
	}

	destroyReceptacle () {

		if (this.maxMana > 0) {
			this.receptacles.pop();
			this.area.gameboard.notify("destroymana", this);
		}
	}

	createGem () {

		if (this.gems < MAX_GEMS) {
			this.gems++;
			this.area.gameboard.notify("creategem", this);
		}
	}

	useGem() {

		if (this.gems > 0) {
			this.gems--;
			this.area.gameboard.notify("usegem", this);
		}
	}

	addExtraMana (value) {

		this.extramana += value;
		this.area.gameboard.notify("extramana", this, { type: "int", value: value });
	}

	get mana () {

		return this.receptacles.filter(r => r).length;
	}

	get usableMana () {

		return this.mana + this.gems + this.extramana;
	}

	get maxMana() {

		return this.receptacles.length;
	}

	canPay (mana) {

		return this.usableMana >= mana;
	}

	use (value) {

		if (value > this.usableMana)
			value = this.usableMana;
		this.area.gameboard.notify("usemana", this, { type: "int", value: value });
		let usedextramana = Math.min(value, this.extramana)
		value -= usedextramana;
		this.extramana -= usedextramana;
		for (var i = this.receptacles.length - 1; i >= 0 && value > 0; i--) {
			if (this.receptacles[i]) {
				this.receptacles[i] = false;
				value--;
			}
		}
		while (value-- > 0)
			this.useGem();
	}

	refill (nb) {

		let mnb = nb || MAX_MANA;
		this.receptacles = this.receptacles.map(r => r || mnb-- > 0);
		this.area.gameboard.notify("refillmana", this, { type: "int", value: nb });
	}

	reload () {

		this.receptacles = this.receptacles.map(r => true);
		this.extramana = 0;
	}
}

module.exports = ManaPool;