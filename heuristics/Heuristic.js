
class Heuristic {

	constructor (board, no) {

		this.board = board;
		this.no = no;
		this.halfvalue = 1;
		this.egoism = 0;
		this.type = "logarithmic";
	}

	compute () {

		var f = this.computationFunction;

		var va = f(this.evaluate()) * (this.egoism < 0 ? 1 + this.egoism : 1 - this.egoism/2);
		this.switchArea();
		var vb = f(this.evaluate()) * (this.egoism > 0 ? 1 - this.egoism : 1 + this.egoism/2);
		this.switchArea();

		var value = va - vb;

		return isNaN(value) ? 0 : value;
	}

	get computationFunction () {

		switch (this.type) {
		case "logarithmic": return x => 1-1/(1+x/this.halfvalue);
		case "linear": return x => x;
		default: return x => x;
		}
	}

	evaluate () {

		return 0;
	}

	switchArea () {

		this.no = 1 - this.no;
	}

	get area () {

		return this.board.areas[this.no];
	}
}

module.exports = Heuristic;