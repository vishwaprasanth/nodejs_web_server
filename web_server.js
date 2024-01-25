const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const {logger} = require('./middleware/logEvents.js');
const errorHandler = require('./middleware/errorHandler.js')
const PORT = process.env.PORT || 3500;

app.use(logger)

// Cross origin resourse sharing
const whitelist = ['http://localhost:3500','https://www.google.com']
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else {
            callback(new Error('Not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, './public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, 'new-page.html');
});

app.get('/hello(.html)?', (req, res, next) => {
    console.log('hello.html page trying to load');
    next();
}, (req, res) => {
    res.send('hello... ');
});

const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res) => {
    console.log('three')
    res.send('Finished!')
}

app.get('/chain(.html)?',[one, two, three])

app.get('/*', (req, res) => {
   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.all('/*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.acceptsLanguages('json')){
        res.json({"error": "404 Not Found" })
    }else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));