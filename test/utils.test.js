const utils = require('../utils');
const { caesar, rot8, atbash, helper } = utils;

describe('Helper function', () => {
  test('should encode string with given shift', () => {
    expect(helper('This is secret. Message about "_" symbol!', 1)).toBe(
      'Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!'
    );
    expect(helper('HELLO WORLD', 1)).toBe('IFMMP XPSME');
    expect(helper('This is secret. Message about "_" symbol!', 8)).toBe(
      'Bpqa qa amkzmb. Umaaiom ijwcb "_" agujwt!'
    );
    expect(helper('HELLO WORLD', 8)).toBe('PMTTW EWZTL');
  });

  test('should decode string with given shift', () => {
    expect(helper('Uijt jt tfdsfu. Nfttbhf bcpvu "_" tzncpm!', -1)).toBe(
      'This is secret. Message about "_" symbol!'
    );
    expect(helper('IFMMP XPSME', -1)).toBe('HELLO WORLD');
    expect(helper('Bpqa qa amkzmb. Umaaiom ijwcb "_" agujwt!', -8)).toBe(
      'This is secret. Message about "_" symbol!'
    );
    expect(helper('PMTTW EWZTL', -8)).toBe('HELLO WORLD');
  });

  test('should be case sensitive', () => {
    expect(helper('Hello World', 1)).toBe('Ifmmp Xpsme');
    expect(helper('AbCdEf', -1)).toBe('ZaBcDe');
    expect(helper('Hello World', 8)).toBe('Pmttw Ewztl');
    expect(helper('AbCdEf', -8)).toBe('StUvWx');
  });

  test('should convert only english letters', () => {
    expect(helper('!$#%^Првеоиуомиз!!))', 1)).toBe('!$#%^Првеоиуомиз!!))');
    expect(helper('!$#%^Првеоиуомиз!!))', -1)).toBe('!$#%^Првеоиуомиз!!))');
    expect(helper('Привет World!', 1)).toBe('Привет Xpsme!');
    expect(helper('!$#%^Првеоиуомиз!!))', 8)).toBe('!$#%^Првеоиуомиз!!))');
    expect(helper('!$#%^Првеоиуомиз!!))', -8)).toBe('!$#%^Првеоиуомиз!!))');
    expect(helper('Привет World!', 8)).toBe('Привет Ewztl!');
  });
});

describe('Caesar ciphering', () => {
  let spy = jest.spyOn(utils, 'helper');
  let res;

  afterEach(() => {
    spy.mockReset();
  });

  test('should call helper once', () => {
    res = utils.caesar('Some test string', 1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should call helper function with proper arguments', () => {
    res = utils.caesar('Some test string', 1);
    expect(spy).toHaveBeenCalledWith('Some test string', 1);

    res = utils.caesar('Some test string', 0);
    expect(spy).toHaveBeenCalledWith('Some test string', -1);

    res = utils.caesar('Some string', 0);
    expect(spy).toHaveBeenCalledWith('Some string', -1);
  });
});

describe('ROT-8 ciphering', () => {
  let spy = jest.spyOn(utils, 'helper');
  let res;

  afterEach(() => {
    spy.mockReset();
  });

  test('should call helper once', () => {
    res = utils.rot8('Some test string', 1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should call helper function with proper arguments', () => {
    res = utils.rot8('Some test string', 1);
    expect(spy).toHaveBeenCalledWith('Some test string', 8);

    res = utils.rot8('Some test string', 0);
    expect(spy).toHaveBeenCalledWith('Some test string', -8);

    res = utils.rot8('Some string', 0);
    expect(spy).toHaveBeenCalledWith('Some string', -8);
  });
});

describe('Atbash ciphering', () => {
  test('should code string', () => {
    expect(atbash('This is secret. Message about "_" symbol!')).toBe(
      'Gsrh rh hvxivg. Nvhhztv zylfg "_" hbnylo!'
    );
    expect(atbash('HELLO WORLD')).toBe('SVOOL DLIOW');
    expect(atbash('Gsrh rh hvxivg. Nvhhztv zylfg "_" hbnylo!', 0)).toBe(
      'This is secret. Message about "_" symbol!'
    );
    expect(atbash('SVOOL DLIOW')).toBe('HELLO WORLD');
  });

  test('should be case sensitive', () => {
    expect(atbash('Hello World')).toBe('Svool Dliow');
    expect(atbash('AbCdEf')).toBe('ZyXwVu');
  });
  test('should convert only english letters', () => {
    expect(atbash('!$#%^Првеоиуомиз!!))')).toBe('!$#%^Првеоиуомиз!!))');
    expect(atbash('Привет World!')).toBe('Привет Dliow!');
  });
});
