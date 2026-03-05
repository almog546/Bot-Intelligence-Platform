const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(express.json());

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);




app.set("trust proxy", 1);

app.use(
    session({
        name: 'sid',
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        },
    }),
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/strategies", require("./routes/strategyRoutes"));

app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on port ' + PORT));