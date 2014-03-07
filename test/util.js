var util = require('../lib/util.js');
var assert = require('assert');

describe('printfFormat', function() {
	it('无填充参数', function() {
		var str = '%s %d %j';

		if(util.printfFormat(str) == str) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('固定长度 %20s', function() {
		var formated = util.printfFormat('%20s', ' ');
		if(formated.length == 20) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('不超过设置长度 %20s', function() {
		var formated = util.printfFormat('%20s', '1234567890123456789012345678901234567890');

		if(formated.length == 20) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('右靠 %20s', function() {
		var formated = util.printfFormat('%20s', '1');

		if(formated.slice(formated.length-1, formated.length) == '1') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('左靠 %s20', function() {
		var formated = util.printfFormat('%s20', '1');

		if(formated.slice(0, 1) == '1') {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('支持 %10s %10d %10j', function() {
		var formated = util.printfFormat('%10s%10d%10j', '123', '321asd', {a:'b',c:'d',e:'f',g:'h'});

		if(formated.length == 30) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('支持不带长度', function() {
		var opt = ['asdf', '123', {a:'b',c:'d',e:'f',g:'h'}];
		var length = 0;

		opt.forEach(function(value) {
			if(typeof value == 'object') {
				length += JSON.stringify(value).length;
			} else {
				length += value.length;
			}
		});
		opt.unshift('%s%d%j');
		var formated = util.printfFormat.apply(null, opt);
		if(formated.length == length) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});

	it('参数数量大于定义时数量, 自动补全', function() {
		var formated = util.printfFormat('%20s', 1, 2, 3);

		if(formated.length == 24) {
			assert.ok(true);
		} else {
			assert.ok(false);
		}
	});
});

describe('read', function() {
	it('可以接受到shell输入', function(done) {
		var str = 'test';
		util.read(function(data) {
			if(data == str) {
				done();
			} else {
				done(false);
			}
		});
		process.stdin.push(str);
	});

	it('带提示', function(done) {
		var str = 'test';

		util.read(str, function(data) {
			if(data == str) {
				done();
			} else {
				done(false);
			}
		});
		process.stdin.push(str);
	});
});