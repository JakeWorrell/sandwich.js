

switch (process.argv[2]) {
	case '-build':
		if (process.argv[3] ==undefined) {
			console.log('you need to provide an input file, charles')
		} else {
			var path = require('path');
			var fs = require('fs');
			fs.realpath(process.argv[3],function(err,p){
				if (err != null){
					console.log(err);
				} else {
					sandwich = require('./lib/sandwich.lib.js');
					require(p);
					sandwich.getJs(path.dirname(p));
				}
			});
		}
	break;
	case '-v':
	case '--version':
		console.log('sandwich.js v0.1\nBy Jake Worrell\nmmm... Delicious!');
	break;
	default:
		console.log('option not recognised');
	break;
}
