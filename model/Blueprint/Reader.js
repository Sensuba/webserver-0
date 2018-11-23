var Bloc = require('./Bloc');
var Play = require('./Play');
var Draw = require('./Draw');
var Destroy = require('./Destroy');
var LimitBreak = require('./LimitBreak');
var Plus = require('./Plus');
var Minus = require('./Minus');

class Reader {

	static read (blueprint, card) {

		var ctx = { triggers: [], actions: [], parameters: [] };
		Object.keys(ctx).forEach(key => blueprint[key].forEach(el => {
			var bloc = null;
			switch(el.type) {
			case "play": bloc = new Play(card, ctx, el.target); break;
			case "draw": bloc = new Draw(card, ctx); break;
			case "destroy": bloc = new Destroy(card, ctx); break;
			case "limitbrk": bloc = new LimitBreak(card, ctx); break;
			case "opplus": bloc = new Plus(card, ctx); break;
			case "opminus": bloc = new Minus(card, ctx); break;
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