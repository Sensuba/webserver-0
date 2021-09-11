const HAZARDS_GROUPS = [["fire", "water", "flowers", "butterflies"], ["wind"], ["shadow"], ["portal", "seal"]]

class Tile {

	constructor (id, field) {

		this.id = { type: "tile", no: id };

		this.locationOrder = 3;

		this.field = field;

		this.card = null;
		this.hazards = [];
		this.area.gameboard.register(this);
	}

	get count () {

		return this.occupied ? 1 : 0;
	}

	get isEmpty () {

		return this.card === null || this.card === undefined || this.card.destroyed || this.card.isGhost;
	}

	get occupied () {

		return !this.isEmpty;
	}

	get public () {

		return true;
	}

	get horizontalPosition () {

		let line = this.line;
		for (let i = 0; i < line.length; i++)
			if (line[i] === this)
				return 2*i + (this.inFront ? 1 : 0);
	}

	place (card) {

		if (this.card !== null)
			this.card.destroy();
		this.card = card;
		if (card.location !== this)
			card.goto(this);
	}

	free() {

		var c = this.card;
		this.card = null;
		if (c !== null && c.location === this)
			c.goto(null);
	}

	addCard (card) {

		card.identify();
		this.place(card);
	}

	removeCard (card) {

		if (this.card === card)
			this.free ();
	}

	hasCard (card) {

		return this.card === card;
	}

	get area () {

		return this.field.area;
	}

	get inFront () {

		return this.field.front.includes(this);
	}

	get inBack () {

		return this.field.back.includes(this);
	}

	get line () {

		return this.inFront ? this.field.front : this.field.back;
	}

	get cards () {

		return this.occupied ? [this.card] : [];
	}

	get left () {

		var line = this.inFront ? this.field.front : this.field.back;
		for (var i = 1; i < line.length; i++)
			if (line[i] === this)
				return line[i-1];
		return null;
	}

	get right () {

		var line = this.inFront ? this.field.front : this.field.back;
		for (var i = 0; i < line.length-1; i++)
			if (line[i] === this)
				return line[i+1];
		return null;
	}

	get mirror () {

		for (var i = 0; i < this.field.tiles.length; i++)
			if (this.field.tiles[i] === this)
				return this.field.opposite.tiles[i];
		return null;
	}

	get neighbors () {

		var n = [];
		var line = this.inFront ? this.field.front : this.field.back;
		for (var i = 0; i < line.length-1; i++)
			if (line[i] === this)
				n.push(line[i+1]);
		for (var i = 1; i < line.length; i++)
			if (line[i] === this)
				n.push(line[i-1]);
		return n;
	}

	isNeighborTo (other) {

		return this.neighbors.includes(other);
	}

	get tilesBehind () {

		var b = [];
		if (this.inBack)
			return b;
		for (var i = 0; i < this.field.front.length; i++)
			if (this.field.front [i] === this) {
				b.push (this.field.back [i]);
				b.push (this.field.back [i+1]);
			}
		return b;
	}

	get tilesAhead () {

		var a = [];
		if (this.inFront)
			return a;
		for (var i = 0; i < this.field.back.length-1; i++)
			if (this.field.back [i] === this)
				a.push (this.field.front [i]);
		for (var i = 1; i < this.field.back.length; i++)
			if (this.field.back [i] === this)
				a.push (this.field.front [i-1]);
		return a;
	}

	get adjacents () {

		return this.neighbors.concat(this.inFront ? this.tilesBehind : this.tilesAhead);
	}

	isAdjacentTo (other) {

		return this.adjacents.includes(other);
	}

	isBehind (other) {

		return this.tilesAhead.includes(other);
	}

	isAhead (other) {

		return this.tilesBehind.includes(other);
	}

	distanceTo (other) {

		if (this.area !== other.area || other.id.type !== "tile")
			return -1;

		var num = this.id.no - 9 * this.field.id.no;
		num = num > 3 ? (num - 4) * 2 : num * 2 + 1;
		var numo = other.id.no - 9 * other.field.id.no;
		numo = numo > 3 ? (numo - 4) * 2 : numo * 2 + 1;

		return Math.ceil(Math.abs(num - numo)/2);
	}

	addHazards (hazards) {

		if (!hazards || this.hasHazards(hazards))
			return;
		if (this.hazards.length === 0)
			this.hazards.push(hazards)
		else {
			let groupindex = HAZARDS_GROUPS.findIndex(group => group.includes(hazards));
			let index = this.hazards.findIndex(h => HAZARDS_GROUPS[groupindex].includes(h));
			if (index > -1)
				this.hazards[index] = hazards;
			else this.hazards.push(hazards);
		}
		this.area.gameboard.notify("hazards", this, { type: "string", value: hazards });
		if (this.occupied)
			this.applyHazards(this.card);
		else if (this.hasHazards("portal"))
			this.field.tiles.forEach(t => {
				if (t !== this && t.hasHazards("portal") && t.occupied)
					t.applyHazards(t.card);
			})
	}

	hasHazards (hazards) {

		return this.hazards.includes(hazards);
	}

	clearHazards (hazards) {

		if (!hazards) {
			this.hazards = [];
			this.area.gameboard.notify("clearhazards", this, { type: "string", value: null });
		}
		else {
			let index = this.hazards.indexOf(hazards);
			if (index > -1) {
			 	this.hazards.splice(index, 1);
				this.area.gameboard.notify("clearhazards", this, { type: "string", value: hazards });
			}
		}
	}

	applyHazards (card) {

		if (this.hazards.length < 1)
			return;

		this.hazards.forEach(hazards => {

			if (card.isType("entity")) {

				switch (hazards) {
				case "fire": if (card.isType("figure")) { card.damage((this.area.hero && this.area.hero.variables && this.area.hero.variables.fireboost ? this.area.hero.variables.fireboost : 0) + 300); this.clearHazards(hazards); } break;
				case "water": if (card.isType("figure")) { card.freeze(); this.clearHazards(hazards); } break;
				case "flowers": if (card.isType("figure")) { card.boost((this.area.hero && this.area.hero.variables && this.area.hero.variables.flowersboost ? this.area.hero.variables.flowersboost : 0) + 200, (this.area.hero && this.area.hero.variables && this.area.hero.variables.flowersboost ? this.area.hero.variables.flowersboost : 0) + 200, 0); this.clearHazards(hazards); } break;
				case "butterflies": if (card.isType("figure")) { card.poison((this.area.hero && this.area.hero.butterfliesboost && this.area.hero.variables.butterfliesboost ? this.area.hero.variables.butterfliesboost : 0) + 200); this.clearHazards(hazards); } break;
				case "portal": {
					let target = null;
					let portals = [];
					let minDistance = 100;
					this.field.tiles.forEach(t => {
						if (t !== this && t.hasHazards("portal")) {
							portals.push(t);
							let distance = this.distanceTo(t);
							if (distance < minDistance)
								minDistance = distance;
						}
					});
					if (portals.length > 0) {
						portals = portals.filter(t => this.distanceTo(t) === minDistance);
						target = portals[Math.floor(Math.random() * portals.length)];
					}
					if (target) {
						this.clearHazards(hazards);
						target.clearHazards(hazards);
						card.goto(target);
					}
				}
				break;
				default: break;
				}
			}
		})
	}
}

module.exports = Tile;