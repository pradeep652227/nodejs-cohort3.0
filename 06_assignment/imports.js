const routes = require('./routes/route-imports');
const middlewares = require('./middlewares/middleware-imports');
const dbContext = require('./dbContext/mongoose');
const services=require('./services/service-imports');

console.log('imports-here');

module.exports = {
    routes,
    middlewares,
    dbContext,
    services
}