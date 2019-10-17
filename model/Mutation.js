class Mutation {

	constructor (effect) {
		
		this.effect = effect;
	}

	attach (card) {

		this.card = card;
		this.card.mutations.push(this);
	}

	detach () {

		if (!this.card)
			return;
		this.card.mutations = this.card.mutations.filter (m => m !== this);
		this.card = null;
	}

	apply (target) {

		return this.effect(target);
	}
}

module.exports = Mutation;