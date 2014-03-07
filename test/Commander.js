var Commander = require('../lib/commander.js');
var assert = require('assert');

describe('Commander', function() {
	it('隐式调用构造函数', function() {
		var cmd = Commander();

		assert.ok(cmd instanceof Commander);
	});

	it('事件式相应函数', function(done) {
		var cmd = new Commander();

		cmd.command({
			cmd: 'test',
			description: 'test'
		});

		cmd.on('test', function(data, all) {
			done();
		});

		cmd.run(['test']);
	});

	it('回调式相应', function(done) {
		var cmd = new Commander();

		cmd.command({
			cmd: 'test',
			description: 'test',
			handler: function(data, all) {
				done();
			}
		});

		cmd.run(['test']);
	});

	it('不存在opt或者cmd时候会报错', function() {
		var cmd = new Commander();
		assert.throws(function() {
			cmd.command({
				description: 'test'
			});
		});

		assert.throws(function() {
			cmd.option({
				description: 'test'
			});
		});
	});

	it('定义cmd,以-开头应该报错', function() {
		var cmd = new Commander();
		assert.throws(function() {
			cmd.command({
				cmd: '-test',
				description: 'test'
			});
		});
	});

	it('没有正确输入command时应该触发help', function(done) {
		var cmd = new Commander();
		
		cmd.command({
			cmd: 'test',
			description: 'test',

		});
		cmd.option({
			cmd: '-t,--test',
			description: '-t,--test',
		});
		cmd.on('-h,--help', function() {
			done();
		});

		cmd.run(['asdf']);
	});

	it('无参数时显示help', function(done) {
		var cmd = new Commander();
		
		cmd.on('-h,--help', function() {
			done();
		});

		cmd.run();
	});

	it('定义command,且可以正确被执行', function(done) {
		var cmd = new Commander();

		cmd.command({
			cmd: 'test',
			description: 'test',
			handler: function() {
				done();
			}
		});

		cmd.run(['test', 'all']);
	});

	it('定义option,且可以正确被执行, -b xx情况', function(done) {
		var cmd = new Commander();

		cmd.option({
			cmd: '-b,--block',
			description: '-b,--block',
			handler: function() {
				done();
			}
		});

		cmd.run(['-b', 'xx']);
	});

	it('定义option,且可以正确被执行, -b=xx情况', function(done) {
		var cmd = new Commander();

		cmd.option({
			cmd: '-b,--block',
			description: '-b,--block',
			handler: function() {
				done();
			}
		});

		cmd.run(['-b=xx']);
	});

	it('解析的参数传入handler参数', function(done) {
		var cmd = new Commander();

		cmd.option({
			cmd: '-t,--test',
			description: 'test',
			handler: function(parse) {
				if(parse && parse.t[0] == 'test' && parse.n[0] == 'never') {
					done();
				} else {
					done(false);
				}
			}
		});

		cmd.run(['-t', 'test', '-n', 'never']);
	});

	it('设置version', function() {
		var cmd = new Commander();

		cmd.version('0.0.1');
		cmd.run(['-v']);
	});
});

