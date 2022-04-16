var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterPlayedLeftRight extends Bloc {

	constructor (src, ctx) {

		super("filterplaylr", src, ctx);
		this.f = (src, ins) => [target => target && target.playedFrom && (!ins[0] || target.playedFrom.left) && (!ins[1] || target.playedFrom.right)];
		this.types = [Types.bool, Types.bool];
	}
}

module.exports = FilterPlayedLeftRight;