 function calculateEquityCurve(trades) {
        let equity = 10000;
        return trades.map(trade => {
            equity += Number(trade.netProfit);
            return {
                date: new Date(trade.date).toLocaleDateString(),
                equity,
            };
        });
    }

module.exports = calculateEquityCurve;