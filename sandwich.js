function sandwich(){};
sandwich.jsFiles = Array();

sandwich.js = function(script) {
	this.jsFiles.push(script);
	if (typeof module == 'undefined') {
		document.write('<script src="', script , '" type="text/javascript"><\/script>');
	}
	return this;
}


if (typeof process !== 'undefined') { /* running through node.js */

	sandwich.getJs = function(path){
		var out = '/* js sandwiched by sandwich.js */';
		var fs = require('fs'), added = 0;
		
		for (f in this.jsFiles){
			data =fs.readFileSync(path +'/'+this.jsFiles[f]);
			out += '\n' + data.toString();	
		}
		return out;
	}

	switch (process.argv[2]) {
		case '-build':
			if (process.argv[3] == undefined) {
				console.log('you need to provide an input file')
			} else {
				var path = require('path');
				var fs = require('fs');
				fs.realpath(process.argv[3],function(err,p){
					if (err != null){
						console.log(err);
					} else {
						fs.readFile(p,function(err,data){
							eval(data.toString());
							var output = sandwich.getJs(path.dirname(p));
							console.log(output);
						});
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
}



