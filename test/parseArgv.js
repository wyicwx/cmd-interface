var parseArgv = require('../lib/util.js').parseArgv;
var assert = require('assert');
var _ = require('underscore');

describe('parseArgv', function() {
	it('传入process.argv时不会将node和运行脚本名称解析', function() {
		process.argv = ['node', 'main.js'];

		var ret = parseArgv(process.argv);

		if(ret.hasOwnProperty('node') || ret.hasOwnProperty('main.js')) {
			assert.ok(false);
		} else {
			assert.ok(true);
		}
	});

	it('解析非参数', function() {
		var ret = parseArgv(['human', 'people', 'beijing']);

		if(ret['-'].length == 3 && ret['-'][0] == 'human' && ret['-'][1] == 'people' && ret['-'][2] == 'beijing') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析-a空参数', function() {
		var ret = parseArgv(['-a']);

		if(ret.hasOwnProperty('a') && ret.a.length === 0) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析-a x单一参数', function() {
		var ret = parseArgv(['-a', 'x']);

		if(ret.hasOwnProperty('a') && ret.a.length == 1 && ret.a[0] == 'x') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析-a x y z多参数', function() {
		var ret = parseArgv(['-a', 'x', 'y', 'z']);

		if(ret.hasOwnProperty('a') && ret.a.length === 3) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析--a空参数', function() {
		var ret = parseArgv(['--a']);

		if(ret.hasOwnProperty('a') && ret.a.length === 0) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析--a x单一参数', function() {
		var ret = parseArgv(['--a', 'x']);

		if(ret.hasOwnProperty('a') && ret.a.length == 1 && ret.a[0] == 'x') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析--a x y z多参数', function() {
		var ret = parseArgv(['--a', 'x', 'y', 'z']);

		if(ret.hasOwnProperty('a') && ret.a.length === 3) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析-a --b -c= xx ddd ccc共存', function() {
		var ret = parseArgv(['-a' ,'--b', '-c=', 'xx', 'ddd', 'ccc']);

		['a', 'b', 'c'].forEach(function(item) {
			if(!ret.hasOwnProperty(item)) assert.ok(false);
			if(ret[item].length !== 0) assert.ok(false);
		});
		if(ret['-'].length === 3) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析-a=x类型', function() {
		var ret = parseArgv(['-a=x']);

		if(ret.a.length == 1 && ret.a[0] == 'x') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('解析含有换行符', function() {
		var ret = parseArgv(['-a=X\nX']);

		if(ret.a.length == 1 && ret['-'].length === 0 && ret.a[0] == 'X\nX') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('-a=1 -a=2，可以同时解析出1、2', function() {
		var ret = parseArgv(['-a=1', '-a=2']);

		if(ret.a.length == 2 && ret.a[0] == '1' && ret.a[1] == '2') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('-a 1 -a 2，可以同时解析出1、2', function() {
		var ret = parseArgv(['-a', '1', '-a', '2']);

		if(ret.a.length == 2 && ret.a[0] == '1' && ret.a[1] == '2') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}

	});

	it('混合解析--start -port 80 81 -host=localhost why I\'m in here', function() {
		var ret = parseArgv(['--start', '-port', '80', '81', '-host=localhost', 'why', 'I\'m', 'in', 'here']);

		if(ret.hasOwnProperty('start') && ret.hasOwnProperty('port') && ret.hasOwnProperty('host')) {
			if(ret.port.length == 2 && ret.port[0] == '80' && ret.port[1] == '81') {
				if(ret.host.length == 1 && ret.host[0] == 'localhost') {
					if(ret['-'].length == 4) {
						assert.ok(true);
						return;
					}
				}
			}
		}
		assert.ok(false);
	});

	it('忽略--', function() {
		var ret = parseArgv(['--']);

		if(_.size(ret) == 1 && ret.hasOwnProperty('-')) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});
});