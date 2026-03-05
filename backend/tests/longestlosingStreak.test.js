const longestlosingStreak = require('../utils/longestlosingStreak');

test('longest losing streak calculation', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: -200 },
        { netProfit: 300 },
        { netProfit: -400 },
        { netProfit: -600 },
    ];
    expect(longestlosingStreak(trades)).toBe(2);
});

test('longest losing streak with all losing trades', () => {
    const trades = [
        { netProfit: -500 },
        { netProfit: -300 },
        { netProfit: -200 },
    ];
    expect(longestlosingStreak(trades)).toBe(3);
});

test('longest losing streak with consecutive wins', () => {
    const trades = [
        { netProfit: -500 },
        { netProfit: 200 },
        { netProfit: -300 },
        { netProfit: 100 },
    ];
    expect(longestlosingStreak(trades)).toBe(1);
});

test('longest losing streak with no trades', () => {
    const trades = [];
    expect(longestlosingStreak(trades)).toBe(0);
});

test('longest losing streak with all winning trades', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: 300 },
        { netProfit: 200 },
    ];
    expect(longestlosingStreak(trades)).toBe(0);
});