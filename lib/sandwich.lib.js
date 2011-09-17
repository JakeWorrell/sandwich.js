var sandwich = function(){};

sandwich.js = function(){
	for (arg in arguments) {
		console.log(arguments[arg]);
	}
}

module.exports = sandwich;