const MAX_MANA = 20;
const MAX_GEMS = 3;

class ManaPool {

	constructor (area) {

		this.id = { type: "manapool", no: area.id.no };

		this.area = area;

		this.receptacles = [];
		this.gems = 0;
	}

	createReceptacle (filled = true) {

		if (this.maxMana < MAX_MANA) {
			this.receptacles.push(filled);
			this.area.gameboard.notify("createmana", this, { type: "boolean", value: filled });
		}
	}

	destroyReceptacle () {

		if (this.maxMana > 0)
			this.receptacles.pop();
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

	get mana () {

		return this.receptacles.filter(r => r).length;
	}

	get usableMana () {

		return this.mana + this.gems;
	}

	get maxMana() {

		return this.receptacles.length;
	}

	canPay (mana) {

		return this.usableMana >= mana;
	}

	use (value) {

		if (value <= this.usableMana) {
			this.area.gameboard.notify("usemana", this, { type: "int", value: value });
			for (var i = this.receptacles.length - 1; i >= 0 && value > 0; i--) {
				if (this.receptacles[i]) {
					this.receptacles[i] = false;
					value--;
				}
			}
			while (--value > 0)
				this.useGem();
		}
	}

	refill (nb) {

		nb = nb || MAX_MANA;
		this.receptacles = this.receptacles.map(r => r || nb-- > 0);
		this.area.gameboard.notify("refillmana", this, { type: "int", value: nb });
	}
}

module.exports = ManaPool;