

class User {

	constructor (socket,id, manager, name, avatar) {

		this.socket = socket;
		this.id = id;
		socket.user = this;
		this.manager = manager;
		this.name = name;
		this.avatar = avatar;
		this.waitingList = [];
	}

	emit (n, data) {

		if (this.disconnected || this.waitingList.length > 0) {
			this.waitingList.push({n , data});
		}
		else this.socket.emit(n, data);
	}

	disconnect () {

		this.disconnected = true;
	}

	reconnect (socket) {

		this.socket = socket;
		socket.user = this;
		delete this.disconnected;
		while (this.waitingList.length > 0) {
			var not = this.waitingList.shift();
			this.socket.emit(not.n, not.data);
		}
	}
}

module.exports = User;