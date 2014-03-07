var _ = require('underscore');
var util = require('./util.js');
var EE = require('events').EventEmitter;
var u = require('util');

function _init(Self) {
	Self.option({
		cmd: '-h,--help',
		description: 'help',
		visible: false,
		handler: function() {
			_help(Self);
		}
	});
}

function _help(Self) {
	console.log('');
	console.log('  Usage: %s <command>', Self.name);
	console.log('');
	if(Self.showCmdCount) {
		console.log('  Command:');
		console.log('');
		_.each(Self.cmds, function(option, name) {
			var log = util.printfFormat('    %s30%s30', name, option.description);
			console.log(log);
		});
		console.log('');
	}

	if(Self.showOptionCount) {
		console.log('  Option:');
		console.log('');
		_.each(Self.options, function(option, name) {
			if(option.visible) {
				var log = util.printfFormat('    %s30%s30', name, option.description);
				console.log(log);
			}
		});
		console.log('');
	}
}

function _polishName(name) {
	name = name.trim();
	name = name.split(/\s*,\s*/).join(',').replace(/\s/g, '');

	return name;
}

function Commander(opt) {
	if(!(this instanceof Commander)) {
		return new Commander(opt);
	}
	EE.call(this);
	opt || (opt = {});

	this.name = opt.name || this.name;
	this.cmds = {};
	this.showCmdCount = 0;
	this.options = {};
	this.showOptionCount = 0;
	this.mapCmd = {};

	_init(this);
}
u.inherits(Commander, EE);

Commander.prototype.name = 'Commander';

/**
 * define
 * @param  {Object} opt option
 * @return {Commander}     self
 * @example
 * 		var cmd = new Commander();
 * 		cmd.define({
 * 			cmd: 'run',
 * 			descript: 'run something at remote',
 * 			handler: function() {
 * 				//do something..
 * 			}
 * 		});
 *
 * 		cmd.define({
 * 			opt: '-n,--n'
 * 		});
 */
Commander.prototype.option = function(opt) {
	var commandHolder = {},
		Self = this,
		cmdName;

	if(opt.cmd) {
		cmdName = _polishName(opt.cmd);
		commandHolder.visible = opt.visible !== false;
		cmdName.split(',').forEach(function(n) {
			Self.mapCmd[n] = cmdName;
		});
		if(commandHolder.visible) Self.showOptionCount++;
		if(opt.handler) {
			Self.on(cmdName, opt.handler);
		}
		commandHolder.description = opt.description || '';
		Self.options[cmdName] = commandHolder;
	} else{
		throw new Error('define() argument must be has cmd .');
	}

	


	return this;
};

Commander.prototype.command = function(opt) {
	var commandHolder = {},
		Self = this,
		cmdName;

	if(opt.cmd) {
		cmdName = _polishName(opt.cmd);
		if(cmdName.match(/^-+/)) {
			throw new Error('  define cmd must be not has -');
		}
		Self.mapCmd[cmdName] = cmdName;
		Self.showCmdCount++;
		if(opt.handler) {
			Self.on(cmdName, opt.handler);
		}
		commandHolder.description = opt.description || '';
		Self.cmds[cmdName] = commandHolder;
	} else{
		throw new Error('define() argument must be has cmd.');
	}

	return this;
};
Commander.prototype.emit = function() {
	var argv = _.toArray(arguments);

	if(argv[0] in this.mapCmd) {
		argv[0] = this.mapCmd[argv[0]];
	}
	EE.prototype.emit.apply(this, argv);

	return this;
};

/**
 * run 
 * @param  {Array} argv  like-as process.argv
 */
Commander.prototype.run = function(argv) {
	argv = argv || process.argv;
	if(argv == process.argv) {
		argv = argv.slice(2);
	}

	var command = argv[0];
	if(command) {
		command = command.split('=')[0];
		if(command in this.mapCmd) {
			var parseArgv = util.parseArgv(argv);
			this.emit(command, parseArgv);
			return this;
		}
	}
	this.help();

	return this;
};

Commander.prototype.help = function() {
	this.emit('--help');

	return this;
};

Commander.prototype.version = function(version) {
	this.option({
		cmd: '-v,--version',
		handler: function() {
			console.log('');
			console.log('  version: '+version);
			console.log('');
		}
	});

	return this;
};
module.exports = Commander;