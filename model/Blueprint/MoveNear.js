var Bloc = require('./Bloc');
var Types = require('./Types');

class MoveNear extends Bloc {

	constructor (src, ctx) {

		super("movenear", src, ctx, true);
		this.f = (src, ins) => {
			var tile = ins[1];
			var res = null;
			if (!tile.neighbors)
				return [null];
			if (tile.isEmpty) {
				ins[0].goto(tile);
				return [tile];
			}
			var neighbors = tile.neighbors.filter(t => t.isEmpty);
			if (neighbors.length > 0) {
				res = neighbors[Math.floor(Math.random()*neighbors.length)];
				ins[0].goto(res);
				return [res];
			}
			var adjacents = tile.adjacents.filter(t => t.isEmpty);
			if (adjacents.length > 0) {
				res = adjacents[Math.floor(Math.random()*adjacents.length)];
				ins[0].goto(res);
				return [res];
			}
			var all = tile.field.tiles.filter(t => t.isEmpty);
			if (all.length > 0) {
				var distance = all.reduce((min, t) => Math.min(min, t.distanceTo(tile)), 4);
				all = all.filter(t => t.distanceTo(tile) === distance);
				res = all[Math.floor(Math.random()*all.length)];
				ins[0].goto(res);
				return [res];
			}
			return [null];
		}
		this.types = [Types.card, Types.location];
	}
}

module.exports = MoveNear;