 function longestWinningStreak(trades) {
        let maxStreak = 0;
        let currentStreak = 0;
        for (const trade of trades) {
            if (Number(trade.netProfit) > 0) {
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
        }
        return maxStreak;
    }

module.exports = longestWinningStreak;