const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 1337;
const httpServer = require("http").createServer(app);

const index = require("./routes/index");
const insert = require("./routes/insert");
const search = require("./routes/search");
const getAll = require("./routes/getAll");
const getAllByUser = require("./routes/getAllByUser");
const update = require("./routes/update");
const register = require("./routes/register");
const login = require("./routes/login");

const io = require("socket.io")(httpServer, {
    cors: {
        // origin: "http://localhost:8080",
        origin: "https://www.student.bth.se",
        methods: ["GET", "POST"]
    }
});

let previousRoom;

io.sockets.on("connection", function (socket) {
    socket.on("join", function (room) {
        socket.leave(previousRoom);
        socket.join(room);
        previousRoom = room;
        // console.log("Joined room: ", room);
        // console.log(io.sockets.adapter.rooms.get(room));
        socket.to(room).emit("sync");
    });
    socket.on("doc", function (data) {
        socket.to(data["_id"]).emit("doc", data);
    });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
}

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use("/", index);
app.use("/insert", insert);
app.use("/search", search);
app.use("/getAll", getAll);
app.use("/getAllByUser", getAllByUser);
app.use("/update", update);
app.use("/register", register);
app.use("/login", login);

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

const server = httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
