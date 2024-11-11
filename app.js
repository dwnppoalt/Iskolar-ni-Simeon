const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/indexRouter');
const loginRouter = require('./routes/loginRouter'); 
const thesisRouter = require('./routes/thesisRouter');

const {authMiddleware, jwtMiddleware} = require('./public/scripts/auth'); 

const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); 
app.use(cookieParser());


app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));



app.use("/login", loginRouter); 
app.use("/", authMiddleware, jwtMiddleware, indexRouter); 
app.use("/", authMiddleware, jwtMiddleware, thesisRouter);

app.all('*', (req, res) => {
    res.status(404).render("./404.ejs",
        {
            picture: req.session.picture,
            currentRoute: req.originalUrl,
        }
    )
});

// Start the server
app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
});
