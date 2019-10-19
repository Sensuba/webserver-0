var Bloc = require('./Bloc');
var Types = require('./Types');

class EditLocations extends Bloc {

	constructor (src, ctx) {

		super("editloc", src, ctx);
		this.f = (src, ins) => {
			var add = ins[0].slice(), remove = ins[0].slice();
			if (ins[0].includes(ins[1]))
				remove.filter(i => i !== ins[1]);
			else
				add.push(ins[1]);
			return [add, remove];
		}
		this.types = [Types.locations, Types.location];
	}
}

module.exports = EditLocations;