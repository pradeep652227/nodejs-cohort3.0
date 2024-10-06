const mongoose = require('mongoose');
const path=require('path');
const dotenv = require('dotenv').config({ path:path.resolve(__dirname,'../modules/.env')  });
const connectionString=process.env.CONNECTION_STRING_MONGO;

async function dbConnect(dbName) {
    try {
        await mongoose.connect(`${connectionString}${dbName}`);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.log("Error connecting to the database:", err);
    }
}

const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String }
});
const TodoSchema = new Schema({
    userId: ObjectId,
    title: String,
    isDone: Boolean
});

const UserModel = new mongoose.model("User", UserSchema);
const TodoModel = new mongoose.model("Todo", TodoSchema);


module.exports = {
    dbConnect: dbConnect,
    models: {
        UserModel: UserModel,
        TodoModel: TodoModel
    }
};
