
class Tile {

	constructor (id, field) {

		this.id = { type: "tile", no: id };

		this.field = field;

		this.card = null;
	}

	get isEmpty () {

		return this.card === null || this.card === undefined;
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

		this.place(card);
	}

	removeCard (card) {

		if (this.card === card)
			this.free ();
	}

	hasCard (card) {

		return this.card === card;
	}

	get inFront () {

		return this.field.front.includes(this);
	}

	get inBack () {

		return this.field.back.includes(this);
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

		return this.tilesBehind.includes(other);
	}

	isAhead (other) {

		return this.tilesAhead.includes(other);
	}
}

module.exports = Tile;