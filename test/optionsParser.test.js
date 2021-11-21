const {
  configValidator,
  getOptionValue,
  checkFilePath,
  optionsParser,
} = require('../optionsParser');
const options = require('../constants');
const path = require('path');
const { execSync } = require('child_process');
const { PathError, ValidationError } = require('../customErrors');

describe('Config validation', () => {
  test('should return true for valid parameters', () => {
    expect(configValidator(['A', 'C1', 'C0', 'R0', 'R0', 'A', 'A', 'A'])).toBe(
      true
    );
    expect(configValidator(['A', 'A', 'C0', 'R0', 'R0', 'A'])).toBe(true);
    expect(configValidator(['R1', 'C1', 'A'])).toBe(true);
  });

  test('should return false for invalid parameters', () => {
    expect(configValidator(['A1', 'C5', 'C0', 'R0', 'R0', 'A', 'A', 'A'])).toBe(
      false
    );
    expect(configValidator(['A', 'A', 'C', 'R0', 'R0', 'A'])).toBe(false);
    expect(configValidator(['R', 'C1', 'A', ''])).toBe(false);
    expect(configValidator(['R', 'C1', 'A', '-'])).toBe(false);
  });
});

describe('Getting option', () => {
  test('should throw error when option is duplicated', () => {
    expect(() => {
      getOptionValue(options.config, [
        '-c',
        'C1-C1-R0-A',
        '-o',
        './output.txt',
        '--config',
      ]);
    }).toThrow();
    expect(() => {
      getOptionValue(options.config, [
        '-c',
        'C1-C1-R0-A',
        '-o',
        '-c',
        './output.txt',
      ]);
    }).toThrow();
    expect(() => {
      getOptionValue(options.output, [
        '-c',
        'C1-C1-R0-A',
        '-o',
        './output.txt',
        '--output',
      ]);
    }).toThrow();
    expect(() => {
      getOptionValue(options.output, [
        '-c',
        'C1-C1-R0-A',
        '-o',
        './output.txt',
        '-o',
      ]);
    }).toThrow();
    expect(() => {
      getOptionValue(options.input, ['-c', 'C1-C1-R0-A', '-c', '-i', '-i']);
    }).toThrow();
    expect(() => {
      getOptionValue(options.input, [
        '-c',
        'C1-C1-R0-A',
        '--input',
        './123.txt',
        '-i',
      ]);
    }).toThrow();
  });

  test('should return option value', () => {
    expect(
      getOptionValue(options.config, [
        '-c',
        'C1-C1-R0-A',
        '-i',
        './input.txt',
        '-o',
        './output.txt',
      ])
    ).toBe('C1-C1-R0-A');
    expect(
      getOptionValue(options.input, ['-c', 'C1-C1-R0-A', '-i', 'inputFile.txt'])
    ).toBe('inputFile.txt');
    expect(
      getOptionValue(options.output, [
        '-c',
        'C1-C1-R0-A',
        '-i',
        '--output',
        'outputFile.txt',
      ])
    ).toBe('outputFile.txt');
  });

  test('should throw error if there is no file or access rigths', () => {
    const inputPath = path.resolve(__dirname, 'input.txt');
    const outputPath = path.resolve(__dirname, 'output.txt');
    expect(() => checkFilePath(inputPath, 'Input')).toThrow();
    expect(() => checkFilePath(inputPath, 'Input')).toThrowError(PathError);
    expect(() => checkFilePath(outputPath, 'Output')).toThrow();
    expect(() => checkFilePath(outputPath, 'Output')).toThrowError(PathError);
  });
});

describe('Parsing options', () => {
  test('should throw error if there is no config option', () => {
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
  });

  test('should return valid config object', () => {
    process.argv = ['', '', '-c', 'C1', '-i', 'input.txt', '-o', 'output.txt'];
    expect(optionsParser()).toEqual({
      config: ['C1'],
      input: 'input.txt',
      output: 'output.txt',
    });
    process.argv = ['', '', '-c', 'C1-A-C1', '-i', '-o', 'output.txt'];
    expect(optionsParser()).toEqual({
      config: ['C1', 'A', 'C1'],
      input: undefined,
      output: 'output.txt',
    });
    process.argv = ['', '', '-c', 'A-A-R0-R1'];
    expect(optionsParser()).toEqual({
      config: ['A', 'A', 'R0', 'R1'],
      input: undefined,
      output: undefined,
    });
  });

  test('should throw error when config string is invalid', () => {
    process.argv = ['', '', '-c', 'C-', '-i', 'input.txt', '-o', 'output.txt'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
    process.argv = ['', '', '-c', '-C8-A0'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
    process.argv = ['', '', '-c', 'C1-R0--C1'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
  });

  test('should throw error when config parameter is missing', () => {
    process.argv = ['', '', '-c', '-i', 'input.txt', '-o', 'output.txt'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
    process.argv = ['', '', '-i', 'testFile.txt'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
    process.argv = ['', '', '--config', '-o', 'output.txt'];
    expect(() => optionsParser()).toThrow();
    expect(() => optionsParser()).toThrowError(ValidationError);
  });
});

describe('Run cipheringTool', () => {
  const toolPath = path.resolve(__dirname, '../cipheringTool.js');

  test('should throw error if there is no config parameter', () => {
    expect(() =>
      execSync(`node ${toolPath} -c`, { stdio: 'ignore' })
    ).toThrow();
    expect(() => execSync(`node ${toolPath}`, { stdio: 'ignore' })).toThrow();
    expect(() =>
      execSync(`node ${toolPath} --config`, { stdio: 'ignore' })
    ).toThrow();
    expect(() =>
      execSync(`node ${toolPath} -i "input.txt"`, { stdio: 'ignore' })
    ).toThrow();
  });

  test('should throw error if config parameter is wrong', () => {
    expect(() =>
      execSync(`node ${toolPath} -c "A-C1-"`, { stdio: 'ignore' })
    ).toThrow();
    expect(() =>
      execSync(
        `node ${toolPath} --config "A3-c0-v1" -i "input.txt" -o "output.txt`,
        { stdio: 'ignore' }
      )
    ).toThrow();
    expect(() =>
      execSync(`node ${toolPath} --config "-C1-C0-R1-R1--`, { stdio: 'ignore' })
    ).toThrow();
  });
});
