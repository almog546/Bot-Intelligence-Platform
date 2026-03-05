const aliasMap = {
  date: [
    'date', 'tradedate', 'trade_date', 'datetime', 'timestamp', 'time',
    'datestart', 'dateend'        
  ],
  netProfit: [
    'netprofit', 'net_profit', 'profit', 'net', 'pnl',
    'rpnl', 'upnl'                  
  ],
  name: ['name', 'strategyname', 'strategy_name', 'strategy'],
  totalTrades: ['totaltrades', 'total_trades', 'trades', 'total'],
  winRate: ['winrate', 'win_rate', 'win'],
  maxDrawdown: ['maxdrawdown', 'max_drawdown', 'drawdown', 'maxdd'],
  initialCapital: ['initialcapital', 'initial_capital', 'capital', 'initial'],
  equityAfterTrades: ['equityaftertrades', 'equity_after_trades', 'equity', 'after_trades'],
};

function mapAliases(record) {
    const mappedRecord = {};
    for (const [key, aliases] of Object.entries(aliasMap)) {
        for (const alias of aliases) {
            if (record.hasOwnProperty(alias)) {
                mappedRecord[key] = record[alias];
                break;
            }
        }
    }
    return mappedRecord;
}

module.exports = {
    mapAliases,
};