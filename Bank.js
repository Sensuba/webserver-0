var Bank = (() => {

	this.list = {};

	init = (api, callback, error) => {

		let step = 0, data = [];
	    [1, 2].forEach(n => api.get("/vault/cardmodels?part=" + n)
	  	.then(response => {
	  		var atob = require('atob');
	  		response.data.forEach(el => this.list[el.idCardmodel] = Object.assign(el, JSON.parse(atob(el.supercode))));
	  		data = data.concat(response.data);
	  		step++;
	  		if (step == 2)
	  			callback(data);
	  	})
	  	.catch(error));
	}

	get = model => {

		if (typeof model === "object") {

			if (model.idCardmodel || model.nameCard)
				return model;

			var parent = get(model.parent);
			parent.tokens[model.token].parent = parent;
			return Object.assign({}, parent.tokens[model.token], {notoken: model.token});
		}
		return Object.assign({}, this.list[model]);
	};

	return {
		init: init,
		get: get,
		list: () => Object.assign({}, this.list)
	}
})();

module.exports = Bank;