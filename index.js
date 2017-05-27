// Failover in case the user mis-configures their index.handler in lambda
exports.handler = require('./dist').handler;
