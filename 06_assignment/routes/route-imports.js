const userRoutes=require('./user/user');
const courseRoutes=require('./course/courses');
const adminRoutes=require('./user/admin');

console.log('route-imports-here');

module.exports={
    userRoutes,
    courseRoutes,
    adminRoutes
};