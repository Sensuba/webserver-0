const targets = {

	tile: (src, target) => true,
	empty: (src, target) => target.isEmpty,
	entity: (src, target) => target.occupied && target.card.isType("entity"),
	character: (src, target) => targets.entity(src, target) && target.card.isType("character"),
	hero: (src, target) => targets.entity(src, target) && target.card.isType("hero"),
	figure: (src, target) => targets.entity(src, target) && target.card.isType("figure"),
	artifact: (src, target) => targets.entity(src, target) && target.card.isType("artifact"),
	friendly: (src, target) => src.area === target.area,
	friendlyEmpty: (src, target) => targets.friendly(src, target) && targets.empty(src, target),
	friendlyEntity: (src, target) => targets.friendly(src, target) && targets.entity(src, target),
	friendlyCharacter: (src, target) => targets.friendly(src, target) && targets.character(src, target),
	friendlyFigure: (src, target) => targets.friendly(src, target) && targets.figure(src, target),
	enemy: (src, target) => !targets.friendly(src, target),
	enemyEmpty: (src, target) => targets.enemy(src, target) && targets.empty(src, target),
	enemyEntity: (src, target) => targets.enemy(src, target) &&targets. entity(src, target),
	enemyCharacter: (src, target) => targets.enemy(src, target) && targets.character(src, target),
	enemyFigure: (src, target) => targets.enemy(src, target) && targets.figure(src, target)
};

class Event {

	constructor (action, requirement) {

		this.action = action;
		this.requirement = requirement;
	}

	execute (gameboard, target) {

		if (!this.requirement || this.requirement(target))
			this.action(target);
		gameboard.update();
	}

	static get targets () {

		return targets;
	}
}

module.exports = Event;