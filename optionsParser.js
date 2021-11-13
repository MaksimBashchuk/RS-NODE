const fs = require('fs');
const { F_OK, R_OK, W_OK } = require('constants');
const constants = require('./constants');

const configValidator = (configArr) => {
  return configArr.every((item) => /A|C1|C0|R1|R0/.test(item));
};

const getOptionValue = (option, args) => {
  const idx =
    args.indexOf(option.shortFlag) === -1
      ? args.indexOf(option.longFlag)
      : args.indexOf(option.shortFlag);
  const lastIdx =
    args.lastIndexOf(option.shortFlag) === -1
      ? args.lastIndexOf(option.longFlag)
      : args.lastIndexOf(option.shortFlag);

  if (idx !== lastIdx) {
    process.stderr.write(
      'An error has occurred. Duplication of parameters is not allowed!\n'
    );
    process.exit(1);
  }

  if (
    args[idx + 1] &&
    constants.optionsArr.every((item) => item !== args[idx + 1])
  ) {
    return args.splice(idx, 2)[1];
  }
};

const optionsParser = () => {
  const options = {
    config: [],
    input: null,
    output: null,
  };

  const args = process.argv.slice(2);
  options.config = getOptionValue(constants.config, args).split('-');
  options.input = getOptionValue(constants.input, args);
  options.output = getOptionValue(constants.output, args);

  if (!configValidator(options.config)) {
    process.stderr.write('An error has occurred. Wrong config string\n');
    process.exit(1);
  }

  if (!options.config.length) {
    process.stderr.write(`An error has occurred. Config parameter is required!\n
    Use ${constants.config.shortFlag}, ${constants.config.longFlag} to setup cipher configuration\n`);
    process.exit(1);
  }

  return options;
};

const checkFilePath = (path, fileType) => {
  const cb = (err) => {
    if (err) {
      process.stderr.write(
        `An error has occured. ${fileType} file doesn't exist or you don't have permissions!`
      );
      process.exit(1);
    }
  };

  if (path && fileType === 'Input') {
    fs.access(path, F_OK | R_OK, cb);
  }
  if (path && fileType === 'Output') {
    fs.access(path, F_OK | W_OK, cb);
  }
};

module.exports = { optionsParser, checkFilePath };
