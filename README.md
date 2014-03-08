# cmd-interface
![travis](https://api.travis-ci.org/wyicwx/cmd-interface.png)

cmd-interface提供一种简单快速的方式来创建一个命令行交互式界面，通过简单的设置就可以获得强大的交互界面，并提供相关的交互函数。

##安装

```shell
npm install cmd-interface
```

##简单配置

```javascript
#!/usr/bin/env node

var Commander = require('cmd-interface').Commander;

var cmd = new Commander({
	name: 'cmd-interface'
});

cmd.option({
	cmd: '-s,--save',
	description: 'save something infomation',
	handler: function(parse) {
		conosle.log('save handler!');
	}
});

cmd.option({
	cmd: '-hi,--hidden',
	description: 'hidden option',
	visible: false,
	handler: function(parse) {
		conosle.log('hidden handler!');
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
```

运行后可见界面

```javascript
  Usage: cmd-interface <command>

  Command:

    start                         start server                  

  Option:

    -s,--save                     save something infomation     
    -v,--version                                                
```

Commander继承自EventEmitter，可以通过添加事件的方式来添加handler

```javascript
cmd.on('start', function(parse) {
    console.log('  start handler again!');
});
```
事件名同传入cmd.command的cmd参数，添加option的handler事件名为全称且中间不能有空格
```javascript
cmd.on('-s,--save', function(parse) {
    console.log('  save handler again!');
});
```

parse为[parseArgv()](#parseargv)函数解析返回的对象


option()通过传入参数visible=false不在输出help

```
cmd.option({
	cmd: '-hi,--hidden',
	description: 'hidden option',
	visible: false,
	handler: function(parse) {
		conosle.log('save handler!');
	}
});
```

设置版本号

```
cmd.version('0.0.1');
```

输出help
```
cmd.help();
```


## Util

util提供交互函数

```javascript
var util = require('cmd-interface').util;
```

####*parseArgv*

解析process.argv，返回格式如下

```
 var argv = util.parseArgv(['-a', 'b', 'c', '-d=e', '--f=g', 'h', 'i']);
 return {
 	'_': ['h', 'i'],
 	'a': ['b', 'c'],
 	'd': ['e'],
 	'f': ['g']
 }
```

####*read*

命令行交互函数

```
 util.read('input something', function(data) {
    conosle.log(data);
 });
```

####*printfFormat*

提供类似c的printf格式化函数，可以设置宽度，%s、$d、$j参数参看[util.format](http://nodejs.org/api/util.html#util_util_format_format)

```
 var read = util.printfFormat('%4s%s4', '$', '$');
 read = '$      $'
```

##LICENSES

The MIT License (MIT)

Copyright (c) 2014 wyicwx<[wyicwx@gmail.com](mailto:wyicwx@gmail.com)>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
