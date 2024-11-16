const express = require('express');
const router = express.Router();
const { SessionAuthentication } = require('../public/scripts/auth');
require('dotenv').config();
const sessAuth = new SessionAuthentication(process.env.SESSIONSECRET);

router.get('/search', (req, res, next) => {
    const query = req.query.q || "";
    const decryptedSession = sessAuth.decrypt(JSON.parse(Buffer.from(req.cookies.session, 'base64').toString('utf8')))
    res.render("./search.ejs", {
        picture: decryptedSession.picture,
        currentRoute: req.originalUrl,
        token: req.cookies.authorization,
        server_api: process.env.SERVER_API,
        searchQuery: query
    });
});

router.get('/thesis/:id', async (req, res, next) => {
    const decryptedSession = sessAuth.decrypt(JSON.parse(Buffer.from(req.cookies.session, 'base64').toString('utf8')))
    try {
        const response = await fetch(`${process.env.SERVER_API}/thesis?uuid=` + req.params.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.authorization}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                return res.redirect('/login');
            }
            return res.status(response.status).send('Error fetching thesis');
        }

        const thesis = await response.json();

        if (!thesis.data) {
            return res.status(404).render("./404.ejs", {
                picture: decryptedSession.picture,
                currentRoute: req.originalUrl,
            });
        };

        res.render("./thesis.ejs", {
            picture: decryptedSession.picture,
            currentRoute: req.originalUrl,
            thesis: thesis.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/read/:id', async (req, res, next) => {
    console.log(req.params.id);
    try {
        // const response = await fetch(`${process.env.SERVER_API}/accessthesis?uuid=${req.params.id}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${req.cookies.authorization}`
        //     }
        // })
        // .then(res => {
        //     if (!res.ok) {
        //         if (res.status === 401) {
        //             return res.redirect('/login');
        //         }
        //         return res.status(res.status).render("./404.ejs", {
        //             picture: req.session.picture,
        //             currentRoute: req.originalUrl,
        //         });
        //     }
        //     return res.json();
        // })

        // const thesis = await response

        const thesis = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf'
        res.render("./read.ejs", {
            title: "SAMPLE",
            pdfLink: thesis,
        });

    } catch (err) {
        console.error('Error: ', err)
    }
});

module.exports = router;