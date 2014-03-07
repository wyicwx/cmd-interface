var _ = require('underscore');
var util = require('./util.js');
var EE = require('events').EventEmitter;
var u = require('util');

function _init(Self) {
	Self.define({
		opt: '-h,--help',
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
			var log = util.printfFormat('    %s30%s30', name, option.description);
			console.log(log);
		});
		console.log('');
	}
}

function _polishName(name) {
	name = name.trim();
	name = name.split(/\s*,\s*/).join(',');

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
Commander.prototype.define = function(opt) {
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
		Self.cmds[cmdName] = commandHolder;
	} else if(opt.opt) {
		cmdName = _polishName(opt.opt);
		commandHolder.visible = opt.visible !== false;
		cmdName.split(',').forEach(function(n) {
			Self.mapCmd[n] = cmdName;
		});
		Self.options[cmdName] = commandHolder;
		if(commandHolder.visible) Self.showOptionCount++;
	} else{
		throw new Error('define() argument must be has cmd or opt.');
	}

	
	if(opt.handler) {
		Self.on(cmdName, opt.handler);
	}
	commandHolder.description = opt.description || '';
};

Commander.prototype.emit = function() {
	var argv = _.toArray(arguments);

	if(argv[0] in this.mapCmd) {
		argv[0] = this.mapCmd[argv[0]];
	}
	EE.prototype.emit.apply(this, argv);
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
			this.emit(command, parseArgv[command], parseArgv);
		}
	}
	this.emit('--help');
};

module.exports = Commander;