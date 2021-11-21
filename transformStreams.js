const { Transform } = require('stream');
const utils = require('./utils');

class C1 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = utils.caesar(chunk.toString('utf8'), 1);
    this.push(transformChunk);
    callback();
  }
}

class C0 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = utils.caesar(chunk.toString('utf8'), 0);
    this.push(transformChunk);
    callback();
  }
}

class R1 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = utils.rot8(chunk.toString('utf8'), 1);
    this.push(transformChunk);
    callback();
  }
}

class R0 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = utils.rot8(chunk.toString('utf8'), 0);
    this.push(transformChunk);
    callback();
  }
}

class A extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = utils.atbash(chunk.toString('utf8'));
    this.push(transformChunk);
    callback();
  }
}

module.exports = { C1, C0, R1, R0, A };
