const path = require('path');
const fs = require('fs');
const { optionsParser, checkFilePath } = require('./optionsParser');
const { pipeline } = require('stream');
const cipher = require('./transformStreams');

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
  process.exit(1);
}

const reader = options.input
  ? fs.createReadStream(options.input, {
      encoding: 'utf8',
      highWaterMark: 1,
    })
  : process.stdin;
const writer =
  options.output && fs.existsSync(options.output)
    ? fs.createWriteStream(options.output, {
        encoding: 'utf8',
        highWaterMark: 1,
        flags: 'a+',
      })
    : process.stdout;

const transformArray = options.config.map((item) => new cipher[item]());

pipeline([reader, ...transformArray, writer], (err) => {
  if (err) {
    process.stderr.write('Something went wrong! ', err.message);
    process.exit(1);
  }
});
