const fs = require('fs');
const { F_OK, R_OK, W_OK } = require('constants');
const constants = require('./constants');
const { ValidationError, PathError } = require('./customErrors');

const configValidator = (configArr) => {
  return configArr.every((item) => /^(A|C1|C0|R1|R0)$/.test(item));
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
    throw new ValidationError('Duplication of parameters is not allowed!\n');
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
  options.config = getOptionValue(constants.config, args);
  if (!options.config) {
    throw new ValidationError(
      `Config parameter is required!\n
      Use ${constants.config.shortFlag}, ${constants.config.longFlag} to setup cipher configuration\n`
    );
  }

  options.config = options.config.split('-');
  options.input = getOptionValue(constants.input, args);
  options.output = getOptionValue(constants.output, args);

  if (!configValidator(options.config)) {
    throw new ValidationError('Wrong config string\n');
  }

  if (!options.config.length) {
    throw new ValidationError(
      `Config parameter is required!\n
      Use ${constants.config.shortFlag}, ${constants.config.longFlag} to setup cipher configuration\n`
    );
  }

  return options;
};

const checkFilePath = (path, fileType) => {
  if (path && fileType === 'Input') {
    try {
      fs.access(path, F_OK | R_OK);
    } catch (e) {
      throw new PathError(
        `${fileType} file doesn't exist or you don't have permissions!`
      );
    }
  }

  if (path && fileType === 'Output') {
    try {
      fs.access(path, F_OK | W_OK);
    } catch (e) {
      throw new PathError(
        `${fileType} file doesn't exist or you don't have permissions!`
      );
    }
  }
};

module.exports = { optionsParser, checkFilePath };
