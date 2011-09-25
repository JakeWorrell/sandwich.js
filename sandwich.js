function sandwich(){};
sandwich.jsFiles = Array();
sandwich.cssFiles = Array();

sandwich.js = function(path) {
	this.jsFiles.push(path);
	if (typeof module == 'undefined') {
		document.write('<script src="', path , '" type="text/javascript"><\/script>');
	}
	return this;
}

sandwich.css = function(path) {
	this.jsFiles.push(path);
	if (typeof module == 'undefined') {
		document.write('<link rel="stylesheet" href="', path , '" type="text/css" charset="utf-8">');
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

	sandwich.concatJs = function(file,base) {

		var path = require('path');
		var fs = require('fs');
		fs.realpath(file,function(err,p){
			if (err != null){
				console.log(err);
			} else {
				fs.readFile(p,function(err,data){
					if (base == undefined) {
						base = path.dirname(p);
					}
					eval(data.toString());
					var output = sandwich.getJs(base);
					console.log(output);
				});
			}
		});
	}

	/** Command-line options parser (http://valeriu.palos.ro/1026/).
	    Copyright 2011 Valeriu Paloş (valeriu@palos.ro). All rights reserved.
	    Released as Public Domain.

	    Expects the "schema" array with options definitions and produces the
	    "options" object and the "arguments" array, which will contain all
	    non-option arguments encountered (including the script name and such).

	    Syntax:
	        [«short», «long», «attributes», «brief», «callback»]

	    Attributes:
	        ! - option is mandatory;
	        : - option expects a parameter;
	        + - option may be specified multiple times (repeatable).

	    Notes:
	        - Parser is case-sensitive.
	        - The '-h|--help' option is provided implicitly.
	        - Parsed options are placed as fields in the "options" object.
	        - Non-option arguments are placed in the "arguments" array.
	        - Options and their parameters must be separated by space.
	        - Either one of «short» or «long» must always be provided.
	        - The «callback» function is optional.
	        - Cumulated short options are supported (i.e. '-tv').
	        - If an error occurs, the process is halted and the help is shown.
	        - Repeatable options will be cumulated into arrays.
	        - The parser does *not* test for duplicate option definitions.
	    */

	var schema = [
	    ['f', 'file',    '!:', "Input js file that configures sandwich",
	                           function(data) {
	                               sandwich.concatJs(data,options.base);
	                           } ],
	    ['b', 'base',    ':',  'Base path to load files relatively to']
	];

	// Parse options.
	try {
	    var tokens = [];
	    var options = {};
	    var arguments = [];
	    for (var i = 0, item = process.argv[0]; i < process.argv.length; i++, item = process.argv[i]) {
	        if (item.charAt(0) == '-') {
	            if (item.charAt(1) == '-') {
	                tokens.push('--', item.slice(2));
	            } else {
	                tokens = tokens.concat(item.split('').join('-').split('').slice(1));
	            }
	        } else {
	            tokens.push(item);
	        }
	    }
	    while (type = tokens.shift()) {
	        if (type == '-' || type == '--') {
	            var name = tokens.shift();
	            if (name == 'help' || name == 'h') {
	                throw 'help';
	                continue;
	            }
	            var option = null;
	            for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
	                if (item[type.length - 1] == name) {
	                    option = item;
	                    break;
	                }
	            }
	            if (!option) {
	                throw "Unknown option '" + type + name + "' encountered!";
	            }
	            var value = true;
	            if ((option[2].indexOf(':') != -1) && !(value = tokens.shift())) {
	                throw "Option '" + type + name + "' expects a parameter!";
	            }
	            var index = option[1] || option[0];
	            if (option[2].indexOf('+') != -1) {
	                options[index] = options[index] instanceof Array ? options[index] : [];
	                options[index].push(value);
	            } else {
	                options[index] = value;
	            }
	            if (typeof(option[4]) == 'function') {
	                option[4](value);
	            }
	            option[2] = option[2].replace('!', '');
	        } else {
	            arguments.push(type);
	            continue;
	        }
	    }
	    for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
	        if (item[2].indexOf('!') != -1) {
	            throw "Option '" + (item[1] ? '--' + item[1] : '-' + item[0]) +
	                  "' is mandatory and was not given!";
	        }
	    }
	} catch(e) {
	    if (e == 'help') {
	        console.log("Usage: ./«script» «options» «values»\n");
	        console.log("Options:");
	        for (var i = 0, item = schema[0]; i < schema.length; i++, item = schema[i]) {
	            var names = (item[0] ? '-' + item[0] + (item[1] ? '|' : ''): '   ') +
	                        (item[1] ? '--' + item[1] : '');
	            var syntax = names + (item[2].indexOf(':') != -1 ? ' «value»' : '');
	            syntax += syntax.length < 20 ? new Array(20 - syntax.length).join(' ') : '';
	            console.log("\t" + (item[2].indexOf('!') != -1 ? '*' : ' ')
	                             + (item[2].indexOf('+') != -1 ? '+' : ' ')
	                             + syntax + "\t" + item[3]);
	        }
	        console.log("\n\t  (* mandatory option)\n\t  (+ repeatable option)\n");
	        process.exit(0);
	    }
	    console.error(e);
	    console.error("Use  the '-h|--help' option for usage details.");
	    process.exit(1);
	}

}



