var targets = require('../Event').targets;

class Types {

	static int (value, src) {

		return typeof value === 'string' ? parseInt(value, 10) : value;
	}

	static bool (value, src) {

		return typeof value === 'string' ? (value === "true" ? true : false) : value;
	}

	static area (value, src) {

		return typeof value === 'string' ? (value === "self" ? src.area : src.area.opponent) : value;
	}

	static card (value, src) {

		return typeof value === 'string' ? src : value;
	}

	static cardfilter (value, src) {

		return typeof value === 'string' ? (target => target.isType(value)) : value;
	}

	static tilefilter (value, src) {

		return typeof value === 'string' ? targets.entity : value;
	}
}

module.exports = Types;