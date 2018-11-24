var targets = require('../Event').targets;

class Types {

	static int (value, src) {

		return (typeof value === 'string' ? parseInt(value, 10) : value) || 0;
	}

	static bool (value, src) {

		return (typeof value === 'string' ? (value === "true" ? true : false) : value) || false;
	}

	static area (value, src) {

		return typeof value === 'string' ? (value === "self" ? src.area : src.area.opposite) : value;
	}

	static card (value, src) {

		return typeof value === 'string' ? src : value;
	}

	static cardfilter (value, src) {

		return typeof value === 'string' ? (target => target.isType(value)) : value;
	}

	static tilefilter (value, src) {

		if (!(typeof value === 'string'))
			return value;
		switch (value) {
		case 'empty': return targets.empty;
		case 'entity': return targets.entity;
		case 'character': return targets.character;
		case 'hero': return targets.hero;
		case 'figure': return targets.figure;
		case 'artifact': return targets.artifact;
		case 'friendly': return targets.friendly;
		case 'friendly empty': return targets.friendlyEmpty;
		case 'friendly entity': return targets.friendlyEntity;
		case 'friendly character': return targets.friendlyCharacter;
		case 'friendly figure': return targets.friendlyFigure;
		case 'enemy': return targets.enemy;
		case 'enemy empty': return targets.enemyEmpty;
		case 'enemy entity': return targets.enemyEntity;
		case 'enemy character': return targets.enemyCharacter;
		case 'enemy figure': return targets.enemyFigure;
		default: return targets.tile;
		}
	}
}

module.exports = Types;