var _ = require('underscore');
var parse = require('minimist');

function _init(Self) {
	Self.define({
		opt: 'help',
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
	if(_.size(Self.cmds)) {
	conosle.log('  Command:');
	console.log('');
	}

	if(_.size(Self.options)) {
	console.log(' Option:');
	console.log('');
	}
}


function Commander(opt) {
	if(!this instanceof Commander) {
		return new Commander(opt);
	}
	opt || (opt = {});

	this.name = opt.name || this.name;
	this.cmds = {};
	this.options = {};
}

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
 */
commander.define = function(opt) {
	var commandHolder;
	if(opt.cmd) {
		opt.cmd = opt.cmd.trim();
		commandHolder = this.cmds[opt.cmd] = {};
	} else if(opt.opt) {
		opt.opt.trim();
		commandHolder = this.options[opt.opt] = {};
		commandHolder.visible = !!opt.visible;
	}

	if(commandHolder) {
		commandHolder.handler = opt.handler || function() {};
		commandHolder.description = opt.description || '';
	}
};

commander.trigger = function(name, cmd) {
	var argv = jt.utils.clone(jt.argv);

	name = cmdMap[name];

	cmd = cmd || [];
	if(option[name]) {
		option[name].handler(cmd, argv);
	} else {
		command[name].handler(cmd, argv);
	}
};

commander.run = function() {

	for(var i in jt.argv) {
		if(i in cmdMap) {
			commander.trigger(i, jt.argv[i]);
			return;
		}
	}

	commander.trigger('help');
	return;
};

module.exports = Commander;