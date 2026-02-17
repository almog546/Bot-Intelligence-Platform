import { use } from 'react';
import styles from './Dashboard.module.css';
import { data, useNavigate } from 'react-router-dom';
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
         
        </div>
    );
}