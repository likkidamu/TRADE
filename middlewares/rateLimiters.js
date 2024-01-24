const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60*1000, //1 minute window
    max: 5,
    handler: (req, res, next) =>{
        let err = new Error("A problem has occured! Try again. Too many login attempts. Please Try again later.Back to home.");
        err.status = 429;
        return next(err);
    }
});