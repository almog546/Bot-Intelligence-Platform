const prisma = require('../prismaClient');
const csv = require("csv-parse/sync"); 

async function uploadStrategy(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileContent = req.file.buffer.toString("utf8");

    
    const records = csv.parse(fileContent, {
      columns: header =>
        header.map(h =>
          h.trim().toLowerCase().replace(/\s+/g, "")
        ),
      skip_empty_lines: true,
    });

    
    const normalizedRecords = records.map(row => ({
      date: row.date,
      netProfit: Number(row.netprofit),
    }));

    
    const cleanRecords = normalizedRecords.filter(
      trade =>
        trade.date &&
        !isNaN(trade.netProfit)
    );

    if (cleanRecords.length === 0) {
      return res.status(400).json({ message: "No valid trades found" });
    }

    
    cleanRecords.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const totalTrades = cleanRecords.length;
    const initialCapital = 10000;
  

    const netProfit = cleanRecords.reduce(
      (acc, trade) => acc + trade.netProfit,
      0
    );

    const equityAfterTrades = initialCapital + netProfit;

    const winTrades = cleanRecords.filter(
      trade => trade.netProfit > 0
    ).length;

    const winRate =
      totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;

    const userId = req.session.userId;
    const name = req.body.name || "Unnamed Strategy";

    
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

    const maxDrawdown = calculateMaxDrawdown(cleanRecords);
   
    

    
    const strategy = await prisma.strategy.create({
      data: {
        name,
        totalTrades,
        netProfit,
        winRate,
        maxDrawdown,
        fileName: req.file.originalname,
        fileUrl: "",
        initialCapital,
        equityAfterTrades,
        createdAt: new Date(),
        user: { connect: { id: userId } },
      },
    });

   
    await prisma.trade.createMany({
      data: cleanRecords.map(trade => ({
        date: new Date(trade.date),
        netProfit: trade.netProfit,
        strategyId: strategy.id,
      })),
    });

    res.status(201).json({
      strategyId: strategy.id,
      totalTrades,
      netProfit,
      winRate,
      maxDrawdown,
      initialCapital,
      equityAfterTrades

    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}


async function getStrategies(req, res) {
    const userId = req.session.userId;
    try {
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const strategies = await prisma.strategy.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            totalTrades: true,
            netProfit: true,
            winRate: true,
            maxDrawdown: true,
            initialCapital: true,
            equityAfterTrades: true,
            createdAt: true,
            trades: {
                select: {
                    date: true,
                    netProfit: true,
                }
            },
        },
    });
    res.status(200).json({ strategies });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
}
}

async function getStrategyTrades(req, res) {
  const { id } = req.params;

  const trades = await prisma.trade.findMany({
    where: { strategyId: id },
    orderBy: { date: "asc" },
  });

  res.json(trades);
}
async function getStrategy(req, res) {
    const { id } = req.params;

    const strategy = await prisma.strategy.findUnique({
      where: { id: id },
      include: {
        trades: {
          orderBy: { date: "asc" },
        },
      },
    });
    
    if (!strategy) {
      return res.status(404).json({ message: "Strategy not found" });
    }

    res.json(strategy);
}

module.exports = {
    getStrategies,
    uploadStrategy,
    getStrategyTrades,
    getStrategy,
};
