# cmd-interface
![travis](https://api.travis-ci.org/wyicwx/cmd-interface.png)

cmd-interface提供一种简单快速的方式来创建一个命令行交互式界面，通过简单的设置就可以获得强大的交互界面，并提供相关的交互函数。

##安装

```shell
npm install cmd-interface
```


```javascript
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
```



```javascript
  Usage: cmd-interface <command>

  Command:

    start                         start server                  

  Option:

    -h,--help                     help                          
    -s,--save                     save something infomation     
    -v,--version                                                
```

```javascript
var cmdInterface = require('cmd-interface');
var cmd = new cmdInterface.Commander();
```

* define

cmd的define方法定义command和option

```javascript
cmd.define({
    cmd: 'start',
    descript: 'start server',
    handler: function(parse) {
        //do something
    }
})
```


```javascript
cmd.define({
    opt: '-b,--build',
    descript: 'start server',
    handler: function(parse) {
        //do something
    }
})
```



其中parse为parseArgv解析返回的对象

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
