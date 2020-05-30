
class Tile {

	constructor (id, field) {

		this.id = { type: "tile", no: id };

		this.locationOrder = 3;

		this.field = field;

		this.card = null;
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
}

module.exports = Tile;