

class Location {

	constructor (basis) {

		var Types = require("./Types");
		this.area = Types.area(basis.area);
		this.filter = Types.tilefilter(basis.filter);
	}

	compute (ctx) {

		var filter = this.filter(ctx);
		var batch = this.area(ctx).filter(loc => filter(loc));

		return batch[Math.floor(Math.random() * batch.length)];
	}
}

module.exports = Location;