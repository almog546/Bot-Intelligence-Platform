function calculateMaxDrawdown(records) {
      let equity = 10000;
      let peak = 10000;
      let worst = 0;

      for (const trade of records) {
        equity += trade.netProfit;

        if (equity > peak) peak = equity;

        const drawdown = peak - equity;

        if (drawdown > worst) worst = drawdown;
      }

      return worst;
    }
    
module.exports = calculateMaxDrawdown;