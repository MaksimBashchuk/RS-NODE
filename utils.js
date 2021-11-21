const utils = {
  helper(str, step) {
    return [...str].reduce((acc, item) => {
      const pos = item.charCodeAt();
      if (item.match(/[A-Z]/)) {
        return (acc += String.fromCharCode(((pos - 65 + 26 + step) % 26) + 65));
      } else if (item.match(/[a-z]/)) {
        return (acc += String.fromCharCode(((pos - 97 + 26 + step) % 26) + 97));
      }

      return (acc += item);
    }, '');
  },

  caesar(str, code) {
    const step = code ? 1 : -1;
    return this.helper(str, step);
  },

  rot8(str, code) {
    const step = code ? 8 : -8;
    return this.helper(str, step);
  },

  atbash(str) {
    return [...str].reduce((acc, item) => {
      const pos = item.charCodeAt();
      if (item.match(/[A-Z]/)) {
        return (acc += String.fromCharCode(Math.abs(pos - 65 - 26) + 64));
      } else if (item.match(/[a-z]/)) {
        return (acc += String.fromCharCode(Math.abs(pos - 97 - 26) + 96));
      }

      return (acc += item);
    }, '');
  },
};

module.exports = utils;
