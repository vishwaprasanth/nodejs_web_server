const express = require('express');
const app = express();
const path = require('path');
const logEvents = require('./middleware/logEvents.js')
const PORT = process.env.PORT || 3500;

app.use((req, res, next) => {
    logEvents(`${req.method}\t ${req.headers.orgin}\t ${req.path}\t`,'reqLog.txt'), 
    console.log(`${req.method} ${req.path}`)
    next();
})

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));