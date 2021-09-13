const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 1337;

const index = require('./routes/index');
const insert = require('./routes/insert');
const search = require('./routes/search');
const getAll = require('./routes/getAll');
const update = require('./routes/update');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use('/', index);
app.use('/insert', insert);
app.use('/search', search);
app.use('/getAll', getAll);
app.use('/update', update);

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});

app.listen(port, () => console.log(`Example API listening on port ${port}!`));