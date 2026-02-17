const prisma = require('../prismaClient');
const csv = require("csv-parse/sync"); 

async function uploadStrategy(req, res) {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

   
    const fileContent = req.file.buffer.toString("utf8");

    
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const totalTrades = records.length;

    const netProfit = records.reduce((acc, trade) => {
      return acc + Number(trade.netProfit);
    }, 0);

    const winTrades = records.filter(
      (trade) => Number(trade.netProfit) > 0
    ).length;

    const winRate =
      totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
      const userId = req.session.userId;

      const name = req.body.name ;
      function calculateMaxDrawdown(records) {
       let equity = 0;
       let peak = 0;
       let worst = 0;
        for (const trade of records) {
          equity += Number(trade.netProfit);
          if (equity > peak) {
            peak = equity;
          }
          const drawdown = peak - equity;
          if (drawdown > worst) {
            worst = drawdown;
          }
        }
        return worst;
      }
      const maxDrawdown = calculateMaxDrawdown(records);

      function calculateEquityCurve(records) {
        let equity = 0;
       return records.map((trade) => {
          equity += Number(trade.netProfit);
         return{
          equity,
          date : trade.date,
        }
        }
        );
      }
    
      

      
      

    const strategy = await prisma.strategy.create({
      data: {  
       name,
        totalTrades,
        netProfit,
        winRate,
        maxDrawdown: Number(maxDrawdown),
        fileName: req.file.originalname,
        fileUrl: "",
        createdAt: new Date(),
        user: { connect: { id: userId } },

      },


    });

    
    res.json({
      strategyId: strategy.id,
      totalTrades,
      netProfit,
      winRate,
      maxDrawdown,
     
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

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
            
            createdAt: true,
        },
    });
    res.status(200).json({ strategies });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
}
}


module.exports = {
    getStrategies,
    uploadStrategy,
    
};
