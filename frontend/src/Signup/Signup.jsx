import styles from './Signup.module.css';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

     const signupSchema = yup.object({
        username: yup
            .string()
            .required('Username is required'),
        name: yup
            .string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

   async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
        await signupSchema.validate({ name, username, password });

        await api.post('/api/auth/signup', {
            name,
            username,
            password,
        });

        navigate('/');
    } catch (err) {
        if (err.name === 'ValidationError') {
            setError(err.message);
        } else {
            setError(
                err.response?.data?.message || 'Signup failed'
            );
        }
    }
}







    return (<>
        <div className={styles.container}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button}>Sign Up</button>
            </form>
        </div>
    
    </>
    );
}