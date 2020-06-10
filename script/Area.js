
class Area {

	constructor (basis) {

		var Types = require("./Types");
		this.filter = Types.tilefilter(basis.filter);
		if (basis.ahead) {
			this.ahead = Types.location(basis.ahead);
			this.mode = "ahead";
		} else if (basis.behind) {
			this.behind = Types.location(basis.behind);
			this.mode = "behind";
		}
	}

	compute (ctx) {

		var filter = this.filter(ctx);

		switch (this.mode) {
		case "ahead": return this.ahead(ctx).tilesAhead.filter(loc => filter(loc));
		case "behind": return this.behind(ctx).tilesBehind.filter(loc => filter(loc));
		default: return [];
		}
	}
}

module.exports = Area;