var Bloc = require('./Bloc');
var Types = require('./Types');

class MoveNear extends Bloc {

	constructor (src, ctx) {

		super("movenear", src, ctx, true);
		this.f = (src, ins) => {
			var tile = ins[1];
			if (!tile.neighbors)
				return [];
			if (tile.isEmpty) {
				ins[0].goto(tile);
				return [];
			}
			var neighbors = tile.neighbors.filter(t => t.isEmpty);
			if (neighbors.length > 0) {
				ins[0].goto(neighbors[Math.floor(Math.random()*neighbors.length)]);
				return [];
			}
			var adjacents = tile.adjacents.filter(t => t.isEmpty);
			if (adjacents.length > 0) {
				ins[0].goto(adjacents[Math.floor(Math.random()*adjacents.length)]);
				return [];
			}
			var all = tile.field.tiles.filter(t => t.isEmpty);
			if (all.length > 0) {
				ins[0].goto(all[Math.floor(Math.random()*all.length)]);
				return [];
			}
			return [];
		}
		this.types = [Types.card, Types.location];
	}
}

module.exports = MoveNear;