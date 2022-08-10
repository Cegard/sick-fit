import formatMoney from '../lib/formatMoney';

describe('format Money function', () => {
  it('works with fractional dollars', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(9)).toEqual('$0.09');
    expect(formatMoney(40)).toEqual('$0.40');
    expect(formatMoney(140)).toEqual('$1.40');
  });

  it('leaves off cents when its whole dollars', () => {
    expect(formatMoney(5000)).toEqual('$50.00');
    expect(formatMoney(100)).toEqual('$1.00');
  });

  it('works with whole and fraction dollars', () => {
    expect(formatMoney(140)).toEqual('$1.40');
    expect(formatMoney(1410)).toEqual('$14.10');
  });
});
