const database = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../db/config.json");

const auth = {
    registerUser: async function (res, collection, body) {
        const username = body.username;
        const password = body.password;

        if (!username || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    msg: "Username or password missing",
                }
            });
        }

        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        msg: "bcrypt error"
                    }
                });
            }

            let db;

            try {
                db = await database.getDb(collection);

                const data = {
                    username: body.username,
                    password: hash,
                };

                await db.collection.insertOne(data);

                return res.status(201).json({
                    data: {
                        message: "User successfully registered"
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "database error",
                        detail: e.msg
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    login: async function (res, body) {
        const username = body.username;
        const password = body.password;

        if (!username || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    message: "Username or password is missing"
                }
            });
        }

        let db;

        try {
            db = await database.getDb("users");

            const filter = { username: username };

            const user = await db.collection.findOne(filter);

            if (user) {
                return auth.comparePasswords(res, password, user);
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        message: "User not found"
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    message: "database error",
                    detail: e.msg
                }
            });
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: function (res, password, user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        msg: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { username: user.username };
                let jwtToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "24h" });

                return res.json({
                    data: {
                        message: "Successfully logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    message: "Incorrect password"
                }
            });
        });
    },

    checkToken: function (req, res, next) {
        let token = req.headers["x-access-token"];

        if (token) {
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.username = decoded.username;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;
