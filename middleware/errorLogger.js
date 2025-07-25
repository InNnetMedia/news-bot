const eventLogger = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    eventLogger(`${err.name}\t${err.message}`,'errorLogger.txt');
    console.log(err.stack);
    next();
}

module.exports = errorHandler