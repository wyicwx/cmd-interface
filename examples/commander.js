#!/usr/bin/env node

var Commander = require('../').Commander;

var cmd = new Commander({
	name: 'cmd-interface'
});

cmd.option({
	cmd: '-s,--save',
	description: 'save something infomation',
	handler: function(parse) {
		console.log('save handler!');
	}
});

cmd.option({
	cmd: '-H,--hidden',
	description: 'hidden option',
	visible: false,
	handler: function(parse) {
		console.log('hidden option!');
	}
});


cmd.command({
	cmd: 'start',
	description: 'start server',
	handler: function(parse) {
		console.log('start server!');
	}
});

cmd.version('0.0.1');
cmd.run();