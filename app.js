const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const indexRouter = require('./routes/indexRouter');
const loginRouter = require('./routes/loginRouter'); 
const authMiddleware = require('./public/scripts/auth'); 

const app = express();
const PORT = 8080;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 


app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour session 
    }
}));

app.use("/login", loginRouter); 
app.use("/", authMiddleware, indexRouter); 

// Start the server
app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
});