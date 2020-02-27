var Branch = require("./Branch");
var ForEach = require("./ForEach");

var Play = require("./Play");
var Faculty = require("./Faculty");
var Attack = require("./Attack");
var Move = require("./Move");

class Reader {

	constructor (gameboard, player, script) {

		this.gameboard = gameboard;
		this.player = player;
		this.script = script;
		this.index = 0;
		this.elements = [];
		this.variables = {};
	}

	init () {

		this.script.forEach(next => {
			var el;
			switch (next.type) {
			case "branch": el = new Branch(next); break;
			case "foreach": el = new ForEach(next); break;
			case "play": el = new Play(next); break;
			case "faculty": el = new Faculty(next); break;
			case "attack": el = new Attack(next); break;
			case "move": el = new Move(next); break;
			default: break;
			}
			this.elements.push(el);
		})
	}

	next () {

		if (!this.elements[this.index]) {
			this.index = 0;
			return null;
		}

		var result = this.elements[this.index].compute(this);
		if (!this.elements[this.index].static || !result)
			this.index++;
		if (result)
			return result;

		return this.next();
	}
}

module.exports = Reader;