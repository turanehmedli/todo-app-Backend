import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minLength: [3, "Title must be at least 3 characters long"],
    maxLength: [25, "Title must be at most 25 characters long"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
    minLength: [3, "description must be at least 3 characters long"],
    maxLength: [100, "description must be at most 25 characters long"],
  },
  completed:{
    type:Boolean,
    default:false,
  },

  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
},{timestamps:true},
);

export const Todo = mongoose.model('Todo',todoSchema)