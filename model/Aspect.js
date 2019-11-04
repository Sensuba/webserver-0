class Aspect {

	constructor (player, mutation, area, targets) {
		
		this.mutation = mutation;
		this.player = player;
		this.area = area;
		this.targets = targets;
		this.activate();
	}

	activate () {

		if (this.activated)
			return;
		this.player.gameboard.addAura(this);
		this.activated = true;
		this.player.gameboard.update();
	}

	deactivate () {

		if (!this.activated)
			return;
		this.player.gameboard.clearAura(this);
		this.activated = false;
		this.player.gameboard.update();
	}

	applicable (target) {

		return this.targets(target) && this.area.includes(target.location);
	}

	apply (target) {

		return this.mutation(target);
	}
}

module.exports = Aspect;