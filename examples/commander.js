#!/usr/bin/env node

var Commander = require('../').Commander;

var cmd = new Commander({
	name: 'cmd-interface'
});

cmd.option({
	cmd: '-s,--save',
	description: 'save something infomation',
	handler: function() {
		conosle.log('save handler!');
	}
});

cmd.command({
	cmd: 'start',
	description: 'start server',
	handler: function() {
		console.log('start server!');
	}
});

cmd.version('0.0.1');
cmd.run();