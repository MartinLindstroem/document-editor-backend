const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 1337;

const index = require('./routes/index');
const hello = require('./routes/hello');

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
app.use('/hello', hello);

// app.get("/", (req, res) => {
//     const data = {
//         data: {
//             msg: "Hello World!"
//         }
//     };

//     res.json(data);
// });

// app.get("/hello/:msg", (req, res) => {
//     const data = {
//         data: {
//             msg: req.params.msg
//         }
//     };

//     res.json(data);
// });

// app.get("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a GET request"
//         }
//     });
// });

// app.post("/user", (req, res) => {
//     res.status(201).json({
//         data: {
//             msg: "Got a POST request"
//         }
//     });
// });

// app.put("/user", (req, res) => {
//     res.status(204).json({
//         data: {
//             msg: "Got a PUT request"
//         }
//     });
// });

// app.delete("/user", (req, res) => {
//     res.status(204).json({
//         data: {
//             msg: "Got a DELETE request"
//         }
//     });
// });

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