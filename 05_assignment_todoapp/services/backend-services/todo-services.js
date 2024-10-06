const dbService = require('../dbService');

const models = dbService.models;
const TodoModel = models.TodoModel;

// Add a new todo
async function AddTodoAsync(todo) {
    try {
        let res = await TodoModel.create(todo);  // Use create instead of insert
        return res;
    } catch (err) {
        console.log(err);
        return {error:err,errMsg:'Error in adding a todo'};
    }
}

// Get todos by ID
async function GetTodosAsync(userId) {
    try {
        let res = await TodoModel.find({userId:userId});  // Use findById for querying by _id
        return res;
    } catch (err) {
        console.log(err);
        return {error:err, errMsg:'Error in getting todos'};
    }
}

async function GetTodoAsync(todoId) {
    try {
        let res = await TodoModel.findById(todoId);  // Use findById for querying by _id
        return res;
    } catch (err) {
        console.log(err);
        return {error:err, errMsg:'Error in getting a todo'};
    }
}

module.exports = {
    AddTodoAsync: AddTodoAsync,
    GetTodosAsync: GetTodosAsync,
    GetTodoAsync:GetTodoAsync
};
