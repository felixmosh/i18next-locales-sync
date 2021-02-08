const { vol, fs: memfs } = require('memfs');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const basePath = path.resolve('./test/fixtures');
const fixtures = glob.sync(path.join(basePath, '/**/*.json'));

const fileSystemJson = fixtures.reduce((result, filepath) => {
  const relativePath = path.relative(basePath, filepath);
  result[`./${relativePath}`] = fs.readFileSync(filepath, { encoding: 'utf8' });
  return result;
}, {});

vol.fromJSON(fileSystemJson, basePath);

module.exports = {
  existsSync: function mockExistsSync(filepath) {
    return memfs.existsSync(filepath);
  },
  ensureFileSync: function mockEnsureFileSync(filepath) {
    if (!memfs.existsSync(filepath)) {
      memfs.mkdirSync(path.dirname(filepath), { recursive: true });
      memfs.writeFileSync(filepath, '');
    }
  },
  readJSONSync: function mockReadJSONSync(filepath, options) {
    const data = memfs.readFileSync(filepath, options);
    return JSON.parse(data);
  },
  writeJSONSync: function mockWriteJSONSync(filepath, data, options) {
    return memfs.writeFileSync(filepath, JSON.stringify(data, null, options.space));
  },
};
