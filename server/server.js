const express = require('express');
const path = require('path');
const browserify = require('browserify');
const watchify = require('watchify');
const fs = require('fs');

const browserifyWithWatchify = browserify({
  entries: 'lib/index.js',
  debug: true,
  cache: {},
  packageCache: {},
  plugin: [watchify],
  transform: ['babelify']
});

browserifyWithWatchify.on('update', bundle);

function bundle() {
  browserifyWithWatchify.bundle().pipe(fs.createWriteStream('./dist/bundle.js'));
}

bundle();

const app = express();

// app.all('*', function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*'); //项目上线后改成页面的地址
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
// });

//使用静态文件
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../example/index.html'));
});

app.listen(8000);
