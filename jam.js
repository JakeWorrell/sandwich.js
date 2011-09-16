require('./lib/sandwich.js');

switch (process.argv[2]) {
	case '-build':
		if (process.argv[3] ==undefined) {
			console.log('you need to provide an input file, charles')
		} else {
			var fs = require('fs');
			fs.realpath(process.argv[3],function(err,path){
				if (err != null){
					console.log(err);
				} else {
					require(path);
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
