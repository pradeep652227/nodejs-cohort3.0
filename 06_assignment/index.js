/*external packages*/
const express=require('express');

/*Internal Modules */
const imports=require('./imports');
const {routes,middlewares,dbContext,services}=imports;

/*Essential instances and variables*/
const app=express();
const PORT=process.env.PORT || 3000;
dbContext.StartMongoConnection();

/*Middlewares*/
app.use(middlewares.loggerMidd);
app.use(express.json());

/*Routes */
app.use('/user',routes.userRoutes);
app.use('/courses',routes.courseRoutes);
app.use('/admin',routes.adminRoutes);

app.use(middlewares.errorMidd);

app.listen(PORT,()=>console.log(`Server is running and listening on PORT ${PORT}`));
