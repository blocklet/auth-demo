const path = require('path');
const { EventEmitter } = require('events');
const util = require('util');
const DataStore = require('@abtnode/nedb');

const dataDir = process.env.BLOCKLET_DATA_DIR || './';

class BaseState extends EventEmitter {
  constructor(baseDir, options) {
    super();
    const dbOptions = options.db || {};
    this.filename = path.join(baseDir, options.filename);
    this.db = new DataStore({
      filename: this.filename,
      timestampData: true,
      autoload: true,
      ...dbOptions,
    });

    this.asyncDb = new Proxy(this.db, {
      get(target, property) {
        return util.promisify(target[property]).bind(target);
      },
    });
  }
}

module.exports = new BaseState(dataDir, {
  filename: 'posts.db',
  autoload: true,
  timestampData: true,
  onload: err => {
    if (err) {
      // eslint-disable-next-line
      console.error(`failed to load disk database ${this.filename}`, err);
    }
  },
});
