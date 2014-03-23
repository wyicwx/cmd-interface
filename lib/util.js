var util = require('util');
/**
 * parseArgv
 * @param  {Array} argv process.argv
 * @return {Object}  
 * @example
 * 		var argv = parseArgv(['-a', 'b', 'c', '-d=e', '--f=g', 'h', 'i']);
 * 		return {
 * 			'-': ['h', 'i'],
 * 			'a': ['b', 'c'],
 * 			'd': ['e'],
 * 			'f': ['g']
 * 		}
 */
function parseArgv(argv) {
	argv = argv || [];

	var ret = {
		'-': []
	};

	if(argv == process.argv) 
	//remove previous two argv: "node" and "**.js"
	argv = argv.slice(2);

	var leader = null;

	argv.forEach(function(p) {
		var match = p.match(parseArgv.OPTREGEXP);
		if(match) {
			if(match[1]) {
				match = match[1];
				if(match.match(parseArgv.SPLITREGEXP)) {
					match = match.split(parseArgv.SPLITREGEXP);
					if(ret[match[0]] && match[1]) {
						ret[match[0]].push(match[1]);
					} else {
						ret[match[0]] = match[1] ? [match[1]] : [];
					}
					leader = null;
				} else {
					leader = ret[match] ? ret[match] : (ret[match] = []);
				}
			} else {
				return;
			}
		} else {
			if(leader) {
				leader.push(p);
			} else {
				ret['-'].push(p);
			}
		}
	});

	return ret;
}
parseArgv.OPTREGEXP = /^--?([\s\S]*)/;
parseArgv.SPLITREGEXP = /=+/;

/**
 * read from process.stdin
 * @param  {String}   prompt   prompt
 * @param  {Function} callback callback
 */
function read(prompt, callback) {
	if(callback) {
		process.stdout.write(prompt + ':');
	} else {
		callback = prompt;
	}
	process.stdin.resume();
	process.stdin.setEncoding('utf-8');
	process.stdin.once('data', function(chunk) {
		// process.stdin.pause();
		// remove \r|\n
		chunk = chunk.replace(/(\n|\r)*$/, '');
		callback(chunk);
	});
}

/**
 * format string as a printf-like, support %40s
 * @param  {String} format to format string
 * @example
 * 		var formated = util.printfFormat('%s20', '1');
 * 		return '1                  '
 */
function printfFormat(format) {
	var argvs = Array.prototype.slice.call(arguments, 1);
	var match = format.match(/\%(s|j|d)\d*|\%\d*(s|j|d)/g);

	argvs.forEach(function(value, key) {
		if(match[key]) {
			var num = match[key].match(/\d+(?=$|s|j|d)/);
			var ret = match[key];

			if(num) {
				num = Number(num[0]);
				ret = ret.replace(num, '');
			}
			ret = util.format(ret, value);

			if(num) {
				if(ret.length >= num) {
					ret = ret.substr(0, num);
				} else {
					var array = new Array(num - ret.length);
					if(match[key].match(/\d+$/)) {
						array.unshift(ret);
					} else {
						array.push(ret);
					}
					ret = array.join(printfFormat.filler);
				}
			}
			format = format.replace(match[key], ret);
		} else {
			format += ' ' + value;
		}
	});

	return format;
}
printfFormat.filler = ' ';


exports.parseArgv = parseArgv;
exports.read = read;
exports.printfFormat = printfFormat;