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
}

module.exports = Types;