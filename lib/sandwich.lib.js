
function sandwich(){};

sandwich.jsFiles = Array();
sandwich.js = function(script) {
	this.jsFiles.push(script);
	if (typeof module == 'undefined') {
		document.write('<script src="', script , '" type="text/javascript"><\/script>');
	}
	return this;
}

if (typeof module !== 'undefined' && module.exports) {
	
	sandwich.getJs = function(path){
		var out = '/* js sandwiched by sandwich.js */';
		var fs = require('fs'), added = 0;
		for (f in this.jsFiles){
			data =fs.readFileSync(path +'/'+this.jsFiles[f])
			out += '\n' + data.toString();	
		}
		return out;
	}

	module.exports = sandwich;
}

