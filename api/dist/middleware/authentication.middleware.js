"use strict";
exports.__esModule = true;
exports.AuthenticationService = void 0;
var jwt = require("jsonwebtoken");
var users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    },
    {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    },
];
var accessTokenSecret = 'youraccesstokensecret' || process.env.JWT_TOKEN;
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService() {
    }
    AuthenticationService.getUserByToken = function (token) {
        jwt.verify(token, accessTokenSecret, function (err, user) {
            if (err) {
                throw new Error(err);
            }
            return user;
        });
    };
    AuthenticationService.login = function (username, password) {
        // Filter user from the users array by username and password
        var user = users.find(function (u) {
            return u.username === username && u.password === password;
        });
        if (user) {
            // Generate an access token
            return jwt.sign({ username: user.username, role: user.role }, accessTokenSecret);
        }
        throw new Error('username or password does not match');
    };
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
