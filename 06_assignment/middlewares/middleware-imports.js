const authMidd=require('./authMidd');
const errorMidd=require('./errorMidd');
const loggerMidd=require('./loggerMidd');
console.log('middleware-imports-here');

module.exports={
    authMidd,
    errorMidd,
    loggerMidd
};