const mongoose = require('mongoose');
const path = require('path');
const { title } = require('process');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });

const ObjectId=mongoose.Schema.Types.ObjectId;

const mongoConnectionUrl = process.env.MONGO_CONNECTION_URL;
async function StartMongoConnection() {
    await mongoose.connect(mongoConnectionUrl);
}

const Schema=mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName:{type:String,default:''},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{
    timestamps:true
});

const AdminSchema=new Schema({
    firstName: { type: String, required: true },
    lastName:{type:String,default:''},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},{
    timestamps:true
});

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    courseSlug:{type:String,unique:true},
    price:Number,
    imageUrl:String,
    creatorId:{type:ObjectId,ref:'Admin'},
},{
    timestamps:true
});

const PurchasesScehma=new Schema({
    courseId:ObjectId,
    userId:ObjectId
});

PurchasesScehma.index({ courseId: 1, userId: 1 }, { unique: true });

const UserModel=new mongoose.model("User",UserSchema);
const CourseModel=new mongoose.model("Course",CourseSchema);
const AdminModel=new mongoose.model("Admin",AdminSchema);
const PurchasesModel=new mongoose.model("Purchase",PurchasesScehma);


module.exports={
    StartMongoConnection,
    UserModel,
    CourseModel,
    AdminModel,
    PurchasesModel
};
