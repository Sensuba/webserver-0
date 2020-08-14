
class Play {

	constructor (type, src, ...params) {

		this.type = type;
		this.src = src;

		switch (type) {
		case "play": if (params.length > 0) this.targets = params; break;
		case "faculty": this.faculty = params[0]; if (params.length > 1) this.target = params[1]; break;
		case "move": this.to = params[0]; break;
		case "attack": this.target = params[0]; break;
		case "choose": break;
		default: break;
		}
	}

	get valued () {

		return this.value !== undefined;
	}

	evaluate (v, s) {

		this.value = v;
		this.state = s;
	}

	get command () {

		switch (this.type) {
		case "play": return { type: "play", id: this.src.id, targets: this.targets ? this.targets.map(t => t.id) : undefined }
		case "faculty": return { type: "faculty", id: this.src.id, faculty: this.faculty, target: this.target ? this.target.id : undefined }
		case "move": return { type: "move", id: this.src.id, to: this.to.id }
		case "attack": return { type: "attack", id: this.src.id, target: this.target.id }
		case "choose": return { type: "choose", id: this.src.id }
		default: return { type: "endturn" }
		}
	}
}

module.exports = Play;