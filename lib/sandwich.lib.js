
function sandwich(){};

sandwich.jsFiles = Array();
sandwich.js = function(script) {
	this.jsFiles.push(script);
	return this;
}

if (typeof module !== 'undefined' && module.exports) {
	sandwich.getJs = function(path){
		var fs = require('fs');
		for (f in this.jsFiles){
			fs.readFile(path +'/'+this.jsFiles[f],null,function(err,data){
				console.log(data.toString());
			});
		}
	}
}

module.exports = sandwich;