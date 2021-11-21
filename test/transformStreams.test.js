const streams = require('../transformStreams');
const utils = require('../utils');

describe('Transform streams', () => {
  const caesar = jest.spyOn(utils, 'caesar');
  const rot8 = jest.spyOn(utils, 'rot8');
  const atbash = jest.spyOn(utils, 'atbash');

  test('should call proper ciphering function', () => {
    const c1 = new streams.C1();
    const c0 = new streams.C0();
    const r1 = new streams.R1();
    const r0 = new streams.R0();
    const a = new streams.A();

    c1._transform('chunk!', 'utf8', () => {});
    c0._transform('chunk', 'utf8', () => {});
    r1._transform('chunk12', 'utf8', () => {});
    r0._transform('SomeChunk', 'utf8', () => {});
    a._transform('Some String', 'utf8', () => {});

    expect(caesar).toHaveBeenCalled();
    expect(caesar).toHaveBeenCalledTimes(2);
    expect(caesar).toHaveBeenNthCalledWith(1, 'chunk!', 1);
    expect(caesar).toHaveBeenNthCalledWith(2, 'chunk', 0);

    expect(rot8).toHaveBeenCalled();
    expect(rot8).toHaveBeenCalledTimes(2);
    expect(rot8).toHaveBeenNthCalledWith(1, 'chunk12', 1);
    expect(rot8).toHaveBeenNthCalledWith(2, 'SomeChunk', 0);

    expect(atbash).toHaveBeenCalled();
    expect(atbash).toHaveBeenCalledTimes(1);
    expect(atbash).toHaveBeenCalledWith('Some String');
  });
});
