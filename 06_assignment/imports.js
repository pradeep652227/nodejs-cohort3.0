const routes=require('./routes/route-imports');
const middlewares=require('./middlewares/middleware-imports');

console.log('imports-here');

module.exports={
    abc:'hi',
    routes:routes,
    middlewares:middlewares
}