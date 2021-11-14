const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');
const stream = require('stream');
const { optionsParser, checkFilePath } = require('./optionsParser');
const cipher = require('./transformStreams');
const { ValidationError } = require('./customErrors');

let options = {};

try {
  options = optionsParser();

  options.input = options.input ? path.resolve(__dirname, options.input) : null;
  options.output = options.output
    ? path.resolve(__dirname, options.output)
    : null;

  checkFilePath(options.input, 'Input');
  checkFilePath(options.output, 'Output');
} catch (e) {
  // process.stderr.write(e.message);
  process.exit(1);
}

const reader = options.input
  ? fs.createReadStream(options.input, {
      encoding: 'utf8',
      highWaterMark: 1,
    })
  : stdin;
const writer =
  options.output && fs.existsSync(options.output)
    ? fs.createWriteStream(options.output, {
        encoding: 'utf8',
        highWaterMark: 1,
        flags: 'a+',
      })
    : stdout;

const transform = stream.compose(
  ...options.config.map((item) => new cipher[item]())
);
reader.pipe(transform).pipe(writer);
