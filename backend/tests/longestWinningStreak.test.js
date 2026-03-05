const longestWinningStreak = require('../utils/longestWinningStreak');

test('longest winning streak calculation', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: -200 },
        { netProfit: 300 },
        { netProfit: -400 },
        { netProfit: 600 },
        { netProfit: 700 },
    ];
    expect(longestWinningStreak(trades)).toBe(2);
});

test('longest winning streak with all winning trades', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: 300 },
        { netProfit: 200 },
    ];
    expect(longestWinningStreak(trades)).toBe(3);
});

test('longest winning streak with consecutive losses', () => {
    const trades = [
        { netProfit: 500 },
        { netProfit: -200 },
        { netProfit: -300 },
        { netProfit: -100 },
    ];
    expect(longestWinningStreak(trades)).toBe(1);
});

test('longest winning streak with no trades', () => {
    const trades = [];
    expect(longestWinningStreak(trades)).toBe(0);
});

test('longest winning streak with all losing trades', () => {
    const trades = [
        { netProfit: -500 },
        { netProfit: -300 },
        { netProfit: -200 },
    ];
    expect(longestWinningStreak(trades)).toBe(0);
});