/*external packages*/
const express=require('express');

/*Internal Modules */
const imports=require('./imports');
const routes=imports.routes;
const middlewares=imports.middlewares;

/*Middlewares*/
app.use(middlewares.loggerMidd);

/*Essential instances and variables*/
const app=express();
const PORT=process.env.PORT || 3000;

/*Routes */
app.use('/user',routes.userRoutes);
app.use('/courses',routes.courseRoutes);

app.use(middlewares.errorMidd);

app.listen(PORT,()=>console.log(`Server is running and listening on PORT ${PORT}`));
