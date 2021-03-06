var fs = require('fs');
var path = require('path');
var notifier = require('node-notifier');

var WebpackPathOrderPlugin = require('path-order-webpack-plugin');
var WebpackOnBuildPlugin = require('on-build-webpack');

var PAGE_ROOT_PATH = './app/pages',
    DIST_PATH = '/dist/src';

var NodeModuleRoot = path.join(__dirname, 'node_modules');

/**
 * 首字母大写转换
 *     1、/pages/demo/edit 转换为  DemoEdit
 *     2、支持 /pages/date-time-picker 转换为 DateTimePicker
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function upperCase(str) {
    var v = str.split('/').join(' ').replace(/\b\w+\b/g, function(word) {
        return word.substring(0,1).toUpperCase()+word.substring(1);
    });
    return v.replace(/\s/g, '').replace(/\-/g, '');
}

/**
 * 遍历整个 app/pages 目录
 * @param  {[type]}   dir      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */

var fileDirList = []; // 转换的列表
function travelDir(dir, callback) {
    var dirList = fs.readdirSync(dir);
    dirList.forEach(function(fileName) {

        var pathName = path.join(dir, fileName);

        if (fs.statSync(pathName).isDirectory()) { // 如果有二级目录
            var dirName = pathName.replace('app/pages/', '');
            if ( dirName.indexOf('/style') < 0
                && dirName.indexOf('/stores') < 0
                && dirName.indexOf('/module') < 0 ) {
                fileDirList.push(dirName);
            }
            travelDir(pathName, callback);
        } else {

        }
    });
}

function pushNotification(title, message, sound) {
    sound = sound || false;

    notifier.notify({
        title: title,
        message: message,
        sound: sound,
        icon: path.join(__dirname, 'icon.png')
    }, function (err, respond) {
        if (err) console.error(err);
    });
}

travelDir(PAGE_ROOT_PATH, function(){});

// entries = { 'aaa/bbb': './src/sss.js'}
// 入口文件的路径需要以./ 开头
// aaa/bbb 会在ouput生成 aaa/bbb.js
var entries = {}, routes = '';

fileDirList.forEach(function(dirName) {
    var viewName = upperCase(dirName);

    var fileName = 'page-' + dirName.replace(/\//g, '-');

    var viewFile = [PAGE_ROOT_PATH, dirName, viewName + 'View.jsx'].join('/');
    if (fs.existsSync(viewFile)) {
        entries[dirName] = viewFile;
        routes += '"/' + dirName.replace(/\-/g, '') + '"' + '=>"' + [DIST_PATH, dirName + '.js'].join('/') + '",\n';
    }
});


/**
 * 写入 js 到 routes.php 文件
 * @type {String}
 */
routes = '<?php return array(' + routes + ');';
fs.writeFile('./routes.php', routes, function (err) {
    if (err) {
        console.error(err);
    }
});



module.exports = {
    cache: true,
    watch: true,

    entry: entries,

    output: {
        path: 'dist/src' ,
        filename: "[name].js",
        chunkFilename: "[name].js",
        //publicPath: "/activity2-0/dist/src/"
    },

      // 是否在每次打包之前将之前的打包文件
      // 删除
      clearBeforeBuild: true,
      // 对于jquery，react,underscore之类的公共框架，我们并不需要每次都把他们打包进业务文件
      // externals就是告诉webpack，这些依赖不需要打包，并把对应的全局变量穿进去
    externals: {
      'react': 'window.React',
      'react/addons': 'window.React',
      'jquery': 'window.jQuery',
      'jQuery': 'window.jQuery',
      'underscore': 'window._',
      //'module_path/modal/Modal.jsx': 'window.XD.Modal',
      'pubsub-js': 'window.PubSub'
    },

    resolve: {
        // 别名，webpack打包的时候，会优先从别名配置的路径去寻找
        alias: {
            'base_path': path.resolve(__dirname + '/app/base'),
            'page_path': path.resolve(__dirname + '/app/pages'),
            'module_path': path.resolve(__dirname + '/app/module'),
            'template_path': path.resolve(__dirname + '/app/template'),
        },
        unsafeCache: true,
        extensions: ['', '.js', '.jsx']
    },
    module: {
        // loader 类似于gulp的pipe？对test指定的文件进行编译解析
        loaders: [
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(js|jsx)$/, loader: 'babel' },
            { test: /\.(jpg|png)$/, loader: "file-loader?name=[path][name].[ext]" }
        ],

        noParse: [
            path.join(NodeModuleRoot, 'jquery'),
        ],
    },

    // 插件
    plugins: [
        new WebpackPathOrderPlugin(),

        // 打印日志
        new WebpackOnBuildPlugin(function(stats) {
            var compilation = stats.compilation;
            var errors = compilation.errors;
            if (errors.length > 0) {
                var error = errors[0];
                pushNotification(error.name, error.message, 'Glass');
            }
            else {
                var message = 'takes ' + (stats.endTime - stats.startTime) + 'ms';

                var warningNumber = compilation.warnings.length;
                if (warningNumber > 0) {
                    message += ', with ' + warningNumber + ' warning(s)';
                }

                pushNotification('webpack building done', message);
            }
        })
    ]
};
