var Bool = require("./Bool");
var Card = require("./Card");
var Location = require("./Location");
var Area = require("./Area");
var Cardfilter = require("./Cardfilter");
var Tilefilter = require("./Tilefilter");

class Types {

	static int (value) {

		if (typeof value === 'object')
			return ctx => 0;
		return ctx => value;
	}

	static bool (value) {

		if (typeof value === 'object') {
			var el = new Bool(value);
			return el.compute.bind(el);
		}
		return ctx => value;
	}

	static card (value) {

		if (typeof value === 'object') {
			var el = new Card(value);
			return el.compute.bind(el);
		}
		
		switch (value) {
		case "hero": return ctx => ctx.gameboard.areas[ctx.player].hero;
		case "enemy hero": return ctx => ctx.gameboard.areas[1-ctx.player].hero;
		default: return ctx => ctx.variables[value];
		}
	}

	static array (type, value) {

		return value.map(v => type(v));
	}

	static location (value) {

		if (typeof value === 'object') {
			var el = new Location(value);
			return el.compute.bind(el);
		}
		
		switch (value) {
		case "hero": return ctx => ctx.gameboard.areas[ctx.player].hero.location;
		case "enemy hero": return ctx => ctx.gameboard.areas[1-ctx.player].hero.location;
		case "hand": return ctx => ctx.gameboard.areas[ctx.player].hand;
		default: return ctx => ctx.variables[value].location;
		}
	}

	static area (value) {

		if (typeof value === 'object') {
			var el = new Area(value);
			return el.compute.bind(el);
		}
		
		switch (value) {
		case "hand": return ctx => [ctx.gameboard.areas[ctx.player].hand];
		case "field": return ctx => ctx.gameboard.areas[ctx.player].field.tiles;
		case "front": return ctx => ctx.gameboard.areas[ctx.player].field.front;
		case "back": return ctx => ctx.gameboard.areas[ctx.player].field.back;
		case "opponent's hand": return ctx => [ctx.gameboard.areas[1-ctx.player].hand];
		case "opponent's field": return ctx => ctx.gameboard.areas[1-ctx.player].field.tiles;
		case "opponent's front": return ctx => ctx.gameboard.areas[1-ctx.player].field.front;
		case "opponent's back": return ctx => ctx.gameboard.areas[1-ctx.player].field.back;
		default: return null;
		}
	}

	static cardfilter (value) {

		if (typeof value === 'object') {
			var el = new Cardfilter(value);
			return el.compute.bind(el);
		}
		
		switch (value) {
		case "entity":
		case "character":
		case "hero":
		case "figure":
		case "spell":
		case "artifact": return ctx => card => card.isType(value);
		default: return ctx => card => true;
		}
	}

	static tilefilter (value) {

		if (typeof value === 'object') {
			var el = new Tilefilter(value);
			return el.compute.bind(el);
		}
		
		switch (value) {
		case "empty": return ctx => tile => tile.isEmpty;
		case "entity":
		case "character":
		case "hero":
		case "figure":
		case "artifact": return ctx => tile => tile.occupied && tile.card.isType(value);
		default: return ctx => tile => true;
		}
	}
}


module.exports = Types;