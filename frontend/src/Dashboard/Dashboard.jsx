import { use } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
  
);





export default function Dashboard() { 
    const [strategies, setStrategies] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchStrategies() {
            try {
                const res = await api.get('/api/strategies/all');
                setStrategies(res.data.strategies);
            }
            catch (err) {
                console.error('Failed to fetch strategies:', err);
            }
        }

        fetchStrategies();
    }, []);


   function handleAddStrategy() {
        navigate('/add-strategy');
    }
    function totalstrategy() {
        return strategies.length;
    }
    function totalTrades() {
        return strategies.reduce((total, strategy) => total + strategy.totalTrades, 0);
    }
    function totalNetProfit() {
        return strategies.reduce((total, strategy) => total + strategy.netProfit, 0).toFixed(2);
    }
    
    function getAllTrades() {
        const allTrades = [];
        strategies.forEach(strategy => {
            if (strategy.trades && Array.isArray(strategy.trades)) {
                strategy.trades.forEach(trade => {
                    allTrades.push(trade);
                });
            }
        });
        return allTrades.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
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
    
    const allTrades = getAllTrades();
    const equityData = calculateEquityCurve(allTrades);

    const chartData = {
        labels: equityData.map(point => point.date),
        datasets: [
            {
                label: "Equity",
                data: equityData.map(point => point.equity),
               borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.4, 
               
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
        }
    };




    


       
   

    


    
    


    return (
        <div className={styles.container}>
           <button onClick={handleAddStrategy} className={styles.addButton}>Add Strategy</button>
            <h1>Your Strategies</h1>
            
            {strategies.length === 0 ? (
                <div className={styles.noStrategies}>
                <p>No strategies uploaded yet.</p>
                </div>
            ) : (
                <>
                <div className={styles.summary}>
                <p>Total Strategies: {totalstrategy()}</p>
                <p>Total Trades: {totalTrades()}</p>
                <p>Total Net Profit: ${totalNetProfit()}</p>
                </div>
                </>
                
            )}
            {strategies.map((strategy) => (
                <div key={strategy.id} className={styles.strategyCard} onClick={() => navigate(`/strategy/${strategy.id}`)}>
                    <h2>{strategy.name}</h2>
                    <p>Total Trades: {strategy.totalTrades}</p>
                    <p>Net Profit: ${strategy.netProfit.toFixed(2)}</p>
                    <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                    <p>Max Drawdown: {strategy.maxDrawdown.toFixed(2)}</p> 

                    <p>Created At: {new Date(strategy.createdAt).toLocaleDateString()}</p>
                    
                </div>
                
            ))}
            <div className={styles.chartContainer}>
            {allTrades.length > 0 && <Line data={chartData} options={chartOptions} />}
         </div>
        </div>
    );
}