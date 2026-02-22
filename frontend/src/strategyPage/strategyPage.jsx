import styles from './strategyPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
    BarElement,
  Tooltip,
  Legend,
  
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
    BarElement,
  Tooltip,
  Legend
  
);

export default function StrategyPage() {
     const [strategies, setStrategies] = useState([]);
     const [simulationData, setSimulationData] = useState([]);
     const [Slippage , setSlippage] = useState('');
     const [commission, setCommission] = useState('');
     const {id} = useParams();


      useEffect(() => {
        async function fetchStrategies() {
            try {
                const res = await api.get(`/api/strategies/${id}`);
                setStrategies([res.data]);
                setSimulationData([...res.data.trades]);
                
            }
            catch (err) {
                console.error('Failed to fetch strategies:', err);
            }
        }

        fetchStrategies();
    }, [id]);
    const sortedTrades = [...simulationData].sort((a, b) => new Date(a.date) - new Date(b.date));   
    function totalTrades() {
        return sortedTrades.length;
    }
    function totalProfit() {
        return sortedTrades.reduce((total, trade) => total + trade.netProfit, 0);
    }
    function winRate() {
        const wins = sortedTrades.filter(trade => trade.netProfit > 0).length;
        return sortedTrades.length > 0 ? (wins / sortedTrades.length) * 100 : 0;
    }
    function maxDrawdown() {
        let peak = -Infinity;
        let maxDD = 0;
        let equity = 10000;

        for (const trade of sortedTrades) {
            equity += trade.netProfit;
            if (equity > peak) peak = equity;
            const drawdown = peak - equity;
            if (drawdown > maxDD) maxDD = drawdown;
        }
        return maxDD;
    }
  
    function commissionSlippage() {
        const baseTrades = strategies[0]?.trades ;
        const simulatedtrades = baseTrades.map(trade => ({
            ...trade,
            netProfit: trade.netProfit - commission - Slippage,
        }));
        setSimulationData(simulatedtrades);
    }
    function resetSimulation() {
        setSimulationData([...strategies[0].trades]);
    }
    function calculateEquityCurve(trades) {
        let equity = 10000;
        return trades.map(trade => {
            equity += Number(trade.netProfit);
            return {
                ...trade,
                equity
            };
        });
    }
    function drawdownPoints(trades) {
        let peak = 10000;
        let equity = 10000;
        return trades.map(trade => {
            equity += Number(trade.netProfit);
            if (equity > peak) peak = equity;
            const drawdown = peak - equity;
            return {
                ...trade,
                drawdown
            };
        }
        );
    }
    
    function HistogramData(trades) {
        const initialCapital = strategies[0]?.initialCapital ?? 10000;
        if (!trades?.length) {
            return { percentages: [] };
        }
        const percentages = trades.map(trade => (trade.netProfit / initialCapital) * 100);
        return {
            percentages,
           
        };
    }
    function Expectancy(trades) {
       const AvgLoss = trades.filter(trade => Number(trade.netProfit) < 0).reduce((acc, trade) => acc + Number(trade.netProfit), 0) / trades.filter(trade => Number(trade.netProfit) < 0).length || 0;
       const AvgWin = trades.filter(trade => Number(trade.netProfit) > 0).reduce((acc, trade) => acc + Number(trade.netProfit), 0) / trades.filter(trade => Number(trade.netProfit) > 0).length || 0;
       const LossRate = trades.filter(trade => Number(trade.netProfit) < 0).length / trades.length || 0;
       const WinRate = trades.filter(trade => Number(trade.netProfit) > 0).length / trades.length || 0;
       const expectancy = (WinRate * AvgWin) + (LossRate * AvgLoss);
       return expectancy;
    }
    function AvgWin(trades) {
        const AvgWin = trades.filter(trade => Number(trade.netProfit) > 0).reduce((acc, trade) => acc + Number(trade.netProfit), 0) / trades.filter(trade => Number(trade.netProfit) > 0).length || 0;
        return AvgWin;
    }
    function AvgLoss(trades) {
        const AvgLoss = trades.filter(trade => Number(trade.netProfit) < 0).reduce((acc, trade) => acc + Number(trade.netProfit), 0) / trades.filter(trade => Number(trade.netProfit) < 0).length || 0;
        return AvgLoss;
    }
    function longestlosingStreak(trades) {
        let maxStreak = 0;
        let currentStreak = 0;
        for (const trade of trades) {
            if (Number(trade.netProfit) < 0) {
                currentStreak++;
                if (currentStreak > maxStreak) maxStreak = currentStreak;
            } else {
                currentStreak = 0;
            }
        }
        return maxStreak;
    }
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
    function groupbymonth(trades) {
        const grouped = {};
        for (const trade of trades) {
            const month = dayjs(trade.date).format('YYYY-MM');
            if (!grouped[month]) grouped[month] = [];
            grouped[month].push(trade);
        }
        return grouped;
    }
   
  

              
        

   
    
    const forDrawdown = drawdownPoints(sortedTrades);
    const allTrades = calculateEquityCurve(simulationData);
    const startdata = calculateEquityCurve(strategies[0]?.trades || []);
    const startdataWithDrawdown = drawdownPoints(strategies[0]?.trades || []);
    const histogramData = HistogramData(strategies[0]?.trades || []);
    const allhistogramData = HistogramData(simulationData);
    const expectancy = Expectancy(simulationData);
    const expectancyStartdata = Expectancy(strategies[0]?.trades || []);
    const groupedByMonth = groupbymonth(simulationData);
    const groupedByMonthStart = groupbymonth(strategies[0]?.trades || []);
   


    


     

    const barChartData = {
        labels: Object.keys(groupedByMonth).sort(),
        datasets: [
            {
                label: "Net Profit",
                data: Object.keys(groupedByMonth).sort().map(month => groupedByMonth[month].reduce((acc, trade) => acc + Number(trade.netProfit), 0)),
                backgroundColor: Object.keys(groupedByMonth).sort().map(month => groupedByMonth[month].reduce((acc, trade) => acc + Number(trade.netProfit), 0) >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 99, 132, 0.7)"),
            },
        ],
    };

    const barChartDataStart = {
        labels: Object.keys(groupedByMonthStart).sort(),
        datasets: [
            {
                label: "Net Profit",
                data: Object.keys(groupedByMonthStart).sort().map(month => groupedByMonthStart[month].reduce((acc, trade) => acc + Number(trade.netProfit), 0)),
                backgroundColor: Object.keys(groupedByMonthStart).sort().map(month => groupedByMonthStart[month].reduce((acc, trade) => acc + Number(trade.netProfit), 0) >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 99, 132, 0.7)"),
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
        }
    };





    

     



    const histogramConfig = {
        labels: histogramData.percentages.map((_, index) => `Trade ${index + 1}`),
        datasets: [
            {
                label: "Net Profit % of Initial Capital",
                data: histogramData.percentages,
                backgroundColor: histogramData.percentages.map(p => p >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 99, 132, 0.7)"),
            },
        ],
    };
    const histogramConfigSimulated = {
        labels: allhistogramData.percentages.map((_, index) => `Trade ${index + 1}`),
        datasets: [
            {
                label: "Net Profit % of Initial Capital",
                data: allhistogramData.percentages,
                backgroundColor: allhistogramData.percentages.map(p => p >= 0 ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 99, 132, 0.7)"),
            },
        ],

    };


    const linechartdrawdowmstart = {
        labels: startdataWithDrawdown.map(trade => new Date(trade.date).toLocaleDateString()),
        datasets: [
            {
                label: "Drawdown",
                data: startdataWithDrawdown.map(trade => trade.drawdown),
                fill: true,
                borderColor: "rgb(255, 99, 132)",
                 backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.1,
            },
        ],
    };

    const linechartdrawdowm = {
        labels: forDrawdown.map(trade => new Date(trade.date).toLocaleDateString()),
        datasets: [
            {
                label: "Drawdown",
                data: forDrawdown.map(trade => trade.drawdown),
                fill: true,
                borderColor: "rgb(255, 99, 132)",
                 backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.1,
            },
        ],
    };
    const equityCurveDataStart = {
        labels: startdata.map(trade => new Date(trade.date).toLocaleDateString()),
        datasets: [
            {
                label: "Equity Curve",
                data: startdata.map(trade => trade.equity),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };
    
    const equityCurveData = {
        labels: allTrades.map(trade => new Date(trade.date).toLocaleDateString()),
        datasets: [
            {
                label: "Equity Curve",
                data: allTrades.map(trade => trade.equity),
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };
    const equityCurveOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
        }
    };
    
    const histogramConfigOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
        }
    };
    



    return (<>
        <div className={styles.container}>
            <div className={styles.strategyList}>
            {strategies.map(strategy => (
                <div key={strategy.id} className={styles.strategyCard}>
                    <h3>{strategy.name}</h3>
                    <p>Total Trades: {strategy.totalTrades}</p>
                     <div className={styles.tradesInfo}>
                    {strategy.trades?.length > 0 && (
                        <p>from {new Date(strategy.trades[0].date).toLocaleDateString()} to {new Date(strategy.trades.at(-1).date).toLocaleDateString()}</p>
                    )}
                    </div>
                    <p>Total Profit: ${strategy.netProfit.toFixed(2)}</p>
                    <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                    <p>Max Drawdown: ${strategy.maxDrawdown.toFixed(2)}</p>
                    <p>Expectancy per Trade: ${expectancyStartdata.toFixed(2)}</p>
                    <p>Average Win: ${AvgWin(strategy.trades).toFixed(2)}</p>
                    <p>Average Loss: ${AvgLoss(strategy.trades).toFixed(2)}</p>
                    <p>Longest Winning Streak: {longestWinningStreak(strategy.trades)} trades</p>
                    <p>Longest Losing Streak: {longestlosingStreak(strategy.trades)} trades</p>
                
                    
                   
                    
                </div>
            ))}
           
            <div className={styles.chartContaineroriginal}>
                

                <h2>Original Equity Curve</h2>
                <div className={styles.chartWrapperoriginal}>
                <Line data={equityCurveDataStart} options={equityCurveOptions} />
                </div>
                <h2>Original Drawdown</h2>
                <div className={styles.chartWrapperoriginal}>
                <Line data={linechartdrawdowmstart} options={equityCurveOptions} />
                </div>
                    <h2>Original Net Profit % of Initial Capital per Trade</h2>
                    <div className={styles.chartWrapperoriginal}>
                    <Line data={histogramConfig} options={histogramConfigOptions} />
                    </div>
                    <div className={styles.chartWrapperoriginal}>
                    <h2>Original Net Profit per Month</h2>
                    <Bar data={barChartDataStart} options={barChartOptions} />
                    </div>

            </div>
            
            </div>
            <div className={styles.simulation}>
            <h1>Simulation Settings</h1>
            <form action="" className={styles.simulationForm} onSubmit={(e) => {
                e.preventDefault();
                commissionSlippage();
            }}>
            <label className={styles.inputLabel}>Commission per Trade ($):
                <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className={styles.input}
                />
            </label>
            <label className={styles.inputLabel}>Slippage per Trade ($):
                <input
                    type="number"
                    value={Slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className={styles.input}
                />
            </label>
            <button type="submit" className={styles.simulateButton}>Simulate</button>
            </form>
            <div className={styles.simulationResults}>
            <h2>Simulation Results</h2>
            <p>Total Trades: {totalTrades()}</p>
            <p>Total Profit: ${totalProfit().toFixed(2)}</p>
            <p>Win Rate: {winRate().toFixed(2)}%</p>
            <p>Max Drawdown: ${maxDrawdown().toFixed(2)}</p>
            <p>Expectancy per Trade: ${expectancy.toFixed(2)}</p>
            <p>Average Win: ${AvgWin(simulationData).toFixed(2)}</p>
            <p>Average Loss: ${AvgLoss(simulationData).toFixed(2)}</p>
            <p>Longest Winning Streak: {longestWinningStreak(simulationData)} trades</p>
            <p>Longest Losing Streak: {longestlosingStreak(simulationData)} trades</p>
            </div>
            <button className={styles.resetButton} onClick={resetSimulation}>Reset Simulation</button>
            </div>
            <div className={styles.chartContainer}>
                <div className={styles.chartEquityWrapper}>
            <h2>Equity Curve</h2>
            <div className={styles.chartWrapper}>
            <Line data={equityCurveData} options={equityCurveOptions} />
            
            </div>
            </div>
            <div className={styles.chartDrawdownWrapper}>
                <h2>Drawdown</h2>
                <div className={styles.chartWrapper}>
                <Line data={linechartdrawdowm} options={equityCurveOptions} />
                </div>
            </div>
            <div className={styles.chartNetProfitWrapper}>

                <h2>Net Profit % of Initial Capital per Trade</h2>
            <div className={styles.chartWrapper}>
                <Line data={histogramConfigSimulated} options={histogramConfigOptions} />
            </div>
            </div>
            <div className={styles.chartNetProfitWrapperpermonth}>
                <h2>Net Profit per Month</h2>
            <div className={styles.chartWrapper}>
                <Bar data={barChartData} options={barChartOptions} />
                </div>
                </div>
            </div>
            <div className={styles.monteCarlo}>
                <h2>Monte Carlo Simulation</h2>
                
            </div>
            
        </div>
    </>);
}