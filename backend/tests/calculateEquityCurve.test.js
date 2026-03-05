const  calculateEquityCurve  = require('../utils/calculateEquityCurve');

test('equity curve calculation', () => {
  const trades = [
    { netProfit: 500 },
    { netProfit: -200 },
    { netProfit: 300 },
    { netProfit: -400 },
    { netProfit: 600 },
  ];
  expect(calculateEquityCurve(trades)).toEqual([
    { date: new Date(trades[0].date).toLocaleDateString(), equity: 10500 },
    { date: new Date(trades[1].date).toLocaleDateString(), equity: 10300 },
    { date: new Date(trades[2].date).toLocaleDateString(), equity: 10600 },
    { date: new Date(trades[3].date).toLocaleDateString(), equity: 10200 },
    { date: new Date(trades[4].date).toLocaleDateString(), equity: 10800 },
  ]);
});

test('equity curve with no trades', () => {
  expect(calculateEquityCurve([])).toEqual([]);
});

test('equity curve with all winning trades', () => {
  const trades = [
    { netProfit: 500 },
    { netProfit: 300 },
    { netProfit: 200 },
  ];
  expect(calculateEquityCurve(trades)).toEqual([
    { date: new Date(trades[0].date).toLocaleDateString(), equity: 10500 },
    { date: new Date(trades[1].date).toLocaleDateString(), equity: 10800 },
    { date: new Date(trades[2].date).toLocaleDateString(), equity: 11000 },
  ]);
});

test('equity curve with all losing trades', () => {
  const trades = [
    { netProfit: -500 },
    { netProfit: -300 },
    { netProfit: -200 },
  ];
  expect(calculateEquityCurve(trades)).toEqual([
    { date: new Date(trades[0].date).toLocaleDateString(), equity: 9500 },
    { date: new Date(trades[1].date).toLocaleDateString(), equity: 9200 },
    { date: new Date(trades[2].date).toLocaleDateString(), equity: 9000 },
  ]);
});

test('equity curve handles string netProfit', () => {
  const trades = [
    { netProfit: "500" },
    { netProfit: "-200" },
  ];
  expect(calculateEquityCurve(trades)).toEqual([
    { date: new Date(trades[0].date).toLocaleDateString(), equity: 10500 },
    { date: new Date(trades[1].date).toLocaleDateString(), equity: 10300 },
  ]);
});