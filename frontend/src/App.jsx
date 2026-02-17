import { useState,useEffect } from 'react'
import Signup from './Signup/Signup';
import { Routes, Route} from 'react-router-dom';
import Login from './Login/Login';
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar.jsx'
import Dashboard from './Dashboard/Dashboard.jsx';
import api from './api/axios';
import Compare from './Compare/Compare.jsx';
import Settings from './Settings/Settings.jsx';
import AddStrategy from './addStrategy/addStrategy.jsx';
import StrategyPage from './strategyPage/strategyPage.jsx';



function App() {
   const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
     const [logout, setLogout] = useState(false);
      const navigate = useNavigate();

  async function onLogout() {
        try {
            const res = await api.post('/api/auth/logout');
            if (res.status === 200) {
                setUser(null);
                setLogout(true);
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

            

     useEffect(() => {
    async function fetchUser() {
        try {
            const res = await api.get('/api/auth/me');
            if (res.status === 200) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    fetchUser();
}, []);
if (loading) {
    return <div>Loading...</div>;
}
 

  return (
    <>
    {user && <Navbar onLogout={onLogout} />}
    <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/" element={user ? <Dashboard /> : <Login />} />
    <Route path="/compare" element={user ? <Compare /> : <Login />} />
    <Route path="/settings" element={user ? <Settings /> : <Login />} />
    <Route path="/add-strategy" element={user ? <AddStrategy /> : <Login />} />
    <Route path="/strategy/:id" element={user ? <StrategyPage /> : <Login />} />
     </Routes>
    </>
  )
}

export default App
