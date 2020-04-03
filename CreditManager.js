module.exports = (() => {

var init = api => {

	this.api = api;
}

var compute = (time, log, floor = true) => {

	var t = (time)/1000;
	var a = Math.max(0, log-150);
	var c = Math.max(0, (2.145+(-2.145-0.027)/(1+Math.pow(t/278, 1.93))) * (a/(a+100)) * 12);
	return floor ? Math.floor(c) : c;
}

var creditPlayer = (name, credit) => {

	if (credit > 0)
		this.api.post("/admin/credits", { username: name, credit: credit, mode: "+" }).catch(e => console.log(e));
}

return {
	init,
	compute,
	creditPlayer
}

})()