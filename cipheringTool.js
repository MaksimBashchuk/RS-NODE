const path = require('path');
const { optionsParser, checkFilePath } = require('./optionsParser');

const options = optionsParser();

options.input = options.input ? path.resolve(__dirname, options.input) : null;
options.output = options.output
  ? path.resolve(__dirname, options.output)
  : null;

checkFilePath(options.input, 'Input');
checkFilePath(options.output, 'Output');
