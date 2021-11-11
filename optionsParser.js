const constants = require('./constants');

const configValidator = (configArr) => {
  return configArr.every((item) => /A|C1|C0|R1|R0/.test(item));
};

const getOptionValue = (option, args, resultObj) => {
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
  options.config = getOptionValue(constants.config, args, options).split('-');
  options.input = getOptionValue(constants.input, args, options);
  options.output = getOptionValue(constants.output, args, options);

  if (!configValidator(options.config)) {
    process.stderr.write('An error has occurred. Wrong config string\n');
    process.exit(1);
  }

  if (!options.config.length) {
    process.stderr.write(`An error has occurred. Config paramener is required!\n
    Use ${constants.config.shortFlag}, ${constants.config.longFlag} to setup cipher configuration\n`);
    process.exit(1);
  }

  return options;
};

module.exports = optionsParser;
