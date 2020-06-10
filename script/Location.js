

class Location {

	constructor (basis) {

		var Types = require("./Types");
		this.area = Types.area(basis.area);
		this.filter = Types.tilefilter(basis.filter);
	}

	compute (ctx) {

		var filter = this.filter(ctx);
		var batch = this.area(ctx).filter(loc => filter(loc));

		return batch.length > 0 ? batch[Math.floor(Math.random() * batch.length)] : null;
	}
}

module.exports = Location;