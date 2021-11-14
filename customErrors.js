const { stderr } = require('process');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Validation Error';
    stderr.write(`${this.name}: ${message}`);
  }
}

class PathError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Path Error';
    stderr.write(`${this.name}: ${message}`);
  }
}

module.exports = {
  ValidationError,
  PathError,
};
