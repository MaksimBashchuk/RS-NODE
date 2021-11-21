const { Transform } = require('stream');

const helper = (str, step) => {
  return [...str].reduce((acc, item) => {
    const pos = item.charCodeAt();
    if (item.match(/[A-Z]/)) {
      return (acc += String.fromCharCode(((pos - 65 + 26 + step) % 26) + 65));
    } else if (item.match(/[a-z]/)) {
      return (acc += String.fromCharCode(((pos - 97 + 26 + step) % 26) + 97));
    }

    return (acc += item);
  }, '');
};

const caesar = (str, code) => {
  const step = code ? 1 : -1;
  return helper(str, step);
};

const rot8 = (str, code) => {
  const step = code ? 8 : -8;
  return helper(str, step);
};

const atbash = (str) => {
  return [...str].reduce((acc, item) => {
    const pos = item.charCodeAt();
    if (item.match(/[A-Z]/)) {
      return (acc += String.fromCharCode(Math.abs(pos - 65 - 26) + 64));
    } else if (item.match(/[a-z]/)) {
      return (acc += String.fromCharCode(Math.abs(pos - 97 - 26) + 96));
    }

    return (acc += item);
  }, '');
};

class C1 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = caesar(chunk.toString('utf8'), 1);
    this.push(transformChunk);
    callback();
  }
}

class C0 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = caesar(chunk.toString('utf8'), 0);
    this.push(transformChunk);
    callback();
  }
}

class R1 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = rot8(chunk.toString('utf8'), 1);
    this.push(transformChunk);
    callback();
  }
}

class R0 extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = rot8(chunk.toString('utf8'), 0);
    this.push(transformChunk);
    callback();
  }
}

class A extends Transform {
  constructor() {
    super({ highWaterMark: 1 });
  }

  _transform(chunk, encoding, callback) {
    const transformChunk = atbash(chunk.toString('utf8'));
    this.push(transformChunk);
    callback();
  }
}

module.exports = { C1, C0, R1, R0, A };
