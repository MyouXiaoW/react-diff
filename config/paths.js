const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relative => path.resolve(appDirectory, relative);

module.exports = {
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appHTML: resolveApp('public/index.html'),
  appIndex: resolveApp('src/index.js')
};
