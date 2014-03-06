
/**
 * parseArgv
 * @param  {[type]} argv [description]
 * @return {[type]}      [description]
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
					ret[match[0]] = match[1] ? [match[1]] : [];
					leader = null;
				} else {
					leader = ret[match] = [];
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




exports.parseArgv = parseArgv;