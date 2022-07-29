var Bloc = require('./Bloc');

class FilterCover extends Bloc {

	constructor (src, ctx) {

		super("filtercover", src, ctx);
		this.f = (src, ins) => [
			target => target && (target.isCovered(false) || target.isCovered(true)),
			target => target && target.isCovered(false),
			target => target && target.isCovered(true)
		];
		this.types = [];
	}
}

module.exports = FilterCover;