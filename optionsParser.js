const fs = require('fs');
const { F_OK, R_OK, W_OK } = require('constants');
const constants = require('./constants');
const { ValidationError, PathError } = require('./customErrors');

const configValidator = (configArr) => {
  return configArr.every((param) => /^(A|C1|C0|R1|R0)$/.test(param));
};

const getOptionValue = (option, args) => {
  const isDuplicated =
    args.filter((arg) => arg === option.shortFlag || arg === option.longFlag)
      .length > 1;

  if (isDuplicated) {
    throw new ValidationError('Duplication of parameters is not allowed!\n');
  }

  const idx =
    args.indexOf(option.shortFlag) === -1
      ? args.indexOf(option.longFlag)
      : args.indexOf(option.shortFlag);

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
      fs.accessSync(path, F_OK | R_OK);
    } catch (e) {
      throw new PathError(
        `${fileType} file doesn't exist or you don't have permissions!`
      );
    }
  }

  if (path && fileType === 'Output') {
    try {
      fs.accessSync(path, F_OK | W_OK);
    } catch (e) {
      throw new PathError(
        `${fileType} file doesn't exist or you don't have permissions!`
      );
    }
  }
};

module.exports = {
  optionsParser,
  checkFilePath,
  configValidator,
  getOptionValue,
};
