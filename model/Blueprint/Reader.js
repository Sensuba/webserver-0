var Bloc = require('./Bloc');
var Play = require('./Play');
var Draw = require('./Draw');
var Damage = require('./Damage');
var Destroy = require('./Destroy');
var LimitBreak = require('./LimitBreak');
var RandomBool = require('./RandomBool');
var BreakCard = require('./BreakCard');
var Branch = require('./Branch');
var Loop = require('./Loop');
var Plus = require('./Plus');
var Minus = require('./Minus');
var Times = require('./Times');
var Div = require('./Div');
var Mod = require('./Mod');
var Not = require('./Not');
var And = require('./And');
var Or = require('./Or');
var Xor = require('./Xor');
var Ternary = require('./Ternary');
var Equal = require('./Equal');
var NotEqual = require('./NotEqual');
var Greater = require('./Greater');
var GreaterEqual = require('./GreaterEqual');
var Lesser = require('./Lesser');
var LesserEqual = require('./LesserEqual');

class Reader {

	static read (blueprint, card) {

		var ctx = { triggers: [], actions: [], parameters: [] };
		Object.keys(ctx).forEach(key => blueprint[key].forEach(el => {
			var bloc = null;
			switch(el.type) {
			case "play": bloc = new Play(card, ctx, el.target); break;
			case "draw": bloc = new Draw(card, ctx); break;
			case "damage": bloc = new Damage(card, ctx); break;
			case "destroy": bloc = new Destroy(card, ctx); break;
			case "limitbrk": bloc = new LimitBreak(card, ctx); break;
			case "randbool": bloc = new RandomBool(card, ctx); break;
			case "brkcard": bloc = new BreakCard(card, ctx); break;
			case "branch": bloc = new Branch(card, ctx); break;
			case "loop": bloc = new Loop(card, ctx); break;
			case "opplus": bloc = new Plus(card, ctx); break;
			case "opminus": bloc = new Minus(card, ctx); break;
			case "optimes": bloc = new Times(card, ctx); break;
			case "opdiv": bloc = new Div(card, ctx); break;
			case "opmod": bloc = new Mod(card, ctx); break;
			case "opnot": bloc = new Not(card, ctx); break;
			case "opand": bloc = new And(card, ctx); break;
			case "opor": bloc = new Or(card, ctx); break;
			case "opxor": bloc = new Xor(card, ctx); break;
			case "opter": bloc = new Ternary(card, ctx); break;
			case "ope": bloc = new Equal(card, ctx); break;
			case "opne": bloc = new NotEqual(card, ctx); break;
			case "opg": bloc = new Greater(card, ctx); break;
			case "opge": bloc = new GreaterEqual(card, ctx); break;
			case "opl": bloc = new Lesser(card, ctx); break;
			case "ople": bloc = new LesserEqual(card, ctx); break;
			default: bloc = new Bloc(el.type, card, ctx); break;
			}
			ctx[key].push(bloc);
		}));
		Object.keys(ctx).forEach(key => blueprint[key].forEach((el, i) => {
			var bloc = ctx[key][i];
			bloc.updateIn(el.in);
		}));
		blueprint.basis.forEach(basis => {
			var src = blueprint[basis.type][basis.index];
			var bloc = ctx[basis.type][basis.index];
			bloc.prepare(src, blueprint);
			bloc.setup();
		})
	}
}

module.exports = Reader;