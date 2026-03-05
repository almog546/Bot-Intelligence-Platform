const calculateMaxDrawdown = require('../utils/calculateMaxDrawdown');

test('drawdown calculation', () => {
    const trades = [

        { netProfit: 500 },
        { netProfit: -200 },
        { netProfit: 300 },
        { netProfit: -400 },
        { netProfit: 600 },
    ];
    expect(calculateMaxDrawdown(trades)).toBe(400);
});

test('drawdown with all winning trades', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: 300 },
        { netProfit: 200 },
    ];
    expect(calculateMaxDrawdown(trades)).toBe(0);
});
test('drawdown with consecutive losses', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: -200 },
        { netProfit: -300 },
        { netProfit: -100 },
    ];

    expect(calculateMaxDrawdown(trades)).toBe(600);
});

test('drawdown with no trades', () => {
    const trades = [];
    expect(calculateMaxDrawdown(trades)).toBe(0);
});
