const express = require('express');
const jwt = require('jsonwebtoken');
const { SessionAuthentication } = require('../public/scripts/auth');
const router = express.Router();
require('dotenv').config();

const sessAuth = new SessionAuthentication(process.env.SESSIONSECRET);

router.get('/', (req, res) => {
    res.render('login', {
        oauthid: process.env.OAUTHCLIENTID,
        server_api: `${process.env.SERVER_API}/login`,
        origin: process.env.ORIGIN,
        libraryKey: process.env.LIBRARY_API_KEY
    });
});

router.post('/setup-session', (req, res) => {
    const { userId, name, picture, jwtToken } = req.body;
    if (userId === "guest") {
        const encryptedAuthCookie = Buffer.from(JSON.stringify(sessAuth.encrypt(jwtToken))).toString('base64');
        res.cookie('authorization', encryptedAuthCookie, {maxAge: 1000 * 60 * 60, httpOnly: true});
       //helo edric 
        const sessionData = {
             userId: "guest",
             name: "Guest",
             picture: "public/images/guest.png"
        };
        const encryptedData = Buffer.from(JSON.stringify(sessAuth.encrypt(sessionData))).toString('base64');

        res.cookie('session', encryptedData, {maxAge: 1000 * 60 * 60, httpOnly: true});
        res.status(200).send("Session setup successful");
        
    }
    else if (userId) {
        const encryptedAuthCookie = Buffer.from(JSON.stringify(sessAuth.encrypt(jwtToken))).toString('base64');
        res.cookie('authorization', encryptedAuthCookie, { maxAge: 1000 * 60 * 60, httpOnly: true});

        const sessionData = {
            userId,
            name,
            picture
        };
        const encryptedData = Buffer.from(JSON.stringify(sessAuth.encrypt(sessionData))).toString('base64');

        res.cookie('session', encryptedData, { maxAge: 1000 * 60 * 60, httpOnly: true});
        res.status(200).send("Session setup successful");
    } else {
        res.status(400).send("Invalid user data");
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('authorization');
    res.clearCookie('session');
    res.redirect('/');

});

module.exports = router;